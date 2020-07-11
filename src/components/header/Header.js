import React from "react";
// import { handleClientLoad } from '../../util/gapi'; 
import "./Header.css"

import RiceAppsLogo from "../../riceappslogo.png";

const styles = {
    logo: { 
        float: "left", 
        marginTop: "-10px", 
        marginLeft: "2vw", 
        width: "5%", 
        height: "5%" 
    }
}

export default function Header() {
    function handleSignClick() {
        console.log("YEE");
        // handleClientLoad()
    }

    return (
        <div className="Header">
                <img 
                alt=""
                src={RiceAppsLogo}
                style={styles.logo}
                onClick={() => {console.log("Clicked header")}} 
                />
                <div>
                    <h1><b>match.</b></h1>
                </div>
                <button onClick={handleSignClick}>
                    Sign In
                </button>
        </div>
    );
}


