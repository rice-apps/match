import React from "react";
import "./Header.css"

import RiceAppsLogo from "../../riceappslogo.png";

const styles = {
    feedback: { 
        float: "right", 
        marginTop: "-50px", 
        marginRight: "2vw" 
    }, 
    logo: { 
        float: "left", 
        marginTop: "-70px", 
        marginLeft: "2vw", 
        width: "5%", 
        height: "5%" 
    }
}

export default function Header() {
    let feedbackURL = "https://forms.gle/6uyRuTxKgP3n53vB6";

    return (
        <div className="Header">
                <div>
                    <h1><b>atch.</b></h1>
                </div>
                <img 
                alt=""
                src={RiceAppsLogo}
                style={styles.logo}
                onClick={() => {console.log("Clicked header")}} 
                />
                {/* <button 
                variant="outlined" 
                style={styles.feedback}
                onClick={() => window.open(feedbackURL, "_blank")}>
                Feedback?
                </button> */}
        </div>
    );
}


