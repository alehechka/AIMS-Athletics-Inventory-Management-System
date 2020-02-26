import React from 'react';
import Login from './Login';
import Reset from './Reset';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
class App extends React.Component {
  render(){
    return(
      <Router>
      <Switch>
          <Route path="/reset">
            <Reset/>
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
        </Router>
    );
  } 
}

export default App;