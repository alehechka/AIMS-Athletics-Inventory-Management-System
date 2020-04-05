import React, { Component } from "react";
import { CredentialAPI, changeFavicon } from "./api";

const Context = React.createContext();

export class Provider extends Component {
  state = {
    credentials: JSON.parse(sessionStorage.getItem("creds")) || null,
    organization: JSON.parse(sessionStorage.getItem("org")) || null,
    authorized: sessionStorage.getItem("creds") ? true : false,
    loadingCredentials: true
  };

  componentDidMount() {
    if (!(this.state.credentials && this.state.organization)) {
      CredentialAPI.getCredentials()
        .then((res) => {
          this.setCredentials(res, true);
        })
        .catch((err) => {
          this.setCredentials(null, false);
        });
    } else {
      this.setCredentials({ ...this.state.credentials, organization: this.state.organization }, true);
    }
    this.setState({ loadingCredentials: false });
  }

  render() {
    const { credentials, organization, authorized, loadingCredentials } = this.state;
    const value = {
      authorized,
      credentials,
      organization,
      loadingCredentials,
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
    if(credentials?.isOwner) {
      this.setState(prev => {
        return {credentials: {...prev.credentials, isOwner: credentials.isOwner}}
      })
    } 
    if (credentials?.organization?.logo) {
      changeFavicon("assets/" + credentials.organization.logo);
    }
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