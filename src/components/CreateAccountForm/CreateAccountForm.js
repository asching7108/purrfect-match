import React, { Component } from 'react';
import AuthService from '../../services/authService';
import AuthContext from '../../context/AuthContext';
import UsersService from '../../services/usersService';
import SheltersService from '../../services/sheltersService';
import PasswordChecklist from 'react-password-checklist'
import USStates from '../Utils/USStates.json'

export default class CreateAccountForm extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      firstName: props.firstName ? props.firstName : '',
      lastName: props.lastName ? props.lastName : '',
      email: props.email ? props.email : '',
      password: '',
      confirmPassword: '',
      address: props.address ? props.address : '',
      city: props.city ? props.city : '',
      USState: props.USState ? props.USState : '',
      zipCode: props.zipCode ? props.zipCode : null,
      shelterName: '',
      phoneNumber: null,
      website: '',
      shelter: props.shelter,
      edit: props.edit
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.shelter !== prevProps.shelter) {
      this.setState({ shelter: this.props.shelter })
    }
  }

  getFullAddress() {
    // Add zip code if shelter
    if (this.state.shelter && this.state.address && this.state.city && this.state.USState && this.state.zipCode) {
      return this.state.address + ', ' + this.state.city + ', ' + this.state.USState + ' ' + this.state.zipCode;
    }
    return null;
  }

  verifyPassword(password, confirmPassword) {
    if (password !== confirmPassword) return false; // passwords do not match
    if (password.length < 6) return false; // password too short
    if (password.toUpperCase() === password) return false; // no lowercase
    if (password.toLowerCase() === password) return false; // no uppercase
    if (!/\d/.test(password)) return false // no number

    return true;
  }

  getUserUpdateObject() {
    let userUpdates = {}
    const updateKeys = [
      'firstName',
      'lastName',
      'email',
      'password',
      'zipCode'
    ]
    for (const key of updateKeys) {
      if (this.state[key]) userUpdates[key] = this.state[key];
    }
    return userUpdates;
  }

  handleUserCreateSubmit = async (e) => {
    e.preventDefault();

    if (this.verifyPassword(this.state.password, this.state.confirmPassword)) {
      await UsersService.createUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        zipCode: this.state.zipCode,
      }).then(() => {
        AuthService.loginUser({
          email: this.state.email,
          password: this.state.password
        }).then((token) => {
          AuthService.setToken(token);
          this.context.setLoggedInState(true);
        })
      })
        .catch(() => {
          this.setState({ errorText: 'Account creation failed' })
        });
    } else {
      this.setState({ errorText: 'Invalid password' });
    }
  };

  handleUserUpdateSubmit = async (e) => {
    e.preventDefault();

    // only verify password if one is submitted
    if (!this.state.password || this.verifyPassword(this.state.password, this.state.confirmPassword)) {
      const userID = AuthService.getUserIDFromToken();
      const userUpdates = this.getUserUpdateObject();

      await UsersService.updateUser(userID, userUpdates)
        .then(() => {
          this.props.onUpdate(e)
        })
        .catch(() => {
          this.setState({ errorText: 'Account update failed' })
        })
    } else if (this.state.password) {
      this.setState({ errorText: 'Invalid password' });
    }
  }

  handleShelterCreateSubmit = async (e) => {
    e.preventDefault();

    if (this.verifyPassword(this.state.password, this.state.confirmPassword)) {
      await SheltersService.createShelter({
        shelterName: this.state.shelterName,
        emailAddress: this.state.email,
        phoneNumber: this.state.phoneNumber,
        password: this.state.password,
        address: this.getFullAddress(),
        website: this.state.website,
      }).then(() => {
        AuthService.loginShelter({
          email: this.state.email,
          password: this.state.password
        }).then((token) => {
          AuthService.setToken(token);
          this.context.setLoggedInState(true);
          this.context.setShelterAdminState(true);
        })
      })
        .catch(() => {
          this.setState({ errorText: 'Account creation failed' })
        });
    } else {
      this.setState({ errorText: 'Invalid password' });
    }
  };

  renderErrorMessage() {
    if (this.state.errorText && this.state.errorText !== '') {
      return (
        <>
          <div className='alert alert-danger'>{this.state.errorText}</div>
        </>
      )
    }
  }

  renderUSStates() {
    let stateOptions = [];
    const states = USStates.states;
    for (let i = 0; i < states.length; i++) {
      stateOptions.push(<option key={states[i]}>{states[i]}</option>);
    }
    return (
      <>
        {stateOptions}
      </>
    )
  }

  renderHeader() {
    if (this.state.edit) return null;
    return (
      <h2>Create {this.state.shelter ? 'Shelter ' : ''}Account</h2>
    )
  }

  renderCreateUserAccountForm() {
    return (
      <>
        <form onSubmit={this.state.edit ? this.handleUserUpdateSubmit : this.handleUserCreateSubmit}>
          <div className='form-group'>
            <label className='mr-1'>
              <p>First Name</p>
              <input type='text' className='form-control' required value={this.state.firstName} onChange={e => {
                this.setState({ firstName: e.target.value });
              }} />
            </label>
            <label>
              <p>Last Name</p>
              <input type='text' className='form-control' required value={this.state.lastName} onChange={e => {
                this.setState({ lastName: e.target.value });
              }} />
            </label>
          </div>
          <div className='form-group'>
            <label>
              <p>Email Address</p>
              <input type='email' className='form-control' value={this.state.email} onChange={e => {
                this.setState({ email: e.target.value });
              }} />
            </label>
          </div>
          <div className='form-group'>
            <label className='mr-1'>
              <p>Password</p>
              <input type='password' className='form-control' required={!this.state.edit} value={this.state.password} onChange={e => {
                this.setState({ password: e.target.value });
              }} />
            </label>
            <label>
              <p>Confirm Password</p>
              <input type='password' className='form-control' value={this.state.confirmPassword} onChange={e => {
                this.setState({ confirmPassword: e.target.value });
              }} />
            </label>
            <PasswordChecklist
              rules={["minLength", "capital", "lowercase", "number", "match"]}
              minLength={6}
              value={this.state.password}
              valueAgain={this.state.confirmPassword}
              onChange={(isValid) => { }}
            />
          </div>
          <div className='form-group'>
            <label>
              <p>Zip Code</p>
              <input type='number' min='0' max='99999' className='form-control' value={this.state.zipCode} required onChange={e => {
                this.setState({ zipCode: e.target.value });
              }} />
            </label>
          </div>
          <button className='btn' type='submit'>Submit</button>
        </form>
      </>
    )
  }

  renderCreateShelterAccountForm() {
    return (
      <>
        <form onSubmit={this.handleShelterCreateSubmit}>
          <div className='form-group'>
            <label className='mr-1 input-full'>
              <p>Shelter Name</p>
              <input type='text' className='form-control input-full' required value={this.state.shelterName} onChange={e => {
                this.setState({ shelterName: e.target.value });
              }} />
            </label>
          </div>
          <div className='form-group'>
            <label className='mr-1'>
              <p>Email Address</p>
              <input type='email' className='form-control' required value={this.state.email} onChange={e => {
                this.setState({ email: e.target.value });
              }} />
            </label>
            <label>
              <p>Phone Number</p>
              <input type='number' className='form-control' max='999999999999' required value={this.state.phoneNumber} onChange={e => {
                this.setState({ phoneNumber: e.target.value });
              }} />
            </label>
          </div>
          <div className='form-group'>
            <label className='mr-1'>
              <p>Password</p>
              <input type='password' className='form-control' required value={this.state.password} onChange={e => {
                this.setState({ password: e.target.value });
              }} />
            </label>
            <label>
              <p>Confirm Password</p>
              <input type='password' className='form-control' required value={this.state.confirmPassword} onChange={e => {
                this.setState({ confirmPassword: e.target.value });
              }} />
            </label>
            <PasswordChecklist
              rules={["minLength", "capital", "lowercase", "number", "match"]}
              minLength={6}
              value={this.state.password}
              valueAgain={this.state.confirmPassword}
              onChange={(isValid) => { }}
            />
          </div>
          <div className='form-group'>
            <label className='mr-1'>
              <p>Address</p>
              <input type='text' className='form-control' required value={this.state.address} onChange={e => {
                this.setState({ address: e.target.value });
              }} />
            </label>
            <label className='mr-1'>
              <p>City</p>
              <input type='text' className='form-control' required value={this.state.city} onChange={e => {
                this.setState({ city: e.target.value });
              }} />
            </label>
            <label>
              <p>State</p>
              <select className='form-control' required value={this.state.USState} onChange={e => {
                this.setState({ USState: e.target.value });
              }}>
                {this.renderUSStates()}
              </select>
            </label>
          </div>
          <div className='form-group'>
            <label className='mr-1'>
              <p>Zip Code</p>
              <input type='number' min='0' max='99999' className='form-control' required onChange={e => {
                this.setState({ zipCode: e.target.value });
              }} />
            </label>
            <label>
              <p>Website <small className='text-muted'>(Optional)</small></p>
              <input type='text' className='form-control' onChange={e => {
                this.setState({ website: e.target.value });
              }} />
            </label>
          </div>
          <button className='btn' type='submit'>Submit</button>
        </form>
      </>
    )
  }

  render() {
    return (
      <>
        {this.renderHeader()}
        {this.renderErrorMessage()}
        {this.state.shelter
          ? this.renderCreateShelterAccountForm()
          : this.renderCreateUserAccountForm()}
      </>
    );
  }
}
