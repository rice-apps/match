import React, { useState } from 'react';
import DataPanel from './components/data-panel/DataPanel';
import ControlPanel from './components/control-panel/ControlPanel';
import Sidebar from "react-sidebar";
import SplitPane, { Pane } from 'react-split-pane';
import './App.css';

var initialRules = [
  // {
  //   "enabled": true,
  //   "type": "sort",
  //   "by": "location",
  //   "operator": "equals",
  //   "with": {
  //     type: "column",
  //     value: "location",
  //   }
  // },
  // {
  //   "enabled": true,
  //   "type": "sort",
  //   "by": "car",
  //   "operator": "equals",
  //   "with": {
  //     type: "constant",
  //     value: "Yes",
  //   }
  // },
  // {
  //   "enabled": true,
  //   "type": "sort",
  //   "by": "id",
  //   "operator": "equals",
  //   "with": {
  //     type: "column",
  //     value: "id",
  //   }
  // },
  // {
  //   "enabled": true,
  //   "type": "filter",
  //   "by": "university",
  //   "operator": "equals",
  //   "with": "Rice University"
  // }
]

function App() {

  const [rules, setRules] = useState(initialRules);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rowLeft, setRowLeft] = useState();

  const [rightColumns, setRightColumns] = useState([]);
  const [leftColumns, setLeftColumns] = useState([]);

  var windowWidth = window.innerWidth;
  var defaultPaneSize = Math.round(windowWidth / 2);

  return (
    <div className="App">
      <Sidebar
        sidebar={<ControlPanel rules={rules} setRules={setRules} rightColumns={rightColumns} leftColumns={leftColumns}/>}
        open={sidebarOpen}
        onSetOpen={() => setSidebarOpen(false)}
        styles={{ sidebar: { background: "white" } }}
      >
        <div className="Main">
          <button style={{position: "absolute", zIndex: 1}}onClick={() => setSidebarOpen(true)}>
            Sort/Filter
          </button>

          <div className="Body">
            <SplitPane split="vertical" minSize={400} defaultSize={defaultPaneSize} style={{overflow: 'auto'}}>
              <DataPanel 
              onFileUpload={setLeftColumns}
              onSelectRow={setRowLeft}
              />
              <DataPanel 
              onFileUpload={setRightColumns}
              selectedLeftRow={rowLeft}
              rules={rules}/>
            </SplitPane>
          </div>
      </div>
      </Sidebar>
    </div>
  );
}

export default App;
