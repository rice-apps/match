import React from 'react';
import Matcher from './pages/Matcher';
import Assigner from './pages/Assigner';
import Header from './components/header/Header';
import { Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import ControlPanel from './components/control-panel/ControlPanel';

import { useRecoilState } from 'recoil';
import { applicationState } from './store/atoms';

import './App.css';


function App() {
  const [appState, setAppState] = useRecoilState(applicationState);

  function setSidebarOpen(open) {
    setAppState({
      ...appState,
      sidebarOpen: open
    });
  }

  return (
    <div className="App">
      <Sidebar
        sidebar={<ControlPanel/>}
        open={appState.sidebarOpen}
        onSetOpen={() => setSidebarOpen(false)}
        styles={{ sidebar: { background: "white" }}}
        >
      <Header/>

      <Switch>
        {/* <Route path="/covidsitters" component={Matcher}/>*/}
        <Route path="/ccd" component={Assigner}/>
        <Route path="/" component={Matcher}/>
      </Switch>

      </Sidebar>
    </div>
  );
}

export default App;
