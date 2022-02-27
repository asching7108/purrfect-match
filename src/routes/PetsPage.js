import React, { Component } from 'react';
import PetList from '../components/PetList';
import { Section } from '../components/Utils/Utils';
import PetsService from '../services/petsService';

export default class PetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: null,
      typeOfAnimal: [],
      breed: [],
      sex: '',
      minAge: '',
      maxAge: '',
      more: [],
      distance: { label: 'Anywhere', value: '' },
      zipCode: ''
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.changeSavedPreferences = this.changeSavedPreferences.bind(this);
  }

  componentDidMount() {
    PetsService.getPets({})
      .then(pets => this.setState({ pets }))
      .catch(error => console.log(error));
  }

  inputChanged(field, content) {
    this.setState({ [field]: content }, () => this.handleSubmit());
  }

  changeSavedPreferences(changedPrefs) {
    this.setState(changedPrefs, () => this.handleSubmit());
  }

  handleSubmit = () => {
    PetsService.getPets(this.getFilters())
      .then(pets => {
        this.setState({ pets });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  getFilters() {
    const {
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more,
      distance,
      zipCode
    } = this.state;
    const filters = { availability: 'Available' };
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
    if (distance)
      filters.distance = distance.value;
    if (zipCode > 0)
      filters.zipCode = zipCode;
    return filters;
  }
  
  render() {
    const {
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
      <Section>
        {pets && <PetList
          pets={pets}
          page='pets'
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
      </Section>
    );
  }
}
