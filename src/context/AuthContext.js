import React, { Component } from 'react';

const AuthContext = React.createContext({
  hasAuthToken: false,
  isShelterAdmin: false,
  count: 1,
  setAuthState: () => {},
  setShelterAdminState: () => {},
  setCount: () => {}
})

export default AuthContext;

export class AuthProvider extends Component {
  state = { count: 1 }

  setAuthState = hasAuthToken => {
    this.setState({ hasAuthToken });
  }

  setShelterAdminState = isShelterAdmin => {
    this.setState({ isShelterAdmin });
  }

  setCount = count => {
    this.setState({ count });
  }

  render() {
    const contextValue = {
      hasAuthToken: this.state.hasAuthToken,
      isShelterAdmin: this.state.isShelterAdmin,
      count: this.state.count,
      setAuthState: this.setAuthState,
      setShelterAdminState: this.setShelterAdminState,
      setCount: this.setCount
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}