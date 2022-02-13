import React, { Component } from 'react';
import { Section } from '../../components/Utils/Utils';
import PasswordChecklist from 'react-password-checklist'
import './LoginPage.css';
import AuthService from '../../services/authService';
import UsersService from '../../services/usersService';
import SheltersService from '../../services/sheltersService';
import AuthContext from '../../context/AuthContext';

export default class LoginPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      USState: '',
      zipCode: null,
      shelterName: '',
      phoneNumber: null,
      website: '',
      createAccount: false,
      shelter: props.shelter,
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
      this.setToken(token);
      this.context.setLoggedInState(true);
    })
      .catch(() => {
        this.setState({ errorText: 'Invalid email or password' })

      });
  };

  handleUserCreateSubmit = async (e) => {
    e.preventDefault();

    if (this.verifyPassword(this.state.password, this.state.confirmPassword)) {
      await UsersService.createUser({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        address: this.getFullAddress(),
        zipCode: this.state.zipCode,
      }).then(() => {
        this.handleUserLoginSubmit(e)
      })
        .catch(() => {
          this.setState({ errorText: 'Account creation failed' })
        });
    } else {
      this.setState({ errorText: 'Invalid password' });
    }
  };

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
        this.handleShelterLoginSubmit(e)
      })
        .catch(() => {
          this.setState({ errorText: 'Account creation failed' })
        });
    } else {
      this.setState({ errorText: 'Invalid password' });
    }
  };

  handlePageSwitch = async (e) => {
    e.preventDefault();
    this.state.createAccount
      ? this.setState({ createAccount: false })
      : this.setState({ createAccount: true });
  }

  getFullAddress() {
    // Add zip code if shelter
    if (this.state.shelter && this.state.address && this.state.city && this.state.USState && this.state.zipCode) {
      return this.state.address + ', ' + this.state.city + ', ' + this.state.USState + ' ' + this.state.zipCode;
      // Ignore zip code if user
    } else if (this.state.address && this.state.city && this.state.USState) {
      return this.state.address + ', ' + this.state.city + ', ' + this.state.USState;
    } else {
      return null;
    }
  }

  verifyPassword(password, confirmPassword) {
    if (password !== confirmPassword) return false; // passwords do not match
    if (password.length < 6) return false; // password too short
    if (password.toUpperCase() === password) return false; // no lowercase
    if (password.toLowerCase() === password) return false; // no uppercase
    if (!/\d/.test(password)) return false // no number

    return true;
  }

  handleShelterLoginSubmit = async (e) => {
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
          <div className='alert alert-danger'>{this.state.errorText}</div>
        </>
      )
    }
  }

  renderUSStates() {
    return (
      <>
        <option></option><option>AL</option><option>AK</option><option>AZ</option><option>AK</option><option>CA</option><option>CO</option><option>CT</option><option>DC</option>
        <option>DE</option><option>FL</option><option>GA</option><option>HI</option><option>ID</option><option>IL</option><option>IN</option><option>IA</option><option>KS</option>
        <option>KY</option><option>LA</option><option>ME</option><option>MD</option><option>MA</option><option>MI</option><option>MN</option><option>MS</option><option>MO</option>
        <option>MT</option><option>NE</option><option>NV</option><option>NH</option><option>NJ</option><option>NM</option><option>NY</option><option>NC</option><option>ND</option>
        <option>OH</option><option>OK</option><option>OR</option><option>PA</option><option>PR</option><option>RI</option><option>SC</option><option>SD</option><option>TN</option>
        <option>TX</option><option>UT</option><option>VT</option><option>VA</option><option>WA</option><option>WV</option><option>WI</option><option>WY</option>
      </>
    )
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

  renderLogin() {
    return (
      <>
        <Section className='container'>
          <div className='loginWrapper'>
            {this.renderPageTitle()}
            {this.renderErrorMessage()}
            <form onSubmit={this.state.shelter ? this.handleShelterLoginSubmit : this.handleUserLoginSubmit}>
              <div className='form-group'>
                <label>
                  <p>Email Address</p>
                  <input type='email' className='form-control' value={this.state.email} onChange={e => {
                    this.setState({ email: e.target.value });
                  }} />
                </label>
              </div>
              <div className='form-group'>
                <label>
                  <p>Password</p>
                  <input type='password' className='form-control' required value={this.state.password} onChange={e => {
                    this.setState({ password: e.target.value });
                  }} />
                </label>
              </div>
              <button className='btn' type='submit'>Submit</button>
            </form>
            <button className='btn btn-link' onClick={this.handlePageSwitch}>Don't have an account? Create one!</button>
          </div>
        </Section>

      </>
    );
  }

  renderCreateUserAccountForm() {
    return (
      <>
        <form onSubmit={this.handleUserCreateSubmit}>
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
              <p>Address <small className='text-muted'>(Optional)</small></p>
              <input type='text' className='form-control' value={this.state.address} onChange={e => {
                this.setState({ address: e.target.value });
              }} />
            </label>
            <label className='mr-1'>
              <p>City <small className='text-muted'>(Optional)</small></p>
              <input type='text' className='form-control' value={this.state.city} onChange={e => {
                this.setState({ city: e.target.value });
              }} />
            </label>
            <label>
              <p>State <small className='text-muted'>(Optional)</small></p>
              <select className='form-control' value={this.state.USState} onChange={e => {
                this.setState({ USState: e.target.value });
              }}>
                {this.renderUSStates()}
              </select>
            </label>
            <small className='form-text text-muted'>All three of the above inputs inputs must be entered to save full address</small>
          </div>
          <div className='form-group'>
            <label>
              <p>Zip Code</p>
              <input type='number' min='0' max='99999' className='form-control' required onChange={e => {
                this.setState({ zipCode: e.target.value });
              }} />
            </label>
          </div>
          <button className='btn' type='submit'>Submit</button>
          <button className='btn btn-link' onClick={this.handlePageSwitch}>Already have an account? Log in here!</button>
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
          <button className='btn btn-link' onClick={this.handlePageSwitch}>Already have an account? Log in here!</button>
        </form>
      </>
    )
  }

  renderAccountCreation() {
    return (
      <>
        <Section className='container'>
          <div className='row justify-content-md-center'>
            <div className='col-md-auto'>
              <h2>Create {this.state.shelter ? 'Shelter ' : ''}Account</h2>
              {this.renderErrorMessage()}
              {this.state.shelter
                ? this.renderCreateShelterAccountForm()
                : this.renderCreateUserAccountForm()}
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
