import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withSnackbar } from "notistack";
import { OrganizationAPI } from "../api";
// import OrganizationIcon from "../Logo/OrganizationIcon";

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
 */
class Signup extends React.Component {
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
      username: "",
      email: "",
      password1: "",
      password2: "",
      usernameValid: "",
      emailValid: "",
      password1Valid: false,
      password2Valid: false,
      organizations: [],
      organization: null
    };
  }
  /**
   * Initializes the Organizations available.
   * 
   */
  async componentDidMount() {
    this.setState({ organizations: await OrganizationAPI.getOrganizations() });
  }

  /**
   * Updates the organization variable
   *
   * @param {Object} e - event triggered if textbox changes
   */
  handleOrganizationChange = (e) => {
    const organization = e.target.value;
    this.setState(Object.assign(this.state, { organization }));
  };

  /**
   * Updates the username state variable
   *
   * @param {Object} e - event triggered if textbox changes
   */
  handleUsernameChange = (e) => {
    const username = e.target.value;
    this.setState(Object.assign(this.state, { username }));
    Object.assign(this.state, { usernameValid: username.length >= 5 });
  };

  /**
   * Updates the email state variable and checks if @ is present
   *
   * @param {Object} e - event triggered if textbox changes
   */
  handleEmailChange = (e) => {
    const email = e.target.value;
    this.setState(Object.assign(this.state, { email }));
    Object.assign(this.state, { emailValid: email.includes("@") });
  };
  /**
   * Updates the password state variable and checks its length
   *
   * @param {Object} e - event triggered if textbox changes
   */

  handlePassword1Change = (e) => {
    this.setState(Object.assign(this.state, { password1: e.target.value }));
    const passLen = this.state.password1.length;
    Object.assign(this.state, { password1Valid: passLen > 7 && passLen < 33 });
    Object.assign(this.state, { password2Valid: this.state.password1 === this.state.password2 });
  };
  /**
   * Updates the password2 state variable and checks if theyre equal
   *
   * @param {Object} e - event triggered if textbox changes
   */

  handlePassword2Change = (e) => {
    this.setState(Object.assign(this.state, { password2: e.target.value }));
    const password2Len = this.state.password2.length;
    Object.assign(this.state, {
      password2Valid: this.state.password1.substr(0, password2Len) === this.state.password2
    });
  };
  /**
   * username, Email password are sent to the API.
   *
   * the server returns a JWT which is stored in state variable if values are valid.
   *
   * @param {Object} e - event triggered when form is submitted.
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    const email = this.state.email;
    const password = this.state.password1;
    const username = this.state.username;
    const organization = this.state.organization;

    const password2Valid = this.state.password1 === this.state.password2;
    this.setState(Object.assign(this.state, { password2Valid }));

    const { context } = this.props;

    const formValid =
      this.state.usernameValid &&
      this.state.emailValid &&
      this.state.password1Valid &&
      this.state.password2Valid &&
      organization;
    if (formValid) {
      await context.actions
        .signup(email, username, password, organization)
        .then((res) => {
          this.props.history.push("profile/?email=" + email);
          this.props.showMessage(`You have successfully signed up ${username}, Redirecting...!`);
        })
        .catch((error) => {
          this.props.history.push("/login/?email=" + email);
          this.props.showMessage(
            `An account holder already exists for this information. Redirecting to login...!`,
            "error"
          );
        });
    } else {
      this.props.showMessage("Please ensure all fields are non-empty and error-free.", "warning");
    }
  };
  render() {
    const usernameError = !this.state.usernameValid && this.state.username.length > 0;
    const emailError = !this.state.emailValid && this.state.email.length > 10;
    const password1Error = !this.state.password1Valid && this.state.password1.length > 0;
    const password2Error = !this.state.password2Valid && this.state.password2.length > 0;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div style={{ marginTop: "64px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar style={{ marginBottom: "8px" }}>
            <VerifiedUserIcon />
          </Avatar>
          <Typography component="h2" variant="h6">
            Sign Up
          </Typography>
          <form style={{ marginTop: "16px" }} onSubmit={this.handleSubmit} noValidate>
            <FormControl variant="outlined" margin="normal" required fullWidth>
              <InputLabel id="organization-label">Organization</InputLabel>
              <Select
                id="organization"
                labelId="organization-label"
                label="Organization *"
                value={this.state.organization}
                onChange={this.handleOrganizationChange}
                autoFocus
              >
                {this.state.organizations.map((organization) => (
                  <MenuItem value={organization}>
                    {/* When you select and organization the logo and name are on different lines */}
                    {/* <ListItemIcon>
                      <OrganizationIcon logo={organization.logo} />
                    </ListItemIcon> */}
                    <ListItemText primary={organization.name}/>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              error={usernameError}
              helperText={usernameError ? "Username needs to be at least 5 characters long" : ""}
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
              value={this.state.email}
              onChange={this.handleEmailChange}
              error={emailError}
              helperText={emailError ? "Please enter a valid email address" : ""}
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
              value={this.state.password1}
              onChange={this.handlePassword1Change}
              error={password1Error}
              helperText={password1Error ? "Password needs to be between 8 and 32 characters long" : ""}
            />
            <TextField
              error={password2Error}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              autoComplete="current-password"
              value={this.state.password2}
              onChange={this.handlePassword2Change}
              helperText={password2Error ? "Passwords don't match." : ""}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Sign Up
            </Button>
            <RouterLink to="/login">
              <Link variant="body1" style={{ display: "block", textAlign: "center", marginTop: "16px" }}>
                Already have an account? Click here to Sign In.
              </Link>
            </RouterLink>
          </form>
        </div>
      </Container>
    );
  }
}
export default withSnackbar(Signup);
