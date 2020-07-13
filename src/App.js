import React from 'react';
import Matcher from './pages/Matcher';
import Settings from './pages/Settings';
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
            {/* Just using / route for now, might want to include /ccd or /covidsitters later. */}
            <Route path="/settings" component={Settings} />
            <Route path="/" component={Matcher} />
          </Switch>
        </div>
      </Sidebar>
    </div>
  );
}

export default App;
