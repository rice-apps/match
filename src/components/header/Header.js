import React, { useEffect } from 'react';
import { handleClientLoad, handleAuthClick, handleSignoutClick } from '../../util/gapi';
import RiceAppsLogo from "../../riceappslogo.png";
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

    useEffect(() => {
        window.addEventListener("google-loaded", () => handleClientLoad(authenticationCallback));
    }, []);

    return (
        <div className="Header">
            <img
                alt=""
                src={RiceAppsLogo}
                style={{ marginTop: "-10px", marginLeft: "2vw", width: "5%", height: "5%" }}
                onClick={() => { console.log("Clicked header") }}
            />
            <h1><b>match.</b></h1>
            <div>
                {/* If user is null, show sign in button. If not null, show sign out button */}
                {user ? 
                <div className="AuthenticationSection">
                    <h3> Hello, {user.getBasicProfile().getGivenName()}! </h3> &nbsp;
                    <button id="signout_button" onClick={handleSignoutClick}>Sign Out</button>
                </div> : 
                <button id="authorize_button" onClick={handleAuthClick}>Sign In</button>}
                
            </div>
        </div>
    );
}


