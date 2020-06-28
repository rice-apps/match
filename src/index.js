import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from "react-router-dom";


ReactDOM.render(
    <Router>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Router>
  ,
  document.getElementById('root')
);
