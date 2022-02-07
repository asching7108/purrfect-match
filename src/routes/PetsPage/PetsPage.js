import React, { Component } from 'react';
import PetCard from '../../components/PetCard/PetCard';
import { Section } from '../../components/Utils/Utils';
import PetsService from '../../services/petsService';

export default class PetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      petCount: -1  // this is set to prevent the no pets alert before data is loaded
    };
  }

  componentDidMount() {
    PetsService.getPets()
      .then(pets => this.setState({ pets, petCount: pets.length }))
      .catch(error => console.log(error));
  }

  renderPetRow(rowStart) {
    return (
      <div key={rowStart} className='row'>
        {this.state.pets.slice(rowStart, rowStart + 3).map(pet => this.renderPet(pet))}
      </div>
    );
  }

  renderPet(pet) {
    return (
      <PetCard key={pet.PetID} pet={pet} />
    );
  }
  
  render() {
    const { petCount } = this.state;

    // no pets exist
    if (petCount === 0) {
      return (
        <div className='alert alert-success' role='alert'>
          More pets will be available soon! Check back later :)
        </div>
      );
    }

    // place pets in a 3-cols grid
    const petRows = Math.floor(petCount / 3) + (petCount % 3 === 0 ? 0 : 1);
    return (
      <Section>
        {[...Array(petRows)].map((_, i) => this.renderPetRow(i * 3))}
      </Section>
    );
  }
}
