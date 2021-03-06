import React, { Component } from 'react';
import { isShelterAdmin, Section, Input } from '../../components/Utils/Utils';
import './SheltersPage.css';
import SheltersService from '../../services/sheltersService';
import * as logUtils from '../../components/Utils/Logger';
import PetList from '../../components/PetList';
import PetsService from '../../services/petsService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import USStates from '../../components/Utils/USStates.json'
var log = logUtils.getLogger()

export default class SheltersPage extends Component {

  static defaultProps = {
    onSubmitSuccess: () => { }
  };

  constructor(props) {
    super(props);
    this.state = {
      shelterID: null,
      shelter: null,
      pets: null,
      typeOfAnimal: [],
      breed: [],
      sex: '',
      minAge: '',
      maxAge: '',
      more: [],
      distance: { label: 'Anywhere', value: '' },
      zipCode: '',
      mode: "view",
      shelterName: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      email: null,
      phoneNumber: null,
      website: null,
      error: null
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.changeSavedPreferences = this.changeSavedPreferences.bind(this);
    this.inputEdited = this.inputEdited.bind(this); //This actually update the database
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this); //This switches the "view" mode and "edit" mode
    this.onClickUpdate = this.onClickUpdate.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const path = window.location.pathname;
    const shelterID = path.substring(path.lastIndexOf('/') + 1)
    this.setState({ shelterID });

    SheltersService.getShelter(shelterID)
      .then(shelter => {
        this.setState({ shelter: shelter })
        this.updateState(shelter)
      })
      .catch(error => {
        log.error(error)
        this.setState({ error: "No shelter data available" });
      });

    PetsService.getPets({ shelterID })
      .then(pets => this.setState({ pets: pets }))
      .catch(error => log.error(error));
  }

  inputChanged(field, content) {
    this.setState({ [field]: content }, () => this.handleSubmit());
  }

  inputEdited(field, content) {
    this.setState({ [field]: content });
  }

  handleSubmit = () => {
    PetsService.getPets(this.getFilters())
      .then(pets => this.setState({ pets: pets }))
      .catch(error => log.error(error));
  }

  changeSavedPreferences(changedPrefs) {
    this.setState(changedPrefs, () => this.handleSubmit());
  }

  getFilters() {
    const {
      shelterID,
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more
    } = this.state;
    const filters = { shelterID, availability: 'Available' };
    if (typeOfAnimal.length > 0)
      filters.typeOfAnimal = Array.from(typeOfAnimal, option => option.value);
    if (breed.length > 0)
      filters.breed = Array.from(breed, option => option.value);
    if (sex)
      filters.sex = sex.value;
    if (minAge > 0)
      filters.minAge = minAge;
    if (maxAge > 0)
      filters.maxAge = maxAge;
    more.forEach(option => filters[option.value] = true);
    return filters;
  }

  updateState(shelter) {
    this.setState({
      shelterName: shelter[0].ShelterName,
      address: shelter[0].Address.substring(0, shelter[0].Address.indexOf(',')),
      city: shelter[0].Address.substring(shelter[0].Address.indexOf(',') + 2, shelter[0].Address.lastIndexOf(',')),
      state: shelter[0].Address.substring(shelter[0].Address.lastIndexOf(',') + 2, shelter[0].Address.lastIndexOf(',') + 4),
      zip: parseInt(shelter[0].Address.substring(shelter[0].Address.length - 5)),
      email: shelter[0].EmailAddress,
      phoneNumber: shelter[0].PhoneNumber,
      website: shelter[0].Website
    });
  }

  handleEditButtonClick() {
    const { shelter } = this.state;
    if (this.state.mode === "view") {
      this.updateState(shelter)
      this.setState({ mode: "edit" })
    } else {
      this.setState({ mode: "view" })
    }
  }

  onClickDelete() {
    if (window.confirm('Are you sure you want to delete this shelter?')) {
      const { shelterID } = this.state;
      SheltersService.deleteShelter(shelterID)
        .then(() => {
          localStorage.removeItem('token')
          window.open("/");
        })
        .catch(res => {
          window.alert(res.error);
        });
    }
  };

  onClickUpdate(e) {
    e.preventDefault();
    const {
      shelterID,
      shelterName,
      address,
      city,
      state,
      zip,
      email,
      phoneNumber,
      website
    } = this.state;

    let data = {
      "shelterID": parseInt(shelterID),
      "shelterName": shelterName,
      "address": address + ", " + city + ", " + state + " " + zip,
      "emailAddress": email,
      "phoneNumber": phoneNumber,
      "website": website ? website : null,
    }

    SheltersService.updateShelter(data)
      .then(res => {
        window.location.reload(false)
        this.props.onSubmitSuccess();
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  renderShelterName(shelter) {
    return (
      <div className='col-md m-1'>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          <h2>{shelter[0].ShelterName}</h2>
          {isShelterAdmin(shelter[0].ShelterID) &&
            <div>
              <span role='button' className='btn p-2 text-info' onClick={this.handleEditButtonClick}>
                <FontAwesomeIcon icon='edit' />
              </span>
              <span role='button' className='btn p-2 text-info' onClick={this.onClickDelete} >
                <FontAwesomeIcon icon='trash-alt' />
              </span>
            </div>
          }
        </div>
      </div>
    )
  }

  renderShelter(shelter) {
    log.debug("Calling renderShelter...")

    // Add protocol to website link if none exists
    let websiteLink = shelter[0].Website;
    if (websiteLink.substring(0, 4) !== 'http') {
      websiteLink = 'http://' + websiteLink;
    }

    return (
      <div>
        <table className='table'>
          <tbody>
            <tr>
              <th>Address</th>
              <td>{shelter[0].Address}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td><a className='baseFont' href={"mailto:" + shelter[0].EmailAddress}>{shelter[0].EmailAddress}</a></td>
            </tr>
            <tr>
              <th>Phone number</th>
              <td><a className='baseFont' href={"tel:" + shelter[0].PhoneNumber}>{shelter[0].PhoneNumber}</a></td>
            </tr>
            <tr>
              <th>Website</th>
              <td><a className='baseFont' href={websiteLink}>{shelter[0].Website}</a></td>
            </tr>
          </tbody>
        </table>
        <hr />
      </div>
    );
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

  renderEditShelter() {
    const {
      shelterName,
      address,
      city,
      state,
      zip,
      email,
      phoneNumber,
      website
    } = this.state;

    return (
      <div>
        <form onSubmit={this.onClickUpdate}>
          <div>
            <table className='shelterTable'>
              <tbody>
                <tr>
                  <th>Shelter Name</th>
                  <td><Input type='text' className='form-control' value={shelterName}
                    onChange={e => this.inputEdited('shelterName', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td><Input type='text' className='form-control' value={address}
                    onChange={e => this.inputEdited('address', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>City</th>
                  <td><Input type='text' className='form-control' value={city}
                    onChange={e => this.inputEdited('city', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>State</th>
                  <td>
                    <select className='form-control' value={state} onChange={e => {
                      this.setState({ 'state': e.target.value });
                    }} required>
                      {this.renderUSStates()}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>Zip Code</th>
                  <td><Input type='number' min='0' max='99999' className='form-control' value={zip}
                    onChange={e => this.inputEdited('zip', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td><Input type='email' className='form-control' value={email}
                    onChange={e => this.inputEdited('email', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>Phone number</th>
                  <td><Input type='number' max='9999999999' className='form-control' value={phoneNumber}
                    onChange={e => this.inputEdited('phoneNumber', e.target.value)} required /></td>
                </tr>
                <tr>
                  <th>Website</th>
                  <td><Input type='text' className='form-control' value={website}
                    onChange={e => this.inputEdited('website', e.target.value)} /></td>
                </tr>
              </tbody>
            </table>
            <hr />
          </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              <button className="btn btn-info btn-md m-2" type="submit" >Update</button>
              <button className="btn btn-outline-info  btn-md m-2" onClick={this.handleEditButtonClick}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  renderPetList() {
    log.debug("Calling renderPetList")
    const {
      shelterID,
      shelter,
      pets,
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more,
      distance,
      zipCode
    } = this.state;
    return (
      <>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          <h2>Pets at {shelter[0].ShelterName}</h2>
          {isShelterAdmin(shelterID) &&
            <Link to={`/pets/create`} className='btn btn-info m-1'>
              Add A Pet
            </Link>
          }
        </div>
        {<PetList
          pets={pets}
          page='shelter'
          typeOfAnimal={typeOfAnimal}
          breed={breed}
          sex={sex}
          minAge={minAge}
          maxAge={maxAge}
          more={more}
          distance={distance}
          zipCode={zipCode}
          inputChangeHandler={this.inputChanged}
          savedPreferencesHandler={this.changeSavedPreferences}
        />}
      </>
    );
  }



  render() {
    log.debug("Calling render...")
    const { shelter, mode, error } = this.state;
    return (
      <div>
        {error && <div className='alert alert-danger' role='alert'>{error}</div>}
        <Section>
          {shelter && this.renderShelterName(shelter)}
        </Section>
        <Section>
          {mode === "view"
            ? shelter && this.renderShelter(shelter)
            : shelter && this.renderEditShelter(shelter)
          }
        </Section>
        <Section>
          {shelter && this.renderPetList()}
        </Section>
      </div>
    );
  }
}
