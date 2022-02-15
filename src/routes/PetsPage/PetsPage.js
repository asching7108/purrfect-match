import React, { Component } from 'react';
import PetFilters from '../../components/PetFilters';
import PetList from '../../components/PetList';
import { Section } from '../../components/Utils/Utils';
import PetsService from '../../services/petsService';

export default class PetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      petCount: -1, // this is set to prevent the no pets alert before data is loaded
      typeOfAnimal: [],
      breed: [],
      sex: '',
      minAge: '',
      maxAge: '',
      more: []
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.multiSelectChanged = this.multiSelectChanged.bind(this);
  }

  componentDidMount() {
    PetsService.getPets({})
      .then(pets => this.setState({ pets, petCount: pets.length }))
      .catch(error => console.log(error));
  }

  inputChanged(field, content) {
    this.setState({ [field]: content }, () => this.handleSubmit());
  }

  multiSelectChanged(field, selectedOptions) {
    this.setState({ [field]: selectedOptions }, () => this.handleSubmit());
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
      more
    } = this.state;
    const filters = {};
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
  
  render() {
    const {
      pets,
      petCount,
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more
    } = this.state;
    return (
      <Section>
        <PetFilters
          typeOfAnimal={typeOfAnimal}
          breed={breed}
          sex={sex}
          minAge={minAge}
          maxAge={maxAge}
          more={more}
          inputChangeHandler={this.inputChanged}
          multiSelectChangeHandler={this.multiSelectChanged}
        />
        <br />
        <PetList pets={pets} petCount = {petCount} page='pets' />
      </Section>
    );
  }
}
