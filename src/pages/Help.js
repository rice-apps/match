import React from 'react';
import { Card } from 'antd';

export default function About() {

  return (
    <div>
        <div className="Main">
          <Card title ='Covidsitters' className="AboutCard">
            Eventually, we will add a dmeo video here and add more documentation for y'all.
          </Card>
          <Card title ='CCD' className="AboutCard">
                        <ol>
              <li>On the match.riceapps.org website, click on “Match for CCD”</li>
              <li>Sign into your Google Account by clicking on “Sign In” in the top right corner</li>
              <li>Upload your spreadsheet of externship/student data by copying and pasting the URL into the box and hitting “Upload Data”
                  <ul>
                    <li>If you are missing any column information, the site will display a message in red. Please add the column—make it an empty column if it’s not data that you need in your results. </li>
                    <li>Make sure your student rankings tab is called “Rankings” and exactly that—otherwise, the site will not recognize that as the column with the student data. </li>
                  </ul>
              </li>
              <li>Click the “Match” button and then click “Go to Results” to view your matches. The following 4 output files will be added as separate tabs to the original spreadsheet:
                <ol>
                  <li><b>Unmatched externship hosts</b></li>
                  <li><b>Results</b> containing matched students and externships along with student’s email, ranking, class, and major</li>
                  <li><b>Unmatched</b> students along with the their email, ranking, class, and major</li>
                  <li><b>Basic statistic</b> file containing data on the number of matched students, number of unmatched students, percentage of matched students, average rank of matched students,
                      average rank of unmatched students, number of matched externships, number of unmatched externships, and the percentage of matched hosts.
                  </li>
                </ol>
              </li>
            </ol>

            <p> <b>Note</b> The site will not let you click “Go to Results” until you have clicked "Match". Additionally, if you've already matched once, but updated your spreadsheet data and want to re-match, you must re-upload the data to click match again. This will generate an additional 4 tabs, and not delete the previous results.
                The four tabs that will be added to your spreadsheet will have the date and timestamp data. If the time was "1:04", it will be shown as "13:04". This way, you can distinguish between results tabs.
            </p>

            <p>
              <b>How We Make Matches:</b>
            </p>
            <ul>
              <li>Calculate each externships’ Priority. Priority = # slots available - # applicants.</li>
              <li>Sort Externships by Priority. Least competitive externships are first, most competitive ones later. Externships are arbitrarily listed within others with the same priority.</li>
              <li> Start from the first externship in the sorted externship list. Match students starting from rank 1 within the externship </li>
              <li>Continue down the list of sorted externships and assign students.</li>
            </ul>

            <p>
              Overall, we will be going through each externship in the prioritized list and assigning students based on their rank. This will make it more likely for students who applied to multiple externships to get one.
            </p>
          </Card>
        </div>
      </div>
  );
}
