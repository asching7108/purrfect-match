import React, { Component } from 'react';

const AuthContext = React.createContext({
  isLoggedIn: false,
  isShelterAdmin: false,
  setLoggedInState: () => {},
  setShelterAdminState: () => {}
})

export default AuthContext;

export class AuthProvider extends Component {
  state = { count: 1 }

  setLoggedInState = isLoggedIn => {
    this.setState({ isLoggedIn });
  }

  setShelterAdminState = isShelterAdmin => {
    this.setState({ isShelterAdmin });
  }

  render() {
    const contextValue = {
      isLoggedIn: this.state.isLoggedIn,
      isShelterAdmin: this.state.isShelterAdmin,
      setLoggedInState: this.setLoggedInState,
      setShelterAdminState: this.setShelterAdminState
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
