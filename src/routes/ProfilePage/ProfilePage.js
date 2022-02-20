import React, { Component } from 'react';
import AuthService from '../../services/authService';
import * as logUtils from '../../components/Utils/Logger';
import UsersService from '../../services/usersService';
import { Section } from '../../components/Utils/Utils';
import './ProfilePage.css'
import CreateAccountForm from '../../components/CreateAccountForm/CreateAccountForm';
const log = logUtils.getLogger()

export default class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      user: null,
      userPreferences: null,
      edit: false
    }
  }

  componentDidMount() {
    log.debug('Getting user data...');
    const userID = AuthService.getUserIDFromToken();
    this.setState({ userID });
    UsersService.getUser(userID)
      .then(user => this.setState({ user: user[0] }))
      .catch(error => console.log(error));

  }

  handleEditButtonClick = async (e) => {
    e.preventDefault()
    this.state.edit
      ? this.setState({edit: false})
      : this.setState({edit: true})
  }

  renderProfile() {
    const { user } = this.state;
    const firstName = user.FirstName;
    const lastName = user.LastName;
    const email = user.EmailAddress;
    const address = user.Address;
    const zipCode = user.ZipCode;
    const password = user.Password;
    const lastUpdated = user.LastUpdated.slice(0, 10); // only need date
    let street = '';
    let city = '';
    let USState = '';

    if (address) {
      const addressArray = address.split(', ');
      street = addressArray.slice(0, -2).join(', '); // handles street addresses with commas in them
      // 2nd to last item in array is always city. Last is always state
      city = addressArray[addressArray.length - 2];
      USState = addressArray[addressArray.length - 1];
    }

    if (this.state.edit) {
      return (
        <Section>
          <CreateAccountForm
          edit={true}
          firstName={firstName}
          lastName={lastName}
          email={email}
          password={password}
          address={address}
          zipCode={zipCode}
          address={street}
          city={city}
          USState={USState}
          />
        </Section>
      )
    }

    return (
      <>
        <Section className={'profileContainer'}>
          <div className='profile'>
            <h3>{firstName} {lastName}</h3>
            <div>Email: {email}</div>
            <div>{
              address
                ? 'Address: ' + address + ' ' + zipCode
                : 'ZIP Code:' + zipCode
            }</div>
            <small className='text-muted'>Last updated: {lastUpdated}</small>
          </div>

        </Section>
      </>
    )
  }

  renderPreferences() {
    // TODO: add after userPreferences backend is complete  
    return (
      <Section>
        <>
          <h2>Saved Preferences</h2>
        </>
      </Section>

    )
  }

  render() {
    const { user, userPreferences } = this.state;
    return (
      <>
        <Section>
          <h2>
            My Profile
            <button className='btn ml-3' onClick={this.handleEditButtonClick}>Edit</button>
          </h2>
        </Section>
        
        {user && this.renderProfile()}
        {userPreferences && this.renderPreferences()}
      </>
    )

  }
}