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

/**
 * This Component contains the sign up page along with sign up logic.
 * 
 * State variables:
 * credentials - json - stores the json response from sign up request.
 * email - string - email of the user 
 * password1 - string- password entered by the user
 * password2 - string- password reentered by the user
 * passwordValid - bool - state variable keeping track of password matching
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
            email: "",
            password1: "",
            password2: "",
            passwordValid: false,
        }
    }
 /**
   * Updates the email state variable
   * 
   * @param e event triggered if textbox changes
   */ 
  handleEmailChange =(e) =>{
    this.setState(Object.assign(this.state, {email: e.target.value}));
  }
  /**
   * Updates the password state variable
   * 
   * @param e event triggered if textbox changes
   */ 
  handlePassword1Change =(e) =>{
    this.setState(Object.assign(this.state, {password1: e.target.value}));
    Object.assign(this.state, {passwordValid : this.state.password1 === this.state.password2});
  }
  /**
   * Updates the password2 state variable and checks if theyre equal
   * 
   * @param e event triggered if textbox changes
   */ 
  handlePassword2Change =(e) =>{
    this.setState(Object.assign(this.state, {password2: e.target.value}));
    Object.assign(this.state, {passwordValid : this.state.password1 === this.state.password2});
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
    //const password = this.state.password1;

    //TODO logic
    this.props.enqueueSnackbar("You have successfully signed up " + email + " !", {
        variant: 'success',
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
        },
        preventDuplicate: true,
        autoHideDuration: 30000,
      });
    setTimeout(()=>{ window.location.href ='/?email=' + email;},3000);
  }
render() {
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value = {this.state.email}
              onChange ={this.handleEmailChange}
              autoFocus
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
            />
            {!this.state.passwordValid&& this.state.password2.length>0?
            <TextField
              error
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Reenter Password"
              type="password"
              id="password2"
              autoComplete="current-password"
              value = {this.state.password2}
              onChange ={this.handlePassword2Change}
              helperText="Passwords don't match."
            />:
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Reenter Password"
                type="password"
                id="password2"
                autoComplete="current-password"
                value = {this.state.password2}
                onChange ={this.handlePassword2Change}
            />
            } 
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