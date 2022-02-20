import React, { Component } from 'react';
import AuthService from '../../services/authService';
import * as logUtils from '../../components/Utils/Logger';
import UsersService from '../../services/usersService';
import { Section } from '../../components/Utils/Utils';
import './ProfilePage.css'
const log = logUtils.getLogger()

export default class ProfilePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      user: null,
      userPreferences: null
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

  handleEditButtonClick() {
    // TODO:
    console.log("coming soon...")
  }

  renderProfile() {
    const { user } = this.state;
    const firstName = user.FirstName;
    const lastName = user.LastName;
    const email = user.EmailAddress;
    const address = user.Address;
    const zipCode = user.ZipCode;
    const lastUpdated = user.LastUpdated.slice(0, 10); // only need date

    console.log(user)

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