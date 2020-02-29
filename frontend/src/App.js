import React from 'react';
import Login from './Login/Login';
import Reset from './Login/Reset';
import { withSnackbar } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = "http://localhost:5000/api/v1";
class App extends React.Component {
  constructor(props) {
    super(props);
    let authorized = false;
    //Add validation for jwt
    this.state ={
      authorized
    }
  }
  componentDidMount() {
    const auth = Cookies.get('authorization');    
    const config ={
      headers:{
        authorization: auth,
      }
    };
    if (auth) {
      axios.get(`${apiUrl}/credentials/current`,config
      ).then(res => {
        console.log(res);
        this.setState(Object.assign(this.state,{authorized: true}));
      }).catch(err =>{
        this.setState(Object.assign(this.state, {authorized: false}));
      });
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
