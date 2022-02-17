import React, { Component } from 'react';
import { isShelterAdmin, Section } from '../../components/Utils/Utils';
import './SheltersPege.css';
import SheltersService from '../../services/sheltersService';
import * as logUtils from '../../components/Utils/Logger';
import PetList from '../../components/PetList';
import PetsService from '../../services/petsService';
import { Link } from 'react-router-dom';
var log = logUtils.getLogger()

export default class SheltersPege extends Component {

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
      more: []
    };
    this.inputChanged = this.inputChanged.bind(this);
  }

  componentDidMount() {
    log.debug("Getting shelter data...")
    const path = window.location.pathname;
    const shelterID = path.substring(path.lastIndexOf('/') + 1)
    this.setState({ shelterID });
    SheltersService.getShelter(shelterID)
      .then(shelter => this.setState({ shelter: shelter }))
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

  renderShelter(shelter) {
    log.debug("Calling renderShelter...")
    return (
      <div>
        <h2>{shelter[0].ShelterName}</h2>
        <hr />
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
        </div>
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
            <Link to={`/shelters/${shelterID}/pets/create`} className='btn btn-primary'>
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
    const { shelter } = this.state;
    return (
      <div>
        <Section>
          {shelter && this.renderShelter(shelter)}
        </Section>
        <hr />
        <Section>
          {shelter && this.renderPetList()}
        </Section>
      </div>

    );
  }
}
