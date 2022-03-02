import React, { Component } from 'react';
import { Section } from '../../components/Utils/Utils';
import './LoginPage.css';
import AuthContext from '../../context/AuthContext';
import LoginForm from '../../components/LoginForm/LoginForm';
import CreateAccountForm from '../../components/CreateAccountForm/CreateAccountForm';

export default class LoginPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      createAccount: false,
      shelter: props.shelter,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.shelter !== prevProps.shelter) {
      this.setState({ shelter: this.props.shelter })
    }
  }

  handlePageSwitch = async (e) => {
    e.preventDefault();
    this.state.createAccount
      ? this.setState({ createAccount: false })
      : this.setState({ createAccount: true });
  }

  renderLogin() {
    return (
      <>
        <Section className='container'>
          <div className='loginWrapper'>
            <LoginForm shelter={this.state.shelter} />
            <button className='btn btn-link text-info' onClick={this.handlePageSwitch}>Don't have an account? Create one!</button>
          </div>
        </Section>
      </>
    );
  }

  renderAccountCreation() {
    return (
      <>
        <Section className='container'>
          <div className='row justify-content-md-center'>
            <div className='col-md-auto'>
              <CreateAccountForm shelter={this.state.shelter} />
              <button className='btn btn-link text-info' onClick={this.handlePageSwitch}>Already have an account? Log in here!</button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  render() {
    return (
      this.state.createAccount
        ? this.renderAccountCreation()
        : this.renderLogin()
    )
  }
}
