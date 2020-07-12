import React from 'react';
import Loader from '../components/loader/Loader';

import { useRecoilState } from 'recoil';
import { applicationState } from '../store/atoms';

export default function Assigner() {
  const [appState, setAppState] = useRecoilState(applicationState);

  var windowWidth = window.innerWidth;

  function handleData(data) {
    // Handle the data uploaded by the user
  }

  return (
    <div>
        <div className="Main">
            <div className="Body">
            <Loader 
              onUpload={handleData}
              allowManualSort={true}
              />
            </div>
        </div>
      </div>
  );
}
