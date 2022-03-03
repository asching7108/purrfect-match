import React, { Component } from 'react';
import PetList from '../components/PetList';
import { Section } from '../components/Utils/Utils';
import AuthService from '../services/authService';
import PetsService from '../services/petsService';
import UsersService from '../services/usersService';
import * as logUtils from '../components/Utils/Logger';
const log = logUtils.getLogger();

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
      zipCode: '',
      loading: false
    };
    this.inputChanged = this.inputChanged.bind(this);
    this.changeSavedPreferences = this.changeSavedPreferences.bind(this);
  }

  componentDidMount() {
    const userID = AuthService.getUserIDFromToken();
    if (userID)
      UsersService.getUser(userID)
        .then(user => this.setState({ zipCode: user[0].ZipCode }))
        .catch(error => log.debug(error));
    else
      PetsService.getPets({})
        .then(pets => this.setState({ pets }))
        .catch(error => log.debug(error));
  }

  inputChanged(field, content, submit = true) {
    if (submit)
      this.setState({ [field]: content }, () => this.handleSubmit());
    else
      this.setState({ [field]: content });
  }

  changeSavedPreferences(changedPrefs) {
    this.setState(changedPrefs, () => this.handleSubmit());
  }

  handleSubmit = () => {
    this.setState({ loading: true });
    PetsService.getPets(this.getFilters())
      .then(pets => {
        this.setState({ loading: false, pets });
      })
      .catch(res => {
        this.setState({ loading: false, error: res.error });
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
      zipCode,
      loading
    } = this.state;

    return (
      <Section>
        {<PetList
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
          loading={loading}
        />}
      </Section>
    );
  }
}
