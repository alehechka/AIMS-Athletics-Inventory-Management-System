import React from 'react';
import { withSnackbar } from 'notistack';
import Navbar from './Navbar';
import Cookies from 'js-cookie';

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
    openProfile = () => {
        alert("profile");
    };
    logOutUser =() => {
        Cookies.remove('authorization');
        window.location = '/';
    }
    render() {
        
        const username = this.props.username;
        const [checkIn, checkOut] = [this.props.role.checkIn, this.props.role.checkOut];
        return(
            <React.Fragment>
                <Navbar
                    username = {username}
                    noOfItemsCheckedOut = {3}
                    openProfile = {this.openProfile}
                    logOutUser = {this.logOutUser}
                />
                <p>Welcome {username}, you can {checkIn?"checkIn":""}, {checkOut?"checkOut":""}</p>
            </React.Fragment>
        );
    }
}
export default withSnackbar(Dashboard);