import React, { Component } from 'react';
import PetList from '../../components/PetList';
import PetsService from '../../services/petsService';
import { Section } from '../../components/Utils/Utils';
import UsersService from '../../services/usersService';
import AuthService from '../../services/authService';

export default class FavoritesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pets: null,
      typeOfAnimal: [],
      breed: [],
      sex: '',
      minAge: '',
      maxAge: '',
      more: []
    };
  }

  componentDidMount() {
    PetsService.getPets({})
      .then(pets => {
        UsersService.getUserFavorites(AuthService.getUserIDFromToken())
          .then(favorites => {
            const favoritePets = (pets.filter(elem => {
              return favorites.includes(elem.PetID);
            }));
            this.setState({ pets: favoritePets })
          })
          
      })
      .catch(error => console.log(error));
  }

  render() {
    const {
      pets,
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more
    } = this.state;

    return (
      <Section>
        <h2>My Favorite Pets</h2>
        <span className='text-muted'>A place to view all of the pets you have marked as favorites</span>
        {pets && <PetList
          pets={pets}
          page='favorites'
          typeOfAnimal={typeOfAnimal}
          breed={breed}
          sex={sex}
          minAge={minAge}
          maxAge={maxAge}
          more={more}
          inputChangeHandler={() => { }}
          savedPreferencesHandler={() => { }}
        />}
      </Section>
    );
  }
}
