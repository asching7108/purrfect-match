import React, { Component } from 'react';
import { Section, FormGroup } from '../../components/Utils/Utils';
import './SheltersPege.css';
import SheltersService from '../../services/sheltersService';
import PetCard from '../../components/PetCard/PetCard';

export default class SheltersPege extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shelterID: null,
      shelter: null,
      pets: null,
      typeOfPets: "Any",
      age: "Any",
      availability: "Any"
    };
  }

  componentDidMount() {
    console.log("Getting shelter data...")
    const path = window.location.pathname;
    const shelterID = path.substring(path.lastIndexOf('/') + 1)
    SheltersService.getShelter(shelterID)
      .then(shelter => this.setState({ shelter: shelter }))
      .catch(error => console.log(error));

    console.log("Getting pets data...")
    SheltersService.getPetsByShelter(shelterID)
      .then(pets => this.setState({ pets: pets }))
      .catch(error => console.log(error));
  }

  renderShelter(shelter) {
    console.log("Calling renderShelter...")
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
        <hr />
        <h2>Pets at {shelter[0].ShelterName}</h2>
      </div>
    );
  }

  renderPet(pet, cName) {
    console.log("Calling renderPet")
    return (
      <PetCard className={cName} key={pet.PetID} pet={pet} />
    );
  }

  renderPets(pets, typeOfPets, age, available) {
    console.log("Calling renderPets")
    // no pets exist
    if (pets.length === 0) {
      return (
        <div className='alert alert-success' role='alert'>
          More pets will be available soon! Check back later :)
        </div>
      );
    } else {
      return (
        <div>
          <Section>
            {this.renderFilter()}
          </Section>
          <Section>
            <div className='row'>
              {pets.map(pet => {
                let typeOfAnimal = (pet.TypeOfAnimal === "Cat" || pet.TypeOfAnimal === "Dog") ? pet.TypeOfAnimal : "Other"

                let petAge = ""
                if (parseInt(pet.Age) <= 1 && typeOfAnimal === "Cat") petAge = "Kitten"
                else if (parseInt(pet.Age) <= 1 && typeOfAnimal === "Dog") petAge = "Puppy"
                else if (parseInt(pet.Age) <= 2) petAge = "Young"
                else if (parseInt(pet.Age) <= 7) petAge = "Adult"
                else petAge = "Senior"

                let cName = "hideCard"
                if (typeOfPets === "Any" && age === "Any" && available === "Any") cName = "showCard"
                if (typeOfPets === "Any" && age === "Any" && available === pet.Availability) cName = "showCard"
                if (typeOfPets === "Any" && age === petAge && available === pet.Availability) cName = "showCard"
                if (typeOfPets === typeOfAnimal && age === "Any" && available === "Any") cName = "showCard"
                if (typeOfPets === typeOfAnimal && age === petAge && available === "Any") cName = "showCard"
                if (typeOfPets === "Any" && age === petAge && available === "Any") cName = "showCard"
                if (typeOfPets === "Any" && age === petAge && available === pet.Availability) cName = "showCard"
                if (typeOfPets === typeOfAnimal && age === "Any" && available === pet.Availability) cName = "showCard"
                if (typeOfPets === typeOfAnimal && age === petAge && available === pet.Availability) cName = "showCard"

                return this.renderPet(pet, cName)
              })}
            </div>
          </Section>

        </div>

      )
    }
  }

  renderFilter() {
    console.log("Calling renderFilter")
    return (
      <FormGroup className="flex">
        <div className="select-wrap" style={{ width: "100%" }}>
          <label>Type of Pets</label>
          <select id='typeOfPets' name="typeOfPets" onChange={e => this.inputChanged('typeOfPets', e.target.value)}>
            <option value='Any'>Any</option>
            <option value='Cat'>Cat</option>
            <option value='Dog'>Dog</option>
            <option value='Other'>Other</option>
          </select>
        </div>

        <div className="select-wrap" style={{ width: "100%" }}>
          <label>Age</label>
          <select id='age' name="age" onChange={e => this.inputChanged('age', e.target.value)}>
            <option value='Any'>Any</option>
            <option value='Puppy'>Puppy</option>
            <option value='Kitten'>Kitten</option>
            <option value='Young'>Young</option>
            <option value='Adult'>Adult</option>
            <option value='Senior'>Senior</option>
          </select>
        </div>

        <div className="select-wrap" style={{ width: "100%" }}>
          <label>Availability</label>
          <select id='availability' name="availability" onChange={e => this.inputChanged('availability', e.target.value)} >
            <option value='Any'>Any</option>
            <option value='Available'>Available</option>
            <option value='Pending'>Pending</option>
          </select>
        </div>

      </FormGroup>
    )
  }

  inputChanged(field, content) {
    console.log("Calling inputChanged")
    this.setState({ [field]: content });
  }

  render() {
    console.log("Calling render...")
    const { shelter } = this.state;
    const { pets } = this.state;

    return (
      <div>
        <Section>
          {this.state.shelter == null ? null : this.renderShelter(shelter)}
        </Section>
        <Section>
          {this.state.pets == null ? null : this.renderPets(pets, this.state.typeOfPets, this.state.age, this.state.availability)}
        </Section>
      </div>

    );
  }
}

