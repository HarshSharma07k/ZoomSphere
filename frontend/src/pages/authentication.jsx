import * as React from 'react';
import {
    Box,
    Paper,
    TextField,
    Avatar,
    Button,
    CssBaseline,
    FormControlLabel,
    Checkbox,
    Link,
    Typography
} from '@mui/material';
import { Grid } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthContext from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Authentication() {

    

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();


    const [formState, setFormState] = React.useState(0);

    const [open, setOpen] = React.useState(false)


    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {

                let result = await handleLogin(username, password)

                console.log(result);

            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername("");
                setName("");
                setMessage(result);
                setOpen(true);
                setError("")
                setFormState(0)
                setPassword("")
            }
        } catch (err) {

            console.log(err);
            let message = (err.response.data.message);
            setError(message);
        }
    }

    const handleClose = () => {
        setOpen(false)
    }


    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container sx={{ height: '100vh' }}>
            <CssBaseline />
            {/* Left Side Image */}
            <Grid
                sx={{
                    flexBasis: {
                        xs: '0%', sm: '40%', md: '58%',
                    },
                    display: { xs: 'none', sm: 'block' },
                    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[50]
                            : theme.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            {/* Right Side Form */}
            <Grid
                    component={Paper}
                    elevation={6}
                    square
                    sx={{
                        flexGrow: 1,
                        flexBasis: {
                            xs: '100%', sm: '60%', md: '42%',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 400,
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Button variant={formState === 0 ? "contained" : "outlined"} onClick={() => setFormState(0)}>
                                Sign In
                            </Button>
                            <Button variant={formState === 1 ? "contained" : "outlined"} onClick={() => setFormState(1)}>
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                            {formState === 1 && (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="fullname"
                                    label="Full Name"
                                    name="fullname"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {error && (
                                <p style={{ color: "red" }}>{error}</p>
                            )}

                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login" : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar

                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={handleClose}
            />

        </ThemeProvider>
    );
}