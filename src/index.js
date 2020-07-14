import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from "react-router-dom";
import PersistenceObserver from './components/util/PersistenceObserver';

const initializeState = ({ set }) => {
  let allStoredKeys = Object.keys(localStorage);
  console.log("Retrieved the following data from local storage:", allStoredKeys);
  for (const key of allStoredKeys) {
    if (key !== undefined && key !== "undefined") {
      let value = localStorage.getItem(key);
      if (value) {
        // console.log(key, JSON.parse(value).value);
        set({ key: key }, JSON.parse(value).value);
      }
    }
  }
}

ReactDOM.render(
  <RecoilRoot
    initializeState={initializeState} // Comment this out if you don't want to use local storage
  >
    <Router>
      <PersistenceObserver />
      <App />
    </Router>
  </RecoilRoot>
  ,
  document.getElementById('root')
);
