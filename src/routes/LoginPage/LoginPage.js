import React, { Component } from 'react';
import './LoginPage.css';
import AuthService from '../../services/authService';
import AuthContext from '../../context/AuthContext';

export default class LoginPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      shelter: props.shelter
    }
  }

  handleUserSubmit = async (e) => {
    e.preventDefault();
    await AuthService.loginUser({
      email: this.state.email,
      password: this.state.password
    }).then((token) => {
      this.setToken(token);
      this.context.setLoggedInState(true);
    })
      .catch(() => {
        this.setState({ errorText: 'Invalid email or password' })

      });
  };

  handleShelterSubmit = async (e) => {
    e.preventDefault();
    await AuthService.loginShelter({
      email: this.state.email,
      password: this.state.password
    }).then((token) => {
      this.setToken(token);
      this.context.setLoggedInState(true);
      this.context.setShelterAdminState(true);
    })
      .catch(() => {
        this.setState({ errorText: 'Invalid email or password' })

      });
  };

  setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
  };

  renderErrorMessage() {
    if (this.state.errorText && this.state.errorText !== '') {
      return (
        <>
          <div class='alert alert-danger'>{this.state.errorText}</div>
        </>
      )
    }
  }

  renderPageTitle() {
    if (this.state.shelter) {
      return (
        <h2>Shelter Login</h2>
      )
    } else {
      return (
        <h2>Login</h2>
      )
    }
  }

  render() {
    return (
      <>
        <div className='loginWrapper'>
          {this.renderPageTitle()}
          {this.renderErrorMessage()}
          <form onSubmit={this.state.shelter ? this.handleShelterSubmit : this.handleUserSubmit}>
            <div className='form-group'>
              <label>
                <p>Email Address</p>
                <input type='email' className='form-control' onChange={e => {
                  this.setState({ email: e.target.value });
                }} />
              </label>
            </div>
            <div className='form-group'>
              <label>
                <p>Password</p>
                <input type='password' className='form-control' required onChange={e => {
                  this.setState({ password: e.target.value });
                }} />
              </label>
            </div>
            <button className='btn' type='submit'>Submit</button>
          </form>
        </div>
      </>
    );
  }
}
