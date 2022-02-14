import React, { Component } from 'react';
import { FormGroup } from '../Utils/Utils';
import AuthService from '../../services/authService';
import AuthContext from '../../context/AuthContext';

export default class LoginForm extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      shelter: props.shelter
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.shelter !== prevProps.shelter) {
      this.setState({ shelter: this.props.shelter })
    }
  }

  handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    await AuthService.loginUser({
      email: this.state.email,
      password: this.state.password
    }).then((token) => {
      AuthService.setToken(token);
      this.context.setLoggedInState(true);
    })
      .catch((e) => {
        console.log(e)
        this.setState({ errorText: 'Invalid email or password' })

      });
  };

  handleShelterLoginSubmit = async (e) => {
    e.preventDefault();
    await AuthService.loginShelter({
      email: this.state.email,
      password: this.state.password
    }).then((token) => {
      AuthService.setToken(token);
      this.context.setLoggedInState(true);
      this.context.setShelterAdminState(true);
    })
      .catch(() => {
        this.setState({ errorText: 'Invalid email or password' })

      });
  };

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

  renderErrorMessage() {
    if (this.state.errorText && this.state.errorText !== '') {
      return (
        <>
          <div className='alert alert-danger'>{this.state.errorText}</div>
        </>
      )
    }
  }

  render() {
    return (
      <>
        {this.renderPageTitle()}
        {this.renderErrorMessage()}
        <form onSubmit={this.state.shelter ? this.handleShelterLoginSubmit : this.handleUserLoginSubmit}>
          <FormGroup>
            <label>
              <p>Email Address</p>
              <input type='email' className='form-control' value={this.state.email} onChange={e => {
                this.setState({ email: e.target.value });
              }} />
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <p>Password</p>
              <input type='password' className='form-control' required value={this.state.password} onChange={e => {
                this.setState({ password: e.target.value });
              }} />
            </label>
          </FormGroup>
          <button className='btn' type='submit'>Submit</button>
        </form>
      </>
    );
  }
}
