import React from 'react';
import { Card } from 'antd';

export default function Privacy() {

  return (
    <div>
        <div className="Main">
          <Card title="Privacy Policy" className="PrivacyCard">
            <p>
              RiceApps is a student-run organization on campus that builds web applications for organizations at Rice University and within the Greater Houston Area. We are a team of undergraduates building a web application, Match, for Project Covidsitters. The aim of our project is to connect student volunteers with healthcare workers in the Texas Medical Center to help healthcare workers with childcare, pet-sitting, and running errands.
            </p>
            <p>
              RiceApps is requesting file-by-file access to data specified by the user in their Google Drive. This data includes Google spreadsheet information that will be used to make matches for our client, Covidsitters. RiceApps is also requesting permission to modify the files specified by the user to show our output matches by adding new tabs to the original spreadsheet.
              </p>
              <p>
              To use this app, you must allow RiceApps to view and edit specified spreadsheets.
            </p>
          </Card>
        </div>
      </div>
  );
}
