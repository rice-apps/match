import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Button } from "antd";
import "./EmailClient.css"

import {useRecoilState} from 'recoil';
import {emailClientState} from '../../store/atoms';
import Pods from "../../pages/Pods";

import { composeAndSendEmail } from "../../util/gapi.js";


/**
 * Email client:
 * Window with subject, to/from etc. etc.
 * using antd form https://ant.design/components/form/
 */

const layout = {
  labelCol: {
    span: 0,
  },
};


// function generateEmailBody(major,minors){
//   //Introduction
//   const body = "Dear " + major.name + " and " + minorNames + ",";
//   const lineBreak = "\n";
  
//   //Introduction & Healthcareworker information
//   body += lineBreak + lineBreak +"We hope this email finds you all well during these difficult and unprecedented times. We want to first thank you, Dr." + major.name + ", for being on the front lines of patient care and despite the challenges you face. We are happy to help you and your family in any way we can, and we thank you for trusting us. We also thank you " + students.name + " for volunteering your time to help out. Your efforts are greatly appreciated and do not go unnoticed." +
//   lineBreak + lineBreak + "We have paired you two based on your tutoring needs and availability. Attached to this email is contact information for both the healthcare worker and the student." +
//   lineBreak + lineBreak + "Healthcare worker:" +
//   lineBreak + "Full name: " + major.name +
//   lineBreak + "Affiliated Institution: " + major.institution + // this does not exist yet (they want affiliated institution)
//   lineBreak + "Phone: " + major.phone;  // maybe also does not exist
//   lineBreak + lineBreak + "For the next steps, please:" +
//   lineBreak + "    1.  reach out to each other and discuss plans moving forward. If at any point the matching does not work, either the healthcare worker or the student can reach out to us (volunteers@htxcovidsitters.org), and we can create a new match that is better suited to both of your needs and availability. If either the volunteer or the healthcare workers feels that more volunteers are needed, please let us know through email, and we will match another volunteer to the student." +
//   lineBreak + "    2.  Volunteers -- please fill out the Volunteer Log after each tutoring session to track your hours." + // need to put in link to Volunteer Log
//   lineBreak + "    3.  Healthcare worker OR volunteer -- if at any point you want to provide feedback, please fill out our Feedback form." + //need to put in link to Feedback form
//   lineBreak + lineBreak + "As this process is fluid and ever-evolving, we will be in contact if/when our system changes. We are in constant contact with advising physicians and health professionals and changing our situation as we see fit. It’s our goal to keep all families and volunteers healthy and safe." + 
//   lineBreak + lineBreak + "Again, thank you so much for your time and efforts. It is people like you who keep our community and country thriving during difficult times such as these!" +
//   lineBreak + lineBreak + "Best," +
//   lineBreak + "HTX CovidSitters Team"
//   return body
// }

export function EmailUI(props) {
  const [setDataState] = useRecoilState(emailClientState);

  var recipientEmails = "";
  props.recipients.forEach(r => recipientEmails += r + ", ");
  console.log("AHHHHHHHHHH",recipientEmails)

  function closeClient(){
    setDataState(oldDataState => {
        return {
        ...oldDataState,
        showClient:false,
        }
      }
    )
  }

  return(
      <div className = "EmailBox">
        <Form
          {...layout}
          name="basic"
          layout="horizontal"
          initialValues={{
            // Initial Values of the input form
            recipients: recipientEmails,
            body: props.body,
            subject: props.subject,
          }}
        >
          <Form.Item
            label="Recipients"
            name="recipients"
            rules={[
              {
                required: true,
                message: "Please input recipients!"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[
              {
                required: true,
                message: "Please input subject!"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Body"
            name="body"
            rules={[
              {
                required: true,
                message: "Please input body!"
              }
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={()=>{
              composeAndSendEmail(recipientEmails,props.subject,props.body);
              closeClient();
            }}>
              Send
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={closeClient}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
  )
};