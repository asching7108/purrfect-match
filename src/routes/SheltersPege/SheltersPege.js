import React, { Component } from 'react';
import { isShelterAdmin, Section, Input } from '../../components/Utils/Utils';
import './SheltersPege.css';
import SheltersService from '../../services/sheltersService';
import * as logUtils from '../../components/Utils/Logger';
import PetList from '../../components/PetList';
import PetsService from '../../services/petsService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
var log = logUtils.getLogger()

export default class SheltersPege extends Component {

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
      mode: "view",
      shelterName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      phoneNumber: '',
      website: '',
      updated: ""
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickUpdate = this.onClickUpdate.bind(this);
  }

  componentDidMount() {
    log.debug("Getting shelter data...")
    const path = window.location.pathname;
    const shelterID = path.substring(path.lastIndexOf('/') + 1)
    this.setState({ shelterID });

    SheltersService.getShelter(shelterID)
      .then(shelter => {
        this.setState({ shelter: shelter })
        this.updateState(shelter)
      })
      .catch(error => console.log(error));

    log.debug("Getting pets data...")
    PetsService.getPets({ shelterID })
      .then(pets => this.setState({ pets: pets }))
      .catch(error => console.log(error));
  }

  inputChanged(field, content) {
    log.debug("Calling inputChanged")
    this.setState({ [field]: content }, () => this.handleSubmit());
  }

  handleSubmit = () => {
    PetsService.getPets(this.getFilters())
      .then(pets => this.setState({ pets: pets }))
      .catch(error => console.log(error));
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
    this.setState({ shelterName: shelter[0].ShelterName })
    this.setState({ address: shelter[0].Address.substring(0, shelter[0].Address.indexOf(',')) })
    this.setState({ city: shelter[0].Address.substring(shelter[0].Address.indexOf(',') + 2, shelter[0].Address.lastIndexOf(',')) })
    this.setState({ state: shelter[0].Address.substring(shelter[0].Address.lastIndexOf(',') + 2, shelter[0].Address.lastIndexOf(',') + 4) })
    this.setState({ zip: parseInt(shelter[0].Address.substring(shelter[0].Address.length - 5)) })
    this.setState({ email: shelter[0].EmailAddress })
    this.setState({ phoneNumber: shelter[0].PhoneNumber })
    this.setState({ website: shelter[0].Website })
  }

  onClickEdit() {
    log.debug("Calling onClickEdit")
    const { shelter } = this.state;
    if (this.state.mode === "view") {
      this.updateState(shelter)
      this.setState({ mode: "edit" })
    } else {
      this.setState({ mode: "view" })
    }
  }

  onClickUpdate(e) {
    const {
      shelterID,
      shelterName,
      address,
      city,
      state,
      zip,
      email,
      phoneNumber,
      website,
      updated
    } = this.state;

    let data = {
      "shelterID": shelterID,
      "shelterName": shelterName,
      "address": address + ", " + city + ", " + state + " " + zip,
      "emailAddress": email,
      "phoneNumber": phoneNumber,
      "website": website ? website : null,
    }

    SheltersService.updateShelter(data)
      .then(res => {
        
        this.props.onSubmitSuccess();
      })
      .catch(res => {
        this.setState({ error: res.error });
      });

      this.setState({ updated: "Updated" })
  }


  renderShelterName(shelter) {
    const { updated } = this.state;
    return (
      <div className='col-md m-1'>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          {updated && <div className='alert alert-danger' role='info'>{updated}</div>}
          <h2>{shelter[0].ShelterName}</h2>
          {isShelterAdmin(shelter[0].ShelterID) &&
            <div>
              <span role='button' className='btn p-2 text-primary' onClick={this.onClickEdit}>
                <FontAwesomeIcon icon='edit' />
              </span>
              <span role='button' className='btn p-2 text-primary' >
                <FontAwesomeIcon icon='trash-alt' />
              </span>
            </div>
          }
        </div>
        <hr />
      </div>
    )
  }

  renderShelter(shelter) {
    log.debug("Calling renderShelter...")
    return (
      <div>
        <table className='shelterTable'>
          <tbody>
            <tr>
              <th>Address</th>
              <td>{shelter[0].Address}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td><a href={"mailto:" + shelter[0].EmailAddress}>{shelter[0].EmailAddress}</a></td>
            </tr>
            <tr>
              <th>Phone number</th>
              <td><a href={"tel:" + shelter[0].PhoneNumber}>{shelter[0].PhoneNumber}</a></td>
            </tr>
            <tr>
              <th>Website</th>
              <td><a href={shelter[0].Website}>{shelter[0].Website}</a></td>
            </tr>
          </tbody>
        </table>
        <hr />
      </div>
    );
  }

  renderEditShelter(shelter) {
    log.debug("Calling renderEditShelter...")

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
        <form>
          <div>

            <table className='shelterTable'>
              <tbody>
                <tr>
                  <th>Shelter Name</th>
                  <td><Input type='text' className='form-control' required value={shelterName}
                    onChange={e => this.inputChanged('shelterName', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td><Input type='text' className='form-control' required value={address}
                    onChange={e => this.inputChanged('address', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>City</th>
                  <td><Input type='text' className='form-control' required value={city}
                    onChange={e => this.inputChanged('city', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>State</th>
                  <td><Input type='text' className='form-control' required value={state}
                    onChange={e => this.inputChanged('state', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Zip Code</th>
                  <td><Input type='number' min='0' max='99999' className='form-control' required value={zip}
                    onChange={e => this.inputChanged('zip', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td><Input type='email' className='form-control' required value={email}
                    onChange={e => this.inputChanged('email', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Phone number</th>
                  <td><Input type='number' className='form-control' required value={phoneNumber}
                    onChange={e => this.inputChanged('phoneNumber', e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Website</th>
                  <td><Input type='text' className='form-control' value={website}
                    onChange={e => this.inputChanged('website', e.target.value)} /></td>
                </tr>
              </tbody>
            </table>
            <hr />
          </div>
          <div className="row">
            <div className="col-sm-12 text-center">
              <button className="btn btn-primary btn-md m-2" onClick={this.onClickUpdate}>Update</button>
              <button className="btn btn-success  btn-md m-2" onClick={this.onClickEdit}>Cancel</button>
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
      more
    } = this.state;
    return (
      <>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          <h2>Pets at {shelter[0].ShelterName}</h2>
          {isShelterAdmin(shelterID) &&
            <Link to={`/pets/create`} className='btn btn-primary m-1'>
              Add A Pet
            </Link>
          }
        </div>
        {pets && <PetList
          pets={pets}
          page='shelter'
          typeOfAnimal={typeOfAnimal}
          breed={breed}
          sex={sex}
          minAge={minAge}
          maxAge={maxAge}
          more={more}
          inputChangeHandler={this.inputChanged}
        />}
      </>
    );
  }



  render() {
    log.debug("Calling render...")
    const { shelter, mode } = this.state;
    return (
      <div>
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
