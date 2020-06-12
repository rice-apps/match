import React, { useState } from 'react';
import DataPanel from './components/data-panel/DataPanel';
import Rule from './components/rule/Rule';
import Sidebar from "react-sidebar";
import './App.css';

var initialRules = [
  {
    "type": "sort",
    "by": "location",
    "operator": "equals",
    "with": {
      type: "column",
      value: "location",
    }
  },
  {
    "type": "sort",
    "by": "car",
    "operator": "equals",
    "with": {
      type: "constant",
      value: "Yes",
    }
  },
  {
    "type": "sort",
    "by": "id",
    "operator": "equals",
    "with": {
      type: "column",
      value: "id",
    }
  },
  // {
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
  const [allRowsRight, setAllRowsRight] = useState();

  const sidebarContent = (
    <div>
      {rules.map((rule, i) => <Rule key={i} rule={rule}/>)}
    </div>
  )

  return (
    <div className="App">
      <Sidebar
        sidebar={sidebarContent}
        open={sidebarOpen}
        onSetOpen={() => setSidebarOpen(false)}
        styles={{ sidebar: { background: "white" } }}
      >
      <button onClick={() => setSidebarOpen(true)}>
        Sort/Filter
      </button>

      <div className="Body">
        <DataPanel 
        onSelectRow={setRowLeft}
        />
        <DataPanel 
        onFileUpload={setAllRowsRight}
        selectedLeftRow={rowLeft}
        rules={rules}/>
      </div>
      </Sidebar>
    </div>
  );
}

export default App;
