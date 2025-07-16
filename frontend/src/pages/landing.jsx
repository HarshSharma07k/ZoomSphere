import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function LandingPage() {


    const router = useNavigate();

    return (
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>ZoomSphere</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {
                        router("/aljk23")
                    }}>Join as Guest</p>
                    <p onClick={() => {
                        router("/auth")

                    }}>Register</p>
                    <div onClick={() => {
                        router("/auth")

                    }} role='button'>
                        <p>Login</p>
                    </div>
                </div>
            </nav>


            <div className="landingMainContainer">
                <div>
                    <h1><span style={{ color: "#FF9839" }}>Connect</span> with your loved Ones</h1>

                    <p>Cover a distance by ZoomSphere</p>
                    <div role='button'>
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>

                    <img src="https://imgs.search.brave.com/H0omDwDEjK7uAeNKO2eKNkhleADUTEKVNNHkoOCdXPk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zbS5w/Y21hZy5jb20vdC9w/Y21hZ19hdS9waG90/by9yL3JpbmdjZW50/cmEvcmluZ2NlbnRy/YWwtdmlkZW9fNDI5/dy44MDAucG5n" alt="hi" />

                </div>
            </div>



        </div>
    )
}
