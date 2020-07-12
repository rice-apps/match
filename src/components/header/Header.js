import React, { useEffect } from 'react';
import { handleClientLoad, handleAuthClick, handleSignoutClick, modifySpreadsheetData } from '../../util/gapi';
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

    function handleTest() {
        modifySpreadsheetData("1AUH7XvrZRWP5brh89P_oZiSoYEj0Fm_wH6i-gLw6iIY", "A1:A4", [["WE GIID"]], (response) => { console.log(response) })
    }

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
                        <button onClick={handleSignoutClick}>Sign Out</button> &nbsp;
                        {/* <button onClick={handleTest}>Test Data Write</button> */}
                    </div> :
                    <button onClick={handleAuthClick}>Sign In</button>}

            </div>
        </div>
    );
}


