import React, { Component } from 'react';
import AuthService from '../../services/authService';
import * as logUtils from '../../components/Utils/Logger';
import UsersService from '../../services/usersService';
import { Section } from '../../components/Utils/Utils';
import './ProfilePage.css'
import CreateAccountForm from '../../components/CreateAccountForm/CreateAccountForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      .catch(error => log.debug(error));
    UsersService.getSavedPreferences(userID)
      .then(prefs => this.setState({ userPreferences: prefs[0] }))
      .catch(error => log.debug(error));
  }

  handleEditButtonClick = async () => {
    this.setState({ edit: !this.state.edit })
  }

  onUpdate = async (e) => {
    e.preventDefault();
    window.location.reload()
  }

  deleteAllPreferences = async () => {
    if (window.confirm('Are you sure you want to delete all preferences?')) {
      UsersService.deleteAllUserPreferences(this.state.userID)
        .then(() => { this.setState({ userPreferences: null }) })
        .catch(error => log.debug(error));
    }
  }

  renderProfile() {
    const { user } = this.state;
    const firstName = user.FirstName;
    const lastName = user.LastName;
    const email = user.EmailAddress;
    const address = user.Address;
    const zipCode = user.ZipCode;
    const lastUpdated = new Date(user.LastUpdated).toLocaleDateString();
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
            address={address}
            zipCode={zipCode}
            address={street}
            city={city}
            USState={USState}
            onUpdate={this.onUpdate}
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
    const prefs = this.state.userPreferences;
    let animalTypes = prefs.TypeOfAnimal ? JSON.parse(prefs.TypeOfAnimal) : null;
    let breeds = prefs.Breed ? JSON.parse(prefs.Breed) : null;
    let more = prefs.More ? JSON.parse(prefs.More) : null;

    // Format age range
    let ageRange;
    if (prefs.MinAge && prefs.MaxAge) {
      ageRange = prefs.MinAge + '-' + prefs.MaxAge;
    } else if (prefs.MinAge) {
      ageRange = prefs.MinAge + '+';
    } else if (prefs.MaxAge) {
      ageRange = '< ' + prefs.MaxAge;
    }

    // Format objects
    if (animalTypes) {
      animalTypes = animalTypes.map((elem) => {
        return elem.value;
      }).join(', ');
    };
    if (breeds) {
      breeds = breeds.map((elem) => {
        return elem.value;
      }).join(', ');
    };
    if (more) {
      more = more.map((elem) => {
        // This will add a space before any capital letter, and then lowercase
        // Simply for formatting purposes
        return elem.value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      }).join(', ');
    };

    return (
      <Section className={'mt-5'}>
        <h2>My Pet Preferences <span className='btn p-2 text-primary' onClick={this.deleteAllPreferences}><FontAwesomeIcon icon='trash-alt' /></span></h2>
        <table className='table'>
          <tbody>
            {animalTypes ? <tr><th>Types of Animals</th><td>{animalTypes}</td></tr> : null}
            {breeds ? <tr><th>Breeds</th><td>{breeds}</td></tr> : null}
            {prefs.Sex ? <tr><th>Sex</th><td>{prefs.Sex}</td></tr> : null}
            {ageRange ? <tr><th>Age Range</th><td>{ageRange}</td></tr> : null}
            {more ? <tr><th>Other</th><td>{more}</td></tr> : null}
          </tbody>
        </table>
      </Section>
    )
  }

  render() {
    const { user, userPreferences } = this.state;
    return (
      <>
        <Section>
          <h2>
            {this.state.edit ? 'Edit Profile' : 'My Profile'}
            <button className='btn ml-3' onClick={this.handleEditButtonClick}>{this.state.edit ? 'Cancel' : 'Edit'}</button>
          </h2>
        </Section>
        {user && this.renderProfile()}
        {userPreferences && this.renderPreferences()}
      </>
    )
  }
}
