import React from 'react';
import Login from './Login';
import Reset from './Reset';
import { withSnackbar } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Cookies from 'js-cookie';

class App extends React.Component {
  constructor(props) {
    super(props);
    const auth = Cookies.get('auth');
    let authorized = false;
    //Add validation for jwt
    if (auth) {
      authorized = true;
    }
    this.state ={
      authorized
    }
  }
  render(){
    return(
      <Router>
      <Switch>
          <Route path="/dashboard">
            {this.state.authorized? "Dashboard" :<Redirect
                to={{
                  pathname: "/login",
                  state: { referrer: "dashboard" }
                }}
              />}
          </Route>
          <Route path="/reset">
          {this.state.authorized? <Redirect
              to={{
                pathname: "/",
                state: { referrer: "reset" }
              }}
            />:<Reset/>}
          </Route>
          <Route path="/login">
            {this.state.authorized? <Redirect
                to={{
                  pathname: "/",
                  state: { referrer: "login" }
                }}
              />:<Login/>}
          </Route>
          <Route path="/">
            {this.state.authorized? "Dashboard" : <Login />}
          </Route>
        </Switch>
        </Router>
    );
  } 
}

export default withSnackbar(App);
