import React from 'react';
import { Card } from 'antd';

export default function About() {

  return (
    <div>
        <div className="Main">
          <Card className="AboutCard">
            <p>
              <a href="http://riceapps.org/">RiceApps</a> <span role="img" aria-label="heart-emoji">❤️</span> &nbsp; <a href="https://ccd.rice.edu/">CCD</a> {"&"} <a href="https://www.htxcovidsitters.org/">HTX Covidsitters</a>.
            </p>
            <p>This website was built for the logistical needs of both the Rice Center for Career Development (CCD) and 
                the Houston chapter of Covidsitters.
            </p>

            <p>We will be uploading a demo video soon, along with written instructions on how this site works.</p>

            <p>This project is <a href="https://github.com/rice-apps/match">open source</a>.</p>

          </Card>
        </div>
      </div>
  );
}
