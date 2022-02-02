import React, { Component } from "react";
import "./LoginPage.css";
import AuthService from "../../services/authService";
import AuthContext from "../../context/AuthContext";

export default class LoginPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }

  handleSubmit = async (e) => {
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

  }

  setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
  };

  renderErrorMessage() {
    if (this.state.errorText && this.state.errorText !== '') {
      return (
        <>
          <div class="alert alert-danger">{this.state.errorText}</div>
        </>
      )
    }
  }

  render() {
    return (
      <>
        <div className="loginWrapper">
          <h2>Login</h2>
          {this.renderErrorMessage()}
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>
                <p>Email Address</p>
                <input type="email" className="form-control" onChange={e => {
                  this.setState({ email: e.target.value });
                }} />
              </label>
            </div>
            <div className="form-group">
              <label>
                <p>Password</p>
                <input type="password" className="form-control" required onChange={e => {
                  this.setState({ password: e.target.value });
                }} />
              </label>
            </div>
            <button className="btn" type="submit">Submit</button>
          </form>
        </div>
      </>
    );
  }
}
