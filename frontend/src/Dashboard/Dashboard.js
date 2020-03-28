import React from "react";
import { withSnackbar } from "notistack";
import Navbar from "./Navbar";
import Athletes from "./Views/Athletes";
import Home from "./Views/Home";
import Inventory from "./Views/Inventory";
import Profile from "./Views/Profile";
import Staff from "./Views/Staff";
import Admin from "./Views/Admin";

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
      isAdmin: ["Home", "Athletes", "Inventory", "Staff", "Profile", "Admin"],
      isEmployee: ["Home", "Athletes", "Inventory", "Staff", "Profile"],
      isCoach: ["Home", "Athletes", "Inventory", "Profile"],
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
    //Default views that a newly signed up user can access.
    const unauthorizedUser = (page) => (
      <h3>
        401 - You are unauthorized to view {page}. {authorize([]) ? "Please contact an admin to get a role." : ""}
      </h3>
    );

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
                <Route path={`/profile`} component={(props) => <Profile {...props} />} />
                <Route
                  path={`/athletes`}
                  component={(props) =>
                    allowedViews.includes("Athletes") ? <Athletes {...props} /> : unauthorizedUser("Athletes")
                  }
                />
                <Route
                  path={`/inventory`}
                  component={(props) =>
                    allowedViews.includes("Inventory") ? <Inventory {...props} /> : unauthorizedUser("Inventory")
                  }
                />
                <Route
                  path={`/staff`}
                  component={(props) =>
                    allowedViews.includes("Staff") ? <Staff {...props} /> : unauthorizedUser("Staff")
                  }
                />
                <Route
                  path={`/admin`}
                  component={(props) =>
                    allowedViews.includes("Admin") ? <Admin {...props} /> : unauthorizedUser("Admin")
                  }
                />
                <Route path={`/home`} component={(props) => <Home {...props} />} />
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
