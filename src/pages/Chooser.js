import React from 'react';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';

import { useRecoilState } from 'recoil';
import { applicationState } from '../store/atoms';


export default function Chooser() {
  const [appState, setAppState] = useRecoilState(applicationState);

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  function setSidebarOpen(open) {
    setAppState({
      ...appState,
      sidebarOpen: open
    });
  }

  return (
    <div>
        <div className="Main">
            <button style={{position: "absolute", zIndex: 1}}onClick={() => setSidebarOpen(true)}>
              Get Results
            </button>

            <div className="Body">
            <LeftDataPanel/>
            </div>
        </div>
      </div>
  );
}
