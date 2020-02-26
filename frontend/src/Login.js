import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';

import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = "http://localhost:5000/api/v1";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {},
      email: "",
      password: "",
      invalid: false
    }
  }
  componentDidMount(){
    console.log(this.props);
    //Add warning message
  }
  handleEmailChange =(e) =>{
    this.setState(Object.assign(this.state, {email: e.target.value}));
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const email = this.state.email;
    const password = document.getElementById("password").value;
    await axios.post(`${apiUrl}/credentials/login`,
        { email, password},
    ).then(res => {
        this.setState(Object.assign(this.state, {credentials: res.data}));
        const jwtoken = res.data.token;
        const remember = document.getElementById("remember").checked;
        //Cookie stored for 30 days if checkbox checked
        if(remember) {
            Cookies.set("auth", jwtoken, { expires: 30 });
        }
        else {
            Cookies.set("auth", jwtoken);
        }
        this.props.enqueueSnackbar("Logging in...", {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            preventDuplicate: true,
            autoHideDuration: 30000,
        });
        setTimeout(()=>{ window.location ='/';},3000);
    }).catch(error=>{
        this.setState(Object.assign(this.state, {invalid: true}));
        this.props.enqueueSnackbar("Invalid Credentials", {
            variant: 'error',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
            preventDuplicate: true,
            autoHideDuration: 30000,
        });
    }
    );
  }
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style ={{ marginTop: "64px", display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
          <Avatar style ={{ marginBottom: "8px"}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h2" variant="h6">
            UNO Athletics Inventory Management
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" id = "remember" color="primary" />}
              label="Remember me"
            />
            <Link href="reset" variant="body" style ={{float: "right", marginTop: "8px"}}>
              Forgot password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Log In
            </Button>
            
          </form>
        </div>
      </Container>);
  }
}

export default withSnackbar(Login);
