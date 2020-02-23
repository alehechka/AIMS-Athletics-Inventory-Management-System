import React from 'react';
import './App.css';

import axios from 'axios';

const apiUrl = "http://localhost:5000/api/v1";

class App extends React.Component {

  state = {
    credentials: {},
    email: React.createRef(),
    password: React.createRef()
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.login(this.state.email.current.value, this.state.password.current.value);
  }

  login = async (email, password) => {
    await axios.post(`${apiUrl}/credentials/login`, 
        { email, password },
    ).then(res => {
        this.setState({credentials: res.data});
    })
}

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input ref={this.state.email} placeholder="email" />
          <input ref={this.state.password} type="password" placeholder="password" />
          <button type="submit">Login</button>
        </form>
        <p>{JSON.stringify(this.state.credentials)}</p>
      </div>
    );
  }
  
}

export default App;
