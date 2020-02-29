import React from 'react';
import Login from './Login/Login';
import Reset from './Login/Reset';
import Signup from './Login/Signup'
import Dashboard from './Dashboard/Dashboard';
import { withSnackbar } from 'notistack';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import axios from 'axios';
import Cookies from 'js-cookie';

//API URL.
const apiUrl = "http://localhost:5000/api/v1";

/**
 * This main component mainly does the authentication and routing.
 * 
 * State variables:
 * authorized - bool - user authorization.
 * authorization - string- contains the JWT value.
 * email - string- email address of the authorized user.
 * username - string - username of the authorized user.
 * role - JSON - role of the authorized user.
 * 
 * Props passed down from Snackbar provider.
 * 
 * enqueuesnackbar - function - shows a snackbar.
 * closesnackbar - function - closes a snackbar. 
 */
class App extends React.Component {
  /**
   * Initialize all state variables to default values.
   * 
   * @param {*} props props passed down to component
   */
  constructor(props) {
    super(props);
    this.state ={
      authorized: false,
      authorization: "",
      email: "",
      username: "",
      role: {}
    }
  }
  /**
   * showMessage
   * 
   * Displays a snackbar
   */
  showMessage = (msg, type = "success", duration = "30000", vertical = "top", horizontal = "center") =>{
    this.props.enqueueSnackbar(msg, {
      variant: type,
      anchorOrigin: {
          vertical,
          horizontal,
      },
      preventDuplicate: true,
      autoHideDuration: duration,
    });
  }
  /**
   * Lifecycle method that is executed only once.
   * 
   * Get the cookies if they exist to get the jwt.
   * 
   * Pass the get request along with the credentials to the backend for verifying jwt.
   * 
   * Stores the jwt response in react state.
   */
  componentDidMount() {
    const auth = Cookies.get('authorization');    
    //custom config for axios request.
    const config ={
      headers:{
        authorization: auth,
      }
    };
    //if cookie exists validate jwt stored in cookie. 
    if (auth) {
      this.setState(Object.assign(this.state, {authorized: true}));
      axios.get(`${apiUrl}/credentials/current`,config
      ).then(res => {
        const newState = Object.assign({authorized: true, authorization: auth}, res.data);
        this.setState(Object.assign(this.state, newState));
      }).catch(err =>{
        this.setState(Object.assign(this.state, {authorized: false}));
      });
    }
  }
  render(){
    const dashboardApp = (
      <Dashboard
        showMessage ={this.showMessage} 
        authorization = {this.state.authorization}
        email = {this.state.email}
        username = {this.state.username}
        role = {this.state.role}
      />
    );
    const redir = (origin, end) => (
      <Redirect
        to={{
          pathname: end,
          state: { referrer: origin}
        }}
      />
    );
    return(
      <Router>
        <Switch>
            <Route path="/reset">
              {this.state.authorized ? redir("reset", "/") : <Reset showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/login">
              {this.state.authorized ? redir("login", "/"): <Login showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/signup">
              {this.state.authorized ? redir("signup", "/"): <Signup showMessage ={this.showMessage}/>}
            </Route>
            <Route path="/">
              {this.state.authorized? dashboardApp : <Login showMessage ={this.showMessage}/>}
            </Route>
          </Switch>
        </Router>
    );
  } 
}

export default withSnackbar(App);