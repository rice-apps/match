import React from 'react';
import { Card } from 'antd';
import { Button } from 'antd';

export default function Home() {

  return (
    <div>
        <div className="Main">
          <Card title={'About'} className="AboutCard">
            <p>
              <a href="http://riceapps.org/">RiceApps</a>  <span role="img" aria-label="heart-emoji">❤️</span> &nbsp;<a href="https://ccd.rice.edu/">CCD</a> {"&"} <a href="https://www.htxcovidsitters.org/">HTX Covidsitters</a>
            </p>
            <p>This <a href="https://github.com/rice-apps/match">open source</a> website was built by RiceApps for the logistical needs of both the Rice Center for Career Development (CCD) and 
                the Houston chapter of Covidsitters.
            </p>
          </Card>
          <p></p>
          <Card title={'Privacy'} className="AboutCard">
            <p>
              For easier use, we require access to your Google sheets to read the sheet data, sort and filter, and store the final matches! 
              You can read more about how we use your data at <a href='/privacy'>match.riceapps.org/privacy</a>.
            </p>
          </Card>
          <p></p>
          <p></p>
          <Card title={"Let's match!"} className="AboutCard">
           Enough reading, let's get matching! Click your organizations button below or general if we haven't tailored our software to you.
           <p> </p>
           <Button type={'primary'} block={true} shape={'round'} href='/covidsitters'>Match for Covidsitters</Button>
           <p> </p>
           <Button type={'primary'} block={true} shape={'round'} href='/ccd'>Match for Rice CCD</Button>
           <p> </p>
           {/* <Button type={'primary'} block={true} disabled={true} shape={'round'} href='/general'>General (Coming Soon!)</Button> */}
          </Card>
          <p></p>
        </div>
      </div>
  );
}
