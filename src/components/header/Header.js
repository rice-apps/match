import React, { useEffect } from 'react';
import { handleClientLoad, handleAuthClick, handleSignoutClick, modifySpreadsheetData } from '../../util/gapi';
import { Navbar, Nav } from 'react-bootstrap';
import "./Header.css"

import { useRecoilState } from 'recoil';
import { applicationState } from '../../store/atoms';

export default function Header() {
    const [{ user }, setAppState] = useRecoilState(applicationState);

    function authenticationCallback(user) {
        setAppState(oldAppState => {
            return {
                ...oldAppState,
                user: user,
            }
        })
    }

    // Triggers google to initialize the client
    useEffect(() => {
        window.addEventListener("google-loaded", () => handleClientLoad(authenticationCallback));
    }, []);

    function handleTest() {
        modifySpreadsheetData("1AUH7XvrZRWP5brh89P_oZiSoYEj0Fm_wH6i-gLw6iIY", "A1:A4", [["WE GIID"]], (response) => { console.log(response) })
    }

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/"><b>Match</b> <p style={{display: "inline", color: "gray"}}>by RiceApps</p></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {/* <Nav.Link href="/">Home</Nav.Link> */}
                    <Nav.Link href="/settings">Settings</Nav.Link>
                </Nav>

                <Navbar.Text>
                    {user ? "Signed in as: " + user.getBasicProfile().getGivenName() : ""}
                </Navbar.Text> &nbsp;
                {user ?
                    <div className="AuthenticationSection">
                         <button onClick={handleSignoutClick}>Sign Out</button> &nbsp;
                         {/* <button onClick={handleTest}>Test Data Write</button> */}
                    </div> :
                    <button onClick={handleAuthClick}>Sign In</button>}
            </Navbar.Collapse>
        </Navbar>        
    );
}


