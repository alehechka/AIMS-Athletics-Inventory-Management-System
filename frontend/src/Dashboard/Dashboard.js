import React from 'react';
import { withSnackbar } from 'notistack';
import Navbar from './Navbar';
import Athletes from './Views/Athletes';
import Home from './Views/Home';
import Inventory from './Views/Inventory';
import Profile from './Views/Profile';
import Staff from './Views/Staff';
import Admin from './Views/Admin';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
  } from "react-router-dom";
import { logout } from '../api/credentials';
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
    openProfile = () => {
        window.location.href='/profile';
    };
    render() {
        const { path } = this.props.match;

        const email = this.props.email;
        const username = this.props.username;
        const role = this.props.role;
        const permissions = {
            "admin": ["Home", "Athletes", "Inventory", "Staff", "Profile", "Admin"],
            "employee": ["Home", "Athletes", "Inventory", "Staff", "Profile"],
            "coach": ["Home", "Athletes", "Inventory", "Profile"],
            "athlete": ["Home", "Profile"]
        };
        let allowedViews = permissions[role];
        //Default views that a newly signed up user can access.
        if (!allowedViews){
            allowedViews = ["Home", "Profile"];
        }
    const unauthorizedUser = (role, page) => (<h3>401 - Unauthorized. As a(n) {role}, you're unauthorized to view {page}. {role === "new user" ? "Please contact an admin to get a role.":""}</h3>);

        return(
            <React.Fragment>
                <Navbar
                    username = {username}
                    role = {role}
                    allowedViews = {allowedViews}
                    noOfItemsCheckedOut = {2}
                    openProfile = {this.openProfile}
                    logOutUser = {logout}
                    organization = {this.props.organization}
                />
                <div style ={{marginLeft: "70px"}}>
                    <div style ={{marginTop: "80px"}}/>
                    <Router>
                        <Switch>
                            <Route path={`/profile`}>
                                <Profile
                                    showMessage ={this.props.showMessage} 
                                    email = {email}
                                    username = {username}
                                    role = {role}
                                />
                            </Route>
                            <Route path={`/athletes`}>
                                {allowedViews.includes('Athletes')?
                                    <Athletes
                                        showMessage ={this.props.showMessage} 
                                        email = {email}
                                        username = {username}
                                        role = {role}
                                    /> : unauthorizedUser(role, 'Athletes')}
                            </Route>
                            <Route path={`/inventory`}>
                                {allowedViews.includes('Inventory')?
                                    <Inventory
                                        showMessage ={this.props.showMessage} 
                                        email = {email}
                                        username = {username}
                                        role = {role}
                                    /> : unauthorizedUser(role, 'Inventory')}
                            </Route>
                            <Route path={`/staff`}>
                                {allowedViews.includes('Staff')?
                                    <Staff
                                        showMessage ={this.props.showMessage} 
                                        email = {email}
                                        username = {username}
                                        role = {role}
                                    /> : unauthorizedUser(role, 'Staff')}
                            </Route>
                            <Route path={`/admin`}>
                                {allowedViews.includes('Admin')?
                                    <Admin
                                        showMessage ={this.props.showMessage} 
                                        email = {email}
                                        username = {username}
                                        role = {role}
                                    /> : unauthorizedUser(role, 'Admin')}
                            </Route>
                            <Route path={`/home`}>
                                <Home
                                    showMessage ={this.props.showMessage} 
                                    email = {email}
                                    username = {username}
                                    role = {role}
                                />
                            </Route>
                            <Route exact path={path}>
                                <Home
                                    showMessage ={this.props.showMessage} 
                                    email = {email}
                                    username = {username}
                                    role = {role}
                                />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </React.Fragment>
        );
    }
}
export default withRouter(withSnackbar(Dashboard));