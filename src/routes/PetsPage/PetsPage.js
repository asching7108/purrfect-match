import React, { Component } from 'react';
import PetCard from '../../components/PetCard/PetCard';
import PetsService from '../../services/petsService';

export default class PetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { pets: [] };
  }

  componentDidMount() {
    PetsService.getPets()
			.then(pets => this.setState({ pets }))
			.catch(error => console.log(error));
  }

  renderPetRow(rowStart) {
    return (
      <div className='row'>
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
    const { pets } = this.state;
    const petRows = pets.length / 3 + (pets.length % 3 === 0 ? 0 : 1);
    return (
      <div className='container'>
        {[...Array(petRows)].map((_, i) => this.renderPetRow(i * 3))}
      </div>
    );
  }
}
