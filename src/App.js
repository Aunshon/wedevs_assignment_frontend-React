import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import { useEffect } from 'react';

import LandingComponent from './components/LandingComponent';
import AuthRoute from './components/AuthRoute';
import NoMatch from './components/NoMatch';
import Login from './components/Login';

function App() {
  useEffect(() => {
    M.AutoInit();
  },[])
  return (
    <>
      <Router>
          <Switch>
            {/* <AuthRoute exact={true} path="/" children={<LandingComponent/>} /> */}
            <Route exact={true} path="/" render={props => <LandingComponent {...props} />} /> 
            <Route exact={true} path="/login" render={props => <Login {...props} />} /> 
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
      </Router>
    </>
  );
}

export default App;
