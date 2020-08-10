import React from 'react';

import { useRecoilValue } from 'recoil';
import { leftDataState, rightDataState } from '../store/atoms';
import { Card, Row, Col } from "antd";


// SAMPLE PODS DATA STRUCTURE:
// let pods = [{
//     key: 1,
//     left: {
//         key: 1,
//         name: "Jonathan",
//         email: "caimjonathan@gmail.com",
//     },
//     right: [{
//         key: 3,
//         name: "Sarah",
//         email: "sarah@gmail.com",
//     }, {
//         key: 5,
//         name: "George",
//         email: "george@gmail.com",
//     }]
// }];


export default function Pods() {

    const { data: leftData, matchColumn: leftMatchColumn, nameColumn: leftNameColumn } = useRecoilValue(leftDataState);
    const { data: rightData, nameColumn: rightNameColumn } = useRecoilValue(rightDataState);

    function generateEmail(hcw, students) {
        let addresses = students.map((student) => student.email).join(', ');
        let subject = "You have been assigned to a pod!";
        let body = "Congratulations! You have been assigned to a pod.\n" + 
                   "You have been matched to " + hcw.name + ", who you can reach at " + hcw.email + ".";
        let ccAddress = hcw.email; // TODO: change to appropriate address

        var url = "mailto:" + addresses +
                "?subject=" + subject +
                "&body=" + body +
                "&cc=" + ccAddress;

        var win = window.open(url, '_blank');
    }

    //Pods enabled
    if (rightNameColumn && leftNameColumn && leftMatchColumn) {
      // Take only rows from the left that have been matched
      let leftMatched = leftData.filter(leftRow => {
          return leftRow[leftMatchColumn.key] && leftRow[leftMatchColumn.key] !== "[]";
      });

      // Extract pods from the left and right data
      let pods = leftMatched.map((leftRow, i) => {
          // Retrieve and parse matches on left
          let matches = JSON.parse(leftRow[leftMatchColumn.key]);

          // Map out to actual student data (right data rows)
          let students = matches.map(match => {
              let rightIndex = match[0];
              let rightRow = rightData[rightIndex];
              return {
                  key: rightIndex,
                  name: rightRow[rightNameColumn.key],
                  email: "testing@gmail.com",
              }
          });

          // Return pod data structure
          return {
              key: i + 1,
              left: {
                  key: leftRow.key,
                  name: leftRow[leftNameColumn.key],
                  email: "testing@gmail.com",
              },
              right: students
          }
      });

      // Group into list of lists of pods to fit formatting of grid below
      let groupedPods = [];
      let groupSize = 4;
      for (let i = 0; i < pods.length; i++) {
          if (i % groupSize === 0) {
              groupedPods.push([])
          }
          groupedPods[groupedPods.length - 1].push(pods[i]);
      }
      return (
            <div>
              <div className="Main">
                  {groupedPods.map(groupOfPods => {
                      return (<Row gutter={[16, 16]}>
                          {groupOfPods.map((pod, i) => {
                              let { left: hcw, right: students } = pod;
                              return (
                                  <Col span={6}>
                                      <Card key={i} title={"Pod #" + pod.key} size="small" >
                                          <p><b>Healthcare Worker:</b> {hcw.name} {hcw.email}</p>
                                          <p><b>Volunteers:</b></p>
                                          <ul>
                                              {
                                                  students.map((student, i) => {
                                                      return <li key={i}>{student.name} {student.email}</li>
                                                  })
                                              }
                                          </ul>
                                          <button onClick={() => generateEmail(hcw, students)}>Generate Email</button>
                                      </Card>
                                  </Col>
                              )
                          })}
                      </Row>)
                  })}
              </div>
          </div>
      );
    } else {
      return (
        <div style = {{marginLeft:10, marginBottom:10}}>
          <b style = {{color:'red'}}> Pods are disabled: </b>
          <p style = {{color:'red'}}> Ensure each sheet has a match column and a name column as defined in settings. </p>
        </div>
      );
    }
}
