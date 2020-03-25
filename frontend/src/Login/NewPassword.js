import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';
import { CredentialAPI } from "../api";

/**
 * This Component contains the password reset page.
 * 
 * State variables:
 * credentials - json - stores the json response from sign up request.
 * username - string - username
 * email - string - email of the user 
 * password1 - string- password entered by the user
 * password2 - string- password reentered by the user
 * password1Valid - bool - state variable keeping track of password length
 * password2Valid - bool - state variable keeping track of password matching
 * 
 * Props passed down from app.js
 * 
 * showmessage - custom function to enqueue snackbar
 * 
 * Props passed down from Snackbar provider.
 * 
 * enqueuesnackbar - function - shows a snackbar.
 * closesnackbar - function - closes a snackbar.  
 */
class NewPassword extends React.Component {
    constructor(props) {
        super(props);

        const queryParams = window.location.search;
        const searchParams = new URLSearchParams(queryParams);
        const authCode = searchParams.get("authcode");

        this.state = {
            credentials: {},
            authCode,
            password1: "",
            password2: "",
            password1Valid: false,
            password2Valid: false,
        }
    }
    /**
     * Updates the password state variable and checks its length
     * 
     * @param e event triggered if textbox changes
     */ 
    handlePassword1Change =(e) =>{
        this.setState(Object.assign(this.state, {password1: e.target.value}));
        const passLen = this.state.password1.length;
        Object.assign(this.state, {password1Valid : passLen > 7 && passLen < 33});
        Object.assign(this.state, {password2Valid : this.state.password1 === this.state.password2});
    }
    /**
     * Updates the password2 state variable and checks if theyre equal
     * 
     * @param e event triggered if textbox changes
     */ 
    handlePassword2Change =(e) =>{
        this.setState(Object.assign(this.state, {password2: e.target.value}));
        const password2Len = this.state.password2.length;
        Object.assign(this.state, {password2Valid : this.state.password1.substr(0, password2Len) === this.state.password2});
    }
    /**
     * TODO:
     * new password along with authCode sent to the API.
     * 
     * 
     * @param e event triggered when form is submitted.
     */
    handleSubmit = async (e) => {
        e.preventDefault();

        const authCode = this.state.authCode;
        const password = this.state.password1;

        const password2Valid = this.state.password1 === this.state.password2;
        this.setState(Object.assign(this.state, {password2Valid}));

        const formValid = this.state.password1Valid && this.state.password2Valid;
        if (formValid) {
            //API Code here
            console.log(authCode + " " + password);
            this.props.showMessage(`Resetting Password...`);

            //TODO: use proper api call.
            await CredentialAPI.changePassword(password, password).then(
              setTimeout(()=>(window.location.href ='/?reset=true'), 2000)
            );
        }
        else{
            this.props.showMessage("Please make sure passwords match each other and are valid.", "warning");
        }
    }
    render() {
        const password1Error = !this.state.password1Valid && this.state.password1.length>0;
        const password2Error = !this.state.password2Valid && this.state.password2.length>0;
        
        return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div
              style ={{ marginTop: "64px", display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Avatar style ={{ marginBottom: "8px"}}>
                <VpnKeyIcon />
              </Avatar>
              <Typography component="h2" variant="h6">
                Reset Password
              </Typography>
              <form style ={{ marginTop: "16px"}} onSubmit={this.handleSubmit} noValidate>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="authCode"
                  label="Authorization Code"
                  name="authCode"
                  autoComplete="authCode"
                  value = {this.state.authCode}
                  onChange ={this.handleUsernameChange}
                  disabled
                />
                <TextField
                  autoFocus
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password1"
                  label="Password"
                  type="password"
                  id="password1"
                  autoComplete="current-password"
                  value = {this.state.password1}
                  onChange ={this.handlePassword1Change}
                  error ={password1Error}
                  helperText = {password1Error?"Password needs to be between 8 and 32 characters long":""}
                />
                <TextField
                  error = {password2Error}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password"
                  value = {this.state.password2}
                  onChange ={this.handlePassword2Change}
                  helperText = {password2Error?"Passwords don't match.":""}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Reset Password
                </Button>
              </form>
            </div>
          </Container>);
    }
}
export default withSnackbar(NewPassword);