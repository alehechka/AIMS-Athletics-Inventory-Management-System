import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { Link as RouterLink } from "react-router-dom";
/**
 * This Component contains the login page along with user authorization logic.
 *
 * State variables:
 * credentials - json - stores the json response from login request.
 * email - string - email of the user
 * password - string- password entered by the user
 * invalid - bool - state variable keeping track of invalid attempts by user
 * noOfAttempts - int - number of login attempts made by the user
 *
 */
class Login extends React.Component {
  /**
   * Initializes react state.
   * 
   * @param {Object} props - passed down from app.js
   * @param {Function} props.showMessage - helper function to display snackbar messages
   */
  constructor(props) {
    super(props);
    this.state = {
      credentials: {},
      email: "",
      password: "",
      remember: false,
      invalid: false,
      noOfAttempts: 0
    };
  }
  /**
   * query Params - Deprecated
   * parses query string params and displays relevant messages.
   */
  componentDidMount() {
    const queryParams = window.location.search;
    let searchParams = new URLSearchParams(queryParams);
    if (searchParams.has("logout")) {
      this.props.showMessage("You have successfully logged out.");
    }
    if (searchParams.has("reset")) {
      this.props.showMessage("Password reset performed successfully, please login with the new password.");
    }
    const email = searchParams.get("email");
    if (email) {
      this.setState(Object.assign(this.state, { email }));
      this.props.showMessage("Sent Password Reset Instructions to: " + email);
    }
  }
  /**
   * Redirects user to home page if user authorized.
   */
  componentDidUpdate() {
    if(this.props.context.authorized) {
      this.props.history.push("/");
    }
  }
  /**
   * Updates the email state variable
   *
   * @param {Object} e - event triggered if textbox changes
   */
  handleEmailChange = (e) => {
    this.setState(Object.assign(this.state, { email: e.target.value }));
  };
  /**
   * Updates the password state variable
   *
   * @param {Object} e - event triggered if textbox changes
   */

  handlePasswordChange = (e) => {
    this.setState(Object.assign(this.state, { password: e.target.value }));
  };
  /**
   * Updates the Remember state variable
   *
   * @param {Object} e - event triggered if checkbox changes
   */

  handleRememberChange = (e) => {
    this.setState(Object.assign(this.state, { remember: e.target.checked }));
  };
  /**
   *
   * Email and password are sent to the API.
   *
   * the server returns a JWT which is stored in a cookie if credentials are valid.
   *
   * @param {Object} e - event triggered when form is submitted.
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState(Object.assign(this.state, { noOfAttempts: this.state.noOfAttempts + 1 }));
    const email = this.state.email;
    const password = this.state.password;
    const remember = this.state.remember;

    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // await axios.post(`${apiUrl}/credentials/login`,
    //     { email, password},
    await context.actions
      .login(email, password, remember)
      .then((res) => {
        

        // //redirect to current link
        // let url = window.location.href.replace(window.location.search, "");

        // let params = new URLSearchParams(window.location.search);
        // params.delete('reset');
        // params.delete('email');
        // params.delete('logout');

        // let queryString = params.toString();

        // let append = "";

        // if (queryString) {
        //   append = "?" + queryString;
        // }
        //window.location.href = ("localhost:3000");
        this.props.history.push(from);
      })
      .catch((error) => {
        //show invalid creds and tell user to reset password if attempts > 3.
        if (this.state.noOfAttempts < 3) {
          this.props.showMessage("Invalid Credentials", "error");
        } else {
          this.props.showMessage("Invalid Credentials", "error", 5000);
          setTimeout(
            this.props.showMessage(
              "Did you forget your password? \n Ask the Admin to change your password.",
              "warning",
              "20000"
            ),
            5100
          );
        }
      });
  };
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar style={{ marginBottom: "8px" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h6">
            UNO Athletics Inventory Management
          </Typography>
          <form style={{ marginTop: "16px" }} onSubmit={this.handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email/Username"
              name="email"
              autoComplete="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  checked={this.state.remember}
                  onChange={this.handleRememberChange}
                  id="remember"
                  color="primary"
                />
              }
              label="Remember me"
            />
            <RouterLink to="/reset">
              <Link variant="body1" style={{ float: "right", marginTop: "8px", display: "none"}}>
                Forgot password?
              </Link>
            </RouterLink>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Log In
            </Button>
            <RouterLink to="/signup">
              <Link variant="body1" style={{ display: "block", textAlign: "center", marginTop: "16px" }}>
                Don't have an account? Click here to Sign Up.
              </Link>
            </RouterLink>
          </form>
        </div>
      </Container>
    );
  }
}

export default withSnackbar(Login);
