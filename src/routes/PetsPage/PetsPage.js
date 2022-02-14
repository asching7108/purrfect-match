import React, { Component } from 'react';
import Select from 'react-select';
import PetCard from '../../components/PetCard/PetCard';
import { Checkbox, FormGroup, Input, PrimaryButton, Section } from '../../components/Utils/Utils';
import PetsService from '../../services/petsService';

export default class PetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      breeds: [],
      pets: [],
      petCount: -1, // this is set to prevent the no pets alert before data is loaded
      typeOfAnimal: [],
      breed: [],
      sex: '',
      minAge: '',
      maxAge: '',
      more: []
    };
  }

  componentDidMount() {
    PetsService.getBreeds()
      .then(breeds => this.setState({ breeds }))
      .catch(error => console.log(error));
    PetsService.getPets({})
      .then(pets => this.setState({ pets, petCount: pets.length }))
      .catch(error => console.log(error));
  }

  inputChanged(field, content) {
    this.setState({ [field]: content }, () => this.handleSubmit());
  }

  multiSelectChanged(field, selectedOptions) {
    const values = Array.from(selectedOptions, option => option.value);
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

  renderFilters() {
    const {
      breeds,
      typeOfAnimal,
      breed,
      sex,
      minAge,
      maxAge,
      more
    } = this.state;
    const typeOptions = [
      { value: 'Cat', label: 'Cat' },
      { value: 'Dog', label: 'Dog' },
      { value: 'Other', label: 'Other' }
    ];
    const breedOptions = breeds
      .filter(breed => typeOfAnimal.length > 0
        ? typeOfAnimal.find(type => type.value === breed.TypeOfAnimal) : true
      )
      .map(breed => {
        return { value: breed.Breed, label: `${breed.TypeOfAnimal} - ${breed.Breed}` }
      });
    const sexOptions = [
      { value: 'Female', label: 'Female' },
      { value: 'Male', label: 'Male' }
    ];
    const moreOptions = [
      { value: 'goodWithOtherAnimals', label: 'Good With Other Animals' },
      { value: 'goodWithChildren', label: 'Good With Children' },
      { value: 'leashNotRequired', label: 'Leash Not Required' },
      { value: 'neutered', label: 'Neutered' },
      { value: 'vaccinated', label: 'Vaccinated' },
      { value: 'houseTrained', label: 'House Trained' },
    ];
    return (
      <form>
        <div className='row mb-2'>
          <div className='col-sm m-1'>
            <Select
              placeholder='TYPE OF PET'
              name='typeOfAnimal'
              id='typeOfAnimal'
              value={typeOfAnimal}
              options={typeOptions}
              onChange={selectedOptions => this.multiSelectChanged('typeOfAnimal', selectedOptions)}
              isMulti
            />
          </div>
          <div className='col-sm m-1'>
            <Select
              placeholder='BREED'
              name='breed'
              id='breed'
              value={breed}
              options={breedOptions}
              onChange={selectedOptions => this.multiSelectChanged('breed', selectedOptions)}
              isMulti
            />
          </div>
          <div className='col-sm m-1'>
            <Select
              placeholder='SEX'
              name='sex'
              id='sex'
              value={sex}
              options={sexOptions}
              onChange={selectedOption => this.inputChanged('sex', selectedOption)}
              isClearable
            />
          </div>
        </div>
        <div className='row mb-2'>
          <div className='col-sm m-1'>
            <Input
              className=''
              placeholder='FROM AGE'
              name='minAge'
              id='minAge'
              type='number'
              value={minAge}
              onChange={e => this.inputChanged('minAge', e.target.value)}
            />
          </div>
          <div className='col-sm m-1'>
            <Input
              className=''
              placeholder='TO AGE'
              name='maxAge'
              id='maxAge'
              type='number'
              value={maxAge}
              onChange={e => this.inputChanged('maxAge', e.target.value)}
            />
          </div>
          <div className='col-sm m-1'>
            <Select
              placeholder='MORE'
              name='more'
              id='more'
              value={more}
              options={moreOptions}
              onChange={selectedOptions => this.multiSelectChanged('more', selectedOptions)}
              isMulti
            />
          </div>
        </div>
      </form>
    );
  }

  renderPetRow(rowStart) {
    return (
      <div key={rowStart} className='row mb-2'>
        {this.state.pets.slice(rowStart, rowStart + 3).map(pet => this.renderPet(pet))}
      </div>
    );
  }

  renderPet(pet) {
    return (
      <div className='col-sm-4'>
        <PetCard key={pet.PetID} pet={pet} page='pets' className='border rounded m-1 p-2' />
      </div>
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
        {this.renderFilters()}
        <br />
        {[...Array(petRows)].map((_, i) => this.renderPetRow(i * 3))}
      </Section>
    );
  }
}
