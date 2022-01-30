import React, { Component } from "react";
import "./LoginPage.css";
import AuthService from "../../services/authService";

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const token = await AuthService.loginUser({
      username: this.state.username,
      password: this.state.password
    });
    this.setToken(token);
  }

  setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
  };


  render() {
    return (
    <>
      <div className="loginWrapper">
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>
              <p>Email Address</p>
              <input type="text" className="form-control" onChange={e => {
                this.setState({username: e.target.value});
                }} />
            </label>
          </div>
          <div className="form-group">
            <label>
              <p>Password</p>
              <input type="password" className="form-control" onChange={e => {
                this.setState({password: e.target.value});
                }}/>
            </label>
          </div>
          <button className="btn" type="submit">Submit</button>
        </form>
      </div>
      </>
    );
  }
}
