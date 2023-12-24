import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css';
import Login from './App';
import * as serviceWorker from './serviceWorker';
// Components
import AuthorizedContainer from "./Container/AuthorizedContainer";
import DashboardContainer from "./Container/DashboardContainer";
import ChangePasswordContainer from "./Container/ChangePasswordContainer";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/change_password">
          <ChangePasswordContainer />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/authorize">
          <AuthorizedContainer />
        </Route>
        <Route path="/">
          <DashboardContainer />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
