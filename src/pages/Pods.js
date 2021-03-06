import React from 'react';

import { useRecoilValue } from 'recoil';
import { leftDataState, rightDataState } from '../store/atoms';
import { Card, Row, Col,Button } from "antd";
import { useLocation } from 'react-router-dom';

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

    const route = useLocation().pathname.split("/")[1];
    const { data: leftData, matchColumn: leftMatchColumn, nameColumn: leftNameColumn, emailColumn: leftEmailColumn } = useRecoilValue(leftDataState);
    const { data: rightData, nameColumn: rightNameColumn, emailColumn: rightEmailColumn } = useRecoilValue(rightDataState);
    let name1 = route === "hivesforheroes" ? "Newbee:" : "Healthcare Worker:";
    let name2 = route === "hivesforheroes" ? "Mentor:" : "Volunteers:";

    function generateEmail(hcw, students) {
        const lineBreak = "%0D%0A";
        let addresses = students.map((student) => student.email).join(', ');
        let subject = "You have been assigned to a pod!";
        let body = "Congratulations! You have been assigned to a pod." + lineBreak +
            "You have been matched to " + hcw.name + ", who you can reach at " + hcw.email + ".";
        let ccAddress = hcw.email; // TODO: change to appropriate address

        var url = "mailto:" + addresses +
            "?subject=" + subject +
            "&body=" + body +
            "&cc=" + ccAddress;

        window.open(url, '_blank');
    }


    let podsAreEnabled = rightNameColumn && leftNameColumn && leftMatchColumn;
    if (!podsAreEnabled) {
        return (
            <div style={{ marginLeft: 10, marginBottom: 10 }}>
                <b style={{ color: 'red' }}> Pods are disabled: </b>
                <p style={{ color: 'red' }}> Ensure each sheet has a match column and a name column as defined in settings. </p>
            </div>
        );
    }

    // Pods enabled
    // Take only rows from the left that have been matched
    let leftMatched = leftData.filter(leftRow => {
        return leftRow[leftMatchColumn.key] && leftRow[leftMatchColumn.key] !== "[]";
    });

    // Extract pods from the left and right data
    let pods = leftMatched.map((leftRow, i) => {
        // Retrieve and parse matches on left
        let matches = JSON.parse(leftRow[leftMatchColumn.key]);

        // Map out to actual student data (right data rows)
        let students = matches.map(matchID => {
            // Search for matched person in right
            // Using email as matchID
            let leftInRightIndex = rightData.map(row => row[rightEmailColumn.key]).indexOf(matchID);
            let rightRow = rightData[leftInRightIndex];
            return {
                key: leftInRightIndex,
                name: rightRow[rightNameColumn.key],
                email: rightRow[rightEmailColumn.key],
            }
        });

        // Return pod data structure
        return {
            key: i + 1,
            left: {
                key: leftRow.key,
                name: leftRow[leftNameColumn.key],
                email: leftRow[leftEmailColumn.key],
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
            <div style = {{width:"100%", padding:5, backgroundColor:'#f7f7f7'}}>
                <span>
                <b> </b>
                <Button type={'primary'} href={'/' + route}> Back to Matching </Button>
                <b> </b>
                <Button href={'/' + route+'/settings'}>Settings</Button>
                </span>
            </div>
            <div className="Main">
                {groupedPods.map((groupOfPods, i) => {
                    return (
                    <Row key={i} gutter={[16, 16]}>
                        {groupOfPods.map((pod, j) => {
                            let { left: hcw, right: students } = pod;
                            return (
                                <Col key={j} span={6}>
                                    <Card title={"Pod #" + pod.key} size="small" >
                                        <p><b>{name1}</b> {hcw.name} {hcw.email}</p>
                                        <p><b>{name2}</b></p>
                                        <ul>
                                            {
                                                students.map((student, k) => {
                                                    return <li key={k}>{student.name} {student.email}</li>
                                                })
                                            }
                                        </ul>
                                        <Button block={true} onClick={() => generateEmail(hcw, students)}>Generate Email</Button>
                                    </Card>
                                </Col>
                            )
                        })}
                    </Row>)
                })}
            </div>
        </div>
    );
}
