import React, { Component } from "react";
import { CredentialAPI } from "./api";

const Context = React.createContext();

export class Provider extends Component {
  state = {
    authorized: true
  };

  componentDidMount() {
    let credentials = JSON.parse(sessionStorage.getItem("creds")) || null;
    let organization = JSON.parse(sessionStorage.getItem("org")) || null;
    if (!(credentials && organization)) {
      CredentialAPI.getCredentials()
        .then((res) => {
          this.setCredentials(res, true);
        })
        .catch((err) => {
          this.setCredentials(null, false);
        });
    } else {
      this.setCredentials({ ...credentials, organization }, true);
    }
  }

  render() {
    const { credentials, organization, authorized } = this.state;
    const value = {
      authorized,
      credentials,
      organization,
      actions: {
        signup: this.signup,
        login: this.login,
        logout: this.logout
      }
    };
    return <Context.Provider value={value}>{this.props.children}</Context.Provider>;
  }

  signup = async (email, username, password, remember) => {
    return await CredentialAPI.signup(email, username, password, remember).then((res) => {
      this.setCredentials(res, true);
      return res;
    });
  };

  login = async (email, password, remember) => {
    return await CredentialAPI.login(email, password, remember).then((res) => {
      this.setCredentials(res, true);
      return res;
    });
  };

  logout = async () => {
    return await CredentialAPI.logout().then((res) => {
      this.setCredentials(res, false);
      return res;
    });
  };

  setCredentials = (credentials, authorized) => {
    this.setState({
      authorized,
      credentials: {
        email: credentials?.email,
        username: credentials?.username,
        isAdmin: credentials?.isAdmin,
        isEmployee: credentials?.isEmployee,
        isCoach: credentials?.isCoach,
        isAthlete: credentials?.isAthlete,
      },
      organization: credentials?.organization
    });
  };
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return <Context.Consumer>{(context) => <Component {...props} context={context} />}</Context.Consumer>;
  };
}
