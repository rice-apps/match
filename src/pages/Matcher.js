import React from 'react';
import RightDataPanel from '../components/data-panel/RightDataPanel';
import LeftDataPanel from '../components/data-panel/LeftDataPanel';
import SplitPane from 'react-split-pane';

import { useRecoilState } from 'recoil';
import { applicationState } from '../store/atoms';


export default function Matcher() {
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
            <button style={{position: "absolute", zIndex: 1, marginTop: 10}} onClick={() => setSidebarOpen(true)}>
              Sort/Filter
            </button>

            <div className="Body">
              
              {/* Split plane to allow panel resizing */}
              <SplitPane split="vertical" minSize={400} defaultSize={defaultPaneSize} style={{overflow: 'auto'}}>
                
                <LeftDataPanel/>
                <RightDataPanel/>
              
              </SplitPane>
            </div>
        </div>
      </div>
  );
}
