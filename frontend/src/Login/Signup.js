import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';
import * as CredentialAPI from "../api/credentials";

/**
 * This Component contains the sign up page along with sign up logic.
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
class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: {},
            username:"", 
            email: "",
            password1: "",
            password2: "",
            usernameValid: "",
            emailValid: "",
            password1Valid: false,
            password2Valid: false,
        }
    }
  /**
   * Updates the username state variable
   * 
   * @param e event triggered if textbox changes
   */ 
  handleUsernameChange =(e) =>{
    const username = e.target.value;
    this.setState(Object.assign(this.state, {username}));
    Object.assign(this.state, {usernameValid : username.length >= 5});
  }
 /**
   * Updates the email state variable and checks if @ is present
   * 
   * @param e event triggered if textbox changes
   */ 
  handleEmailChange =(e) =>{
    const email = e.target.value;
    this.setState(Object.assign(this.state, {email}));
    Object.assign(this.state, {emailValid : email.includes("@")});
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
   * username, Email password are sent to the API.
   * 
   * the server returns a JWT which is stored in state variable if values are valid.
   * 
   * @param e event triggered when form is submitted.
   */
  handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = this.state.email;
    const password = this.state.password1;
    const username = this.state.username;
    
    const password2Valid = this.state.password1 === this.state.password2;
    this.setState(Object.assign(this.state, {password2Valid}));

    const formValid =  this.state.usernameValid && this.state.emailValid && this.state.password1Valid && this.state.password2Valid;
    if(formValid) {
      //TODO logic
      await CredentialAPI.signup(email, username, password)
      .then(res => {
            this.setState(Object.assign(this.state, {credentials: res}));
            this.props.showMessage(`You have successfully signed up ${email}, Redirecting...!`);
            setTimeout(()=>(window.location.href ='/?email=' + email), 3000);
        }).catch(error=>{
          this.props.showMessage(`An account holder already exists for this information. Redirecting to login...!`, "error");
          setTimeout(()=>(window.location.href ='/?email=' + email), 5000);
        });
    }
    else {
      this.props.showMessage("Please ensure all fields are non-empty and error-free.", "warning");
    }
  }
render() {
    const usernameError = !this.state.usernameValid && this.state.username.length > 0;
    const emailError = !this.state.emailValid && this.state.email.length > 10;
    const password1Error = !this.state.password1Valid && this.state.password1.length>0;
    const password2Error = !this.state.password2Valid && this.state.password2.length>0;
    
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style ={{ marginTop: "64px", display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Avatar style ={{ marginBottom: "8px"}}>
            <VerifiedUserIcon />
          </Avatar>
          <Typography component="h2" variant="h6">
            Sign Up
          </Typography>
          <form style ={{ marginTop: "16px"}} onSubmit={this.handleSubmit} noValidate>
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value = {this.state.username}
              onChange ={this.handleUsernameChange}
              autoFocus
              error ={usernameError}
              helperText = {usernameError?"Username needs to be at least 5 characters long":""}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value = {this.state.email}
              onChange ={this.handleEmailChange}
              error ={emailError}
              helperText = {emailError?"Please enter a valid email address":""}
            />
            <TextField
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
              Sign Up
            </Button>
            <Link href="login" variant="body" style ={{display: "block", textAlign: "center", marginTop: "16px"}}>
              Already have an account? Click here to Sign In.
            </Link>
          </form>
        </div>
      </Container>);
  }
}
export default withSnackbar(Signup);