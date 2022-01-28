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

  renderPets() {
    const { pets } = this.state;
    return (
      pets.map(pet => 
        <PetCard key={pet.PetID} pet={pet} />  
      ));
  }
  
  render() {
    return (
      <div>
        {this.renderPets()}
      </div>
    );
  }
}
