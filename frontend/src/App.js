import React from "react";
import Login from "./Login/Login";
import Reset from "./Login/Reset";
import Signup from "./Login/Signup";
import NewPassword from "./Login/NewPassword";
import Dashboard from "./Dashboard/Dashboard";
import { withSnackbar } from "notistack";
import withContext from "./Context";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

const LoginWithContext = withContext(Login);
const ResetWithContext = withContext(Reset);
const SignupWithContext = withContext(Signup);
const NewPasswordWithContext = withContext(NewPassword);
const DashboardWithContext = withContext(Dashboard);

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
   * showMessage
   *
   * Displays a snackbar
   */
  showMessage = (msg, type = "success", duration = 7000, vertical = "top", horizontal = "center") => {
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

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/reset" component={(props) => <ResetWithContext {...props} showMessage={this.showMessage} />} />
          <Route
            path="/newpassword"
            component={(props) => <NewPasswordWithContext {...props} showMessage={this.showMessage} />}
          />
          <Route path="/login" component={(props) => <LoginWithContext {...props} showMessage={this.showMessage} />} />
          <Route
            path="/signup"
            component={(props) => <SignupWithContext {...props} showMessage={this.showMessage} />}
          />
          <PrivateRoute
            path="/"
            component={(props) => <DashboardWithContext {...props} showMessage={this.showMessage} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default withSnackbar(App);
