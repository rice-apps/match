import React, { useState } from 'react';
import DataPanel from './components/data-panel/DataPanel';
import './App.css';

function App() {

  const [rowA, setRowA] = useState();
  const [allRowsB, setAllRowsB] = useState();

  return (
    <div className="App">
      <div className="Body">
        <DataPanel onSelectRow={setRowA}/>
        <DataPanel onFileUpload={setAllRowsB}/>
      </div>
    </div>
  );
}

export default App;
