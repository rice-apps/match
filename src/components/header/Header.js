import React, { useEffect } from 'react';
import { handleClientLoad, handleAuthClick, handleSignoutClick } from '../../util/gapi';
import { Navbar, Nav } from 'react-bootstrap';
import { Button } from 'antd';
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
        // Check if api is already loaded
        if (window.gapi) {
            handleClientLoad(authenticationCallback);
        } else { 
            // Not already loaded; create event listener
            console.log("creating event listener for google-loaded")
            window.addEventListener("google-loaded", () => handleClientLoad(authenticationCallback));
        }
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
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/privacy">Privacy</Nav.Link>
                    <Nav.Link href="/help">Help</Nav.Link>
                </Nav>

                <Navbar.Text>
                    {user ? "Signed in as: " + user.firstName : ""}
                </Navbar.Text> &nbsp;
                <Button onClick={handleClearClick} size='small'>Refresh</Button> &nbsp;
                {user ?
                    <div className="AuthenticationSection">
                         <Button onClick={handleSignoutClick} size='small'>Sign Out</Button> &nbsp;
                    </div> :
                    <Button onClick={handleAuthClick} size='small'>Sign In</Button>}
            </Navbar.Collapse>
        </Navbar>        
    );
}


