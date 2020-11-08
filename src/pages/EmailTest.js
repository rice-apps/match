import React from 'react';
import {composeAndSendEmail} from '../util/gapi';
import { useRecoilValue } from 'recoil';

import {Button } from 'antd';

import { applicationState } from '../store/atoms';

export default function EmailTest() {
    const { user } = useRecoilValue(applicationState);
    if(user){
        return <Button onClick = {() => composeAndSendEmail("adz2@rice.edu","bdu1@rice.edu","Wassup Homie","Wow bottom text!")}>SEND EMAIL BOI</Button>
    } else {
        return <p>Please login idiot.</p>
    }
}

  