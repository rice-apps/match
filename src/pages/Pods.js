import React from 'react';

import { useRecoilValue } from 'recoil';
import { leftDataState, rightDataState } from '../store/atoms';
import { Card, Row, Col,Button } from "antd";


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

    const { data: leftData, matchColumn: leftMatchColumn, nameColumn: leftNameColumn, emailColumn: leftEmailColumn } = useRecoilValue(leftDataState);
    const { data: rightData, nameColumn: rightNameColumn, emailColumn: rightEmailColumn } = useRecoilValue(rightDataState);

    function generateEmail(hcw, students) {
        const lineBreak = "%0D%0A";
        let addresses = students.map((student) => student.email).join(', ');
        let subject = "HTX CovidTutors: Meet Your Match!";
        let body = 
            "Dear " + hcw.name + " and " + students.name + 
            lineBreak + lineBreak +"We hope this email finds you all well during these difficult and unprecedented times. We want to first thank you, Dr." + hcw.name + ", for being on the front lines of patient care and despite the challenges you face. We are happy to help you and your family in any way we can, and we thank you for trusting us. We also thank you " + students.name + " for volunteering your time to help out. Your efforts are greatly appreciated and do not go unnoticed." +
            lineBreak + lineBreak + "We have paired you two based on your tutoring needs and availability. Attached to this email is contact information for both the healthcare worker and the student." +
            lineBreak + lineBreak + "Healthcare worker:" +
            lineBreak + "Full name: " + hcw.name +
            lineBreak + "Affiliated Institution: " + hcw.institution + // this does not exist yet (they want affiliated institution)
            lineBreak + "Phone: " + hcw.phone + // maybe also does not exist
            lineBreak + "Email: " + hcw.email +
            lineBreak + "Student:" +
            lineBreak + "Full name: " + students.name +
            lineBreak + "Affiliated Institution: " + students.institution + // this does not exist yet (they want affiliated institution)
            lineBreak + "Phone: " + students.phone + // maybe also does not exist
            lineBreak + "Email: " + students.email +
            lineBreak + lineBreak + "For the next steps, please:" +
            lineBreak + "    1.  reach out to each other and discuss plans moving forward. If at any point the matching does not work, either the healthcare worker or the student can reach out to us (volunteers@htxcovidsitters.org), and we can create a new match that is better suited to both of your needs and availability. If either the volunteer or the healthcare workers feels that more volunteers are needed, please let us know through email, and we will match another volunteer to the student." +
            lineBreak + "    2.  Volunteers -- please fill out the Volunteer Log after each tutoring session to track your hours." + // need to put in link to Volunteer Log
            lineBreak + "    3.  Healthcare worker OR volunteer -- if at any point you want to provide feedback, please fill out our Feedback form." + //need to put in link to Feedback form
            lineBreak + lineBreak + "As this process is fluid and ever-evolving, we will be in contact if/when our system changes. We are in constant contact with advising physicians and health professionals and changing our situation as we see fit. It’s our goal to keep all families and volunteers healthy and safe." + 
            lineBreak + lineBreak + "Again, thank you so much for your time and efforts. It is people like you who keep our community and country thriving during difficult times such as these!" +
            lineBreak + lineBreak + "Best," +
            lineBreak + "HTX CovidSitters Team";

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
                <Button type={'primary'} href={'/covidsitters'}> Back to Matching </Button>
                <b> </b>
                <Button href={'/covidsitters/settings'}>Settings</Button>
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
                                        <p><b>Healthcare Worker:</b> {hcw.name} {hcw.email}</p>
                                        <p><b>Volunteers:</b></p>
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
