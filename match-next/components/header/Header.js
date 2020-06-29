import React from "react";

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
                    <h1><b>match.</b></h1>
                </div>
                <img 
                alt=""
                src={'/riceappslogo.png'}
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


