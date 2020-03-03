import React from 'react';
import { withSnackbar } from 'notistack';
import Navbar from './Navbar';
import Cookies from 'js-cookie';
import Athletes from './Views/Athletes';
import Home from './Views/Home';
import Inventory from './Views/Inventory';
import Profile from './Views/Profile';
import Staff from './Views/Staff';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter,
  } from "react-router-dom";
/**
 * This component contains the UI logic for Dashboard.
 * 
 * State variables:
 * 
 * 
 * Prop variables passed down from App.js:
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
class Dashboard extends React.Component {
    /**
     * Redirects to the profile view
     */
    openProfile = () => {
        window.location.href='/profile';
    };
    /**
     * Deletes auth cookie and refreshes page
     */
    logOutUser =() => {
        Cookies.remove('authorization');
        sessionStorage.removeItem('creds');
        window.location.href = '/';
    }
    render() {
        const { path, url } = this.props.match;
        console.log(url);

        const username = this.props.username;

        let [checkIn, checkOut] = [false, false];
        if(this.props.role){
            [checkIn, checkOut] = [this.props.role.checkIn, this.props.role.checkOut];
        }
        return(
            <React.Fragment>
                <Navbar
                    username = {username}
                    noOfItemsCheckedOut = {3}
                    openProfile = {this.openProfile}
                    logOutUser = {this.logOutUser}
                />
                <div style ={{marginLeft: "70px"}}>
                    <div style ={{marginTop: "80px"}}/>
                    <p>Welcome {username}, you can {checkIn?"checkIn":""}, {checkOut?"checkOut":""}</p>
                    <Router>
                        <Switch>
                            <Route path={`/profile`}>
                                <Profile/>
                            </Route>
                            <Route path={`/athletes`}>
                                <Athletes/>
                            </Route>
                            <Route path={`/inventory`}>
                                <Inventory/>
                            </Route>
                            <Route path={`/staff`}>
                                <Staff/>
                            </Route>
                            <Route path={`/home`}>
                                <Home/>
                            </Route>
                            <Route exact path={path}>
                                <Home/>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </React.Fragment>
        );
    }
}
export default withRouter(withSnackbar(Dashboard));