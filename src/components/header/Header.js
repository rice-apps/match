import React, { useEffect } from 'react';
import { handleClientLoad, handleAuthClick, handleSignoutClick } from '../../util/gapi';
import { Navbar, Nav } from 'react-bootstrap';
import "./Header.css"

import { useRecoilState } from 'recoil';
import { applicationState } from '../../store/atoms';

export default function Header() {
    const [{ user }, setAppState] = useRecoilState(applicationState);

    function authenticationCallback(user) {
        // Logged out
        if (!user) {
            setAppState(oldAppState => {
                return {
                    ...oldAppState,
                    user: null,
                }
            })
        } else {
            // Logged in
            setAppState(oldAppState => {
                let basicProfile = user.getBasicProfile();
                return {
                    ...oldAppState,
                    user: {
                        firstName: basicProfile.getGivenName(),
                        lastName: basicProfile.getFamilyName(),
                        email: basicProfile.getEmail(),
                        image: basicProfile.getImageUrl(),
                    },
                }
            })
        }
    }

    // Triggers google to initialize the client
    useEffect(() => {
        window.addEventListener("google-loaded", () => handleClientLoad(authenticationCallback));
    }, []);

    function handleClearClick() {
        localStorage.clear();
        window.location.reload(false);
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/"><b>Match</b> <p style={{display: "inline", color: "gray"}}>by RiceApps</p></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/pods">Pods</Nav.Link>
                    <Nav.Link href="/settings">Settings</Nav.Link>
                    <Nav.Link> | </Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/ccd">CCD</Nav.Link>
                </Nav>

                <Navbar.Text>
                    {user ? "Signed in as: " + user.firstName : ""}
                </Navbar.Text> &nbsp;
                <button onClick={handleClearClick}>Refresh</button> &nbsp;
                {user ?
                    <div className="AuthenticationSection">
                         <button onClick={handleSignoutClick}>Sign Out</button> &nbsp;
                    </div> :
                    <button onClick={handleAuthClick}>Sign In</button>}
            </Navbar.Collapse>
        </Navbar>        
    );
}


