import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withSnackbar } from 'notistack';

//Uncomment after adding api for pwd reset
//import axios from 'axios';

//const apiUrl = "http://localhost:5000/api/v1";
class Reset extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
    }
  }
  handleEmailChange =(e) =>{
    this.setState(Object.assign(this.state, {email: e.target.value}));
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const email = this.state.email;
    //Pwd Reset API code here
    
    this.props.enqueueSnackbar("Sent Password Reset Instructions to " + email + " !", {
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value = {this.state.email}
              onChange ={this.handleEmailChange}
              autoFocus
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

export default withSnackbar(Reset);