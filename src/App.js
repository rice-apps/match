import React, { useState } from 'react';
import DataPanel from './components/data-panel/DataPanel';
import './App.css';

function App() {

  
  return (
    <div className="App">
      <div className="Body">
        <DataPanel/>
        <DataPanel/>
      </div>
    </div>
  );
}

export default App;
