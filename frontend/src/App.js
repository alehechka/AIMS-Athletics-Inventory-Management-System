import React from "react";
import Login from "./Login/Login";
import Reset from "./Login/Reset";
import Signup from "./Login/Signup";
import Dashboard from "./Dashboard/Dashboard";
import { withSnackbar } from "notistack";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import * as CredentialAPI from "./api/credentials";

/**
 * This main component mainly does the authentication and routing.
 *
 * State variables:
 * authorized - bool - user authorization.
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
    this.state = {
      authorized: false,
      email: "",
      username: "",
      role: "",
      organization: null
    };
  }
  /**
   * showMessage
   *
   * Displays a snackbar
   */
  showMessage = (
    msg,
    type = "success",
    duration = 30000,
    vertical = "top",
    horizontal = "center"
  ) => {
    this.props.enqueueSnackbar(msg, {
      variant: type,
      anchorOrigin: {
        vertical,
        horizontal
      },
      preventDuplicate: true,
      autoHideDuration: duration
    });
  };
  /**
   * sets role based on JSON received
   *
   * @param {*} creds JSON response
   */
  setRole = creds => {
    let role = "new user";
    if (creds.isAdmin) {
      role = "admin";
    } else if (creds.isEmployee) {
      role = "employee";
    } else if (creds.isCoach) {
      role = "coach";
    } else if (creds.isAthlete) {
      role = "athlete";
    }
    this.setState(Object.assign(this.state, { role }));
  };
  /**
   * Lifecycle method that is executed only once.
   *
   * Will hit backend to check if a current user is logged in (via authorization httpOnly cookie)
   *
   * If so, will set state to the returned credentials,
   * else will be routed to login page.
   *
   */
  componentDidMount() {
    let sessionCreds = JSON.parse(sessionStorage.getItem('creds'));
    let sessionOrg = JSON.parse(sessionStorage.getItem('org'));
    if (sessionCreds && sessionOrg) {
      this.setState(Object.assign(this.state, {...sessionCreds, organization: sessionOrg}));
      this.setRole(sessionCreds);
    } else {
      CredentialAPI.getCredentials()
        .then(res => {
          this.setState(Object.assign(this.state, {
            authorized: true,
            email: res.email,
            username: res.username,
            organization: res.organization
          }));
          this.setRole(res);
        })
        .catch(err => {
          //console.log("Authorization failed")
        });
    }
  }
  render() {
    const dashboardApp = (
      <Dashboard
        showMessage={this.showMessage}
        email={this.state.email}
        username={this.state.username}
        role={this.state.role}
        organization={this.state.organization}
      />
    );
    const redir = (origin, end) => (
      <Redirect
        to={{
          pathname: end,
          state: { referrer: origin }
        }}
      />
    );
    return (
      <Router>
        <Switch>
          <Route path="/reset">
            {this.state.authorized ? (
              redir("reset", "/")
            ) : (
              <Reset showMessage={this.showMessage} />
            )}
          </Route>
          <Route path="/login">
            {this.state.authorized ? (
              redir("login", "/")
            ) : (
              <Login showMessage={this.showMessage} />
            )}
          </Route>
          <Route path="/signup">
            {this.state.authorized ? (
              redir("signup", "/")
            ) : (
              <Signup showMessage={this.showMessage} />
            )}
          </Route>
          <Route path="/">
            {this.state.authorized ? (
              dashboardApp
            ) : (
              <Login showMessage={this.showMessage} />
            )}
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default withSnackbar(App);
