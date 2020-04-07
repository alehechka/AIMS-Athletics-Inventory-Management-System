import React from "react";
import { withSnackbar } from "notistack";
import Navbar from "./Navbar";
import Home from "./Views/Home";
import Inventory from "./Views/Inventory";
import Profile from "./Views/Profile";
import Users from "./Views/Users"
import Admin from "./Views/Admin";
import Transaction from "./Views/Transaction";
import AuthRoute from "../AuthRoute";

import { BrowserRouter as Router, Switch, Route, withRouter, Redirect } from "react-router-dom";

/**
 * This component contains the UI logic for Dashboard. Redirects based on view selected.
 *
 * State variables:
 * None
 *
 * Prop variables passed down from App.js:
 * email - string- email address of the authorized user.
 * username - string - username of the authorized user.
 * role - string - role of the authorized user.
 * showmessage - custom function to enqueue snackbar.
 *
 * Props passed down from Snackbar provider.
 *
 * enqueuesnackbar - function - shows a snackbar.
 * closesnackbar - function - closes a snackbar.
 */
class Dashboard extends React.Component {
  /**
   * Redirects to the profile view
   */

  render() {
    const { pathname } = this.props.location;
    const { context } = this.props;
    const { credentials } = context;
    const permissions = {
      isAdmin: ["Home", "Athletes", "Inventory", "Staff", "Profile", "Admin", "Transactions"],
      isEmployee: ["Home", "Athletes", "Inventory", "Staff", "Profile", "Transactions"],
      isCoach: ["Home", "Athletes", "Inventory", "Profile", "Transactions"],
      isAthlete: ["Home", "Profile"],
      isNewUser: ["Home", "Profile"]
    };
    const authorize = (permissions) => {
      let accessGranted = false;
      for (let permission of permissions) {
        accessGranted |= credentials?.[permission];
      }
      return accessGranted;
    };
    let allowedViews =
      permissions[
        authorize(["isAdmin"])
          ? "isAdmin"
          : authorize(["isEmployee"])
          ? "isEmployee"
          : authorize(["isCoach"])
          ? "isCoach"
          : authorize(["isAthlete"])
          ? "isAthlete"
          : "isNewUser"
      ];

    return (
      <React.Fragment>
        <div style={{ marginLeft: "70px" }}>
          <div style={{ marginTop: "80px" }} />
          <Router>
            <div>
              <Navbar
                context={context}
                allowedViews={allowedViews}
                noOfItemsCheckedOut={2}
                logOutUser={context.actions.logout}
              />
              <Switch>
                <AuthRoute
                  path={`/profile`}
                  accessGranted={allowedViews.includes("Profile")}
                  component={(props) => <Profile {...props} showMessage={this.props.showMessage} context={context} />}
                />
                <AuthRoute
                  path={`/athletes`}
                  accessGranted={allowedViews.includes("Athletes")}
                  component={(props) => <Users {...props} type={"Athletes"} showMessage={this.props.showMessage} context={context} />}
                />
                <AuthRoute
                  path={`/transactions`}
                  accessGranted={allowedViews.includes("Transactions")}
                  component={(props) => (
                    <Transaction {...props} showMessage={this.props.showMessage} context={context} />
                  )}
                />
                <AuthRoute
                  path={`/inventory`}
                  accessGranted={allowedViews.includes("Inventory")}
                  component={(props) => <Inventory {...props} showMessage={this.props.showMessage} context={context} />}
                />
                <AuthRoute
                  path={`/staff`}
                  accessGranted={allowedViews.includes("Staff")}
                  component={(props) => <Users {...props} type={"Staff"} showMessage={this.props.showMessage} context={context} />}
                />
                <AuthRoute
                  path={`/admin`}
                  accessGranted={allowedViews.includes("Admin")}
                  component={(props) => <Admin {...props} showMessage={this.props.showMessage} context={context} />}
                />
                <AuthRoute
                  path={`/home`}
                  accessGranted={allowedViews.includes("Home")}
                  component={(props) => <Home {...props} showMessage={this.props.showMessage} context={context} />}
                />
                <Route exact path={pathname}>
                  <Redirect to="/home" />
                </Route>
              </Switch>
            </div>
          </Router>
        </div>
      </React.Fragment>
    );
  }
}
export default withSnackbar(withRouter(Dashboard));
