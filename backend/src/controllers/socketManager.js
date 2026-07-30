import { Server } from "socket.io";

const DEFAULT_ROOM_CAPACITY = 12;
const DEFAULT_MESSAGE_HISTORY_LIMIT = 100;

const getRoomCapacity = () => {
    const parsedCapacity = Number(process.env.MAX_PARTICIPANTS_PER_ROOM ?? DEFAULT_ROOM_CAPACITY);

    return Number.isFinite(parsedCapacity) && parsedCapacity > 0
        ? parsedCapacity
        : DEFAULT_ROOM_CAPACITY;
};

const getMessageHistoryLimit = () => {
    const parsedLimit = Number(process.env.MAX_ROOM_MESSAGE_HISTORY ?? DEFAULT_MESSAGE_HISTORY_LIMIT);

    return Number.isFinite(parsedLimit) && parsedLimit > 0
        ? parsedLimit
        : DEFAULT_MESSAGE_HISTORY_LIMIT;
};

const roomCapacity = getRoomCapacity();
const messageHistoryLimit = getMessageHistoryLimit();

const rooms = new Map();

const getOrCreateRoom = (roomId) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            participants: new Set(),
            messages: []
        });
    }

    return rooms.get(roomId);
};

const capMessageHistory = (roomState) => {
    if (roomState.messages.length > messageHistoryLimit) {
        roomState.messages.splice(0, roomState.messages.length - messageHistoryLimit);
    }
};

export const connectToSocket = (server) => {
    const configuredOrigins = (process.env.SOCKET_CORS_ORIGIN ?? process.env.CORS_ORIGIN ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    const io = new Server(server, {
        cors: {
            origin: configuredOrigins.length > 0 ? configuredOrigins : "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: configuredOrigins.length > 0
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true
        }
    });

    io.on("connection", (socket) => {
        socket.on("join-call", (path) => {
            const roomId = typeof path === "string" ? path.trim() : "";

            if (!roomId) {
                socket.emit("room-error", { message: "Room id is required." });
                return;
            }

            const roomState = getOrCreateRoom(roomId);

            if (roomState.participants.has(socket.id)) {
                return;
            }

            if (roomState.participants.size >= roomCapacity) {
                socket.emit("room-full", {
                    roomId,
                    limit: roomCapacity,
                    currentCount: roomState.participants.size
                });
                socket.disconnect(true);
                return;
            }

            const existingParticipants = Array.from(roomState.participants);

            socket.data.roomId = roomId;
            socket.join(roomId);
            roomState.participants.add(socket.id);

            socket.to(roomId).emit("user-joined", socket.id, [socket.id]);
            socket.emit("user-joined", socket.id, existingParticipants);

            for (const message of roomState.messages) {
                socket.emit("chat-message", message.data, message.sender, message.socketIdSender);
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            const roomId = socket.data.roomId;

            if (!roomId) {
                return;
            }

            const roomState = rooms.get(roomId);

            if (!roomState) {
                return;
            }

            const messageRecord = {
                sender,
                data,
                socketIdSender: socket.id
            };

            roomState.messages.push(messageRecord);
            capMessageHistory(roomState);

            io.to(roomId).emit("chat-message", data, sender, socket.id);
        });

        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;

            if (!roomId) {
                return;
            }

            const roomState = rooms.get(roomId);

            if (!roomState) {
                return;
            }

            roomState.participants.delete(socket.id);
            socket.to(roomId).emit("user-left", socket.id);

            if (roomState.participants.size === 0) {
                rooms.delete(roomId);
            }
        });
    });

    return io;
};

