import React from 'react';
import Home from './pages/Home';
import Matcher from './pages/Matcher';
import Assigner from './pages/Assigner';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Pods from './pages/Pods';
import Privacy from './pages/Privacy';
import Header from './components/header/Header';
import { Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import ControlPanel from './components/control-panel/ControlPanel';

import { useRecoilState } from 'recoil';
import { applicationState } from './store/atoms';

import 'bootstrap/dist/css/bootstrap.min.css';
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

      {/* This is actually the sidebar for the sort/filter control panel. */}
      <Sidebar
        sidebar={<ControlPanel />}
        open={appState.sidebarOpen}
        onSetOpen={() => setSidebarOpen(false)}
        styles={{ sidebar: { background: "white" } }}
      >
        {/* Header should be on every page */}
        <Header />
        <div className="Content">
          <Switch>
            <Route path="/help" component={Help} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/ccd" component={Assigner}/>
            <Route path="/covidsitters/pods" component={Pods}/>
            <Route path="/covidsitters/settings" component={Settings}/>
            <Route path="/covidsitters" component={Matcher}/>
            <Route path="/hivesforheroes/pods" component={Pods}/>
            <Route path="/hivesforheroes/settings" component={Settings}/>
            <Route path="/hivesforheroes" component={Matcher}/>
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Sidebar>
    </div>
  );
}

export default App;
