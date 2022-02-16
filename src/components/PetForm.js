import React, { Component } from 'react';
import { Checkbox, FormGroup, Input, PrimaryButton, SecondaryButton, Select, TextArea } from './Utils/Utils';
import PetsService from '../services/petsService';
import FilesUploadComponent from './FileUpload/FileUpload';

export default class PetForm extends Component {
  static defaultProps = {
    pet: {},
    type: '',
    shelterID: '',
    onAddPetSuccess: () => { },
    onClickCancel: () => { }
  };

  constructor(props) {
    super(props);
    this.onFileChange = this.onFileChange.bind(this);
    this.state = {
      breeds: [],
      name: '',
      typeOfAnimal: 'Cat',
      breed: 'Domestic ShortHair',
      sex: 'Female',
      age: '',
      size: '',
      picture: '',
      availability: 'Available',
      description: '',
      goodWithOtherAnimals: false,
      goodWithChildren: false,
      mustBeLeashed: false,
      neutered: false,
      vaccinated: false,
      houseTrained: false,
      error: null
    };
  }

  componentDidMount() {
    PetsService.getBreeds()
      .then(breeds => this.setState({ breeds }))
      .catch(error => console.log(error));
  }

  inputChanged(field, content) {
    this.setState({ [field]: content });
  }

  checkBoxChanged(field) {
    this.setState({ [field]: !this.state[field] });
  }

  onFileChange(e) {
    this.setState({ profileImg: e.target.files[0] })
  }

  imageStatusChange(status) {
    this.setState({ imageStatus: status })
  }

  handleAddSubmit = e => {
    e.preventDefault();

    console.log("handleAddSubmit...")

    PetsService.postImage(this.state.profileImg)
      .then(res => {
        console.log("Image is saved in server")
        const pet = this.getPet(res.path);
        PetsService.postPet(pet)
          .then(res => {

            this.props.onAddPetSuccess(res.insertId);
          })
          .catch(res => {
            this.setState({ error: res.error });
          });
      })
      .catch(res => {
        this.setState({ error: res.error });
      });
  }

  handleUpdateSubmit = e => {
    // TODO
  }

  getPet(filepath) {
    const {
      name,
      typeOfAnimal,
      breed,
      sex,
      age,
      size,
      picture,
      availability,
      description,
      goodWithOtherAnimals,
      goodWithChildren,
      mustBeLeashed,
      neutered,
      vaccinated,
      houseTrained
    } = this.state;
    return {
      name,
      typeOfAnimal,
      breed,
      sex,
      age: age === '' ? null : age,
      size,
      picture: filepath,
      availability,
      description,
      goodWithOtherAnimals,
      goodWithChildren,
      mustBeLeashed,
      neutered,
      vaccinated,
      houseTrained,
      shelterID: this.props.shelterID
    };
  }

  renderBreedOptions() {
    return this.state.breeds
      .filter(breed => breed.TypeOfAnimal === this.state.typeOfAnimal)
      .map(breed => <option key={breed.Breed} value={breed.Breed}>{breed.Breed}</option>);
  }

  render() {
    const {
      name,
      typeOfAnimal,
      breed,
      sex,
      age,
      size,
      picture,
      availability,
      description,
      goodWithOtherAnimals,
      goodWithChildren,
      mustBeLeashed,
      neutered,
      vaccinated,
      houseTrained,
      error
    } = this.state;

    return (
      <form
        onSubmit={this.props.type === 'create'
          ? this.handleAddSubmit
          : this.handleUpdateSubmit
        }
      >
        {error && <div className='alert alert-danger' role='alert'>{error}</div>}
        <FormGroup>
          <label htmlFor='name'>Name</label>
          <Input
            name='name'
            id='name'
            value={name}
            onChange={e => this.inputChanged('name', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor='typeOfAnimal'>Type Of Animal</label>
          <Select
            name='typeOfAnimal'
            id='typeOfAnimal'
            value={typeOfAnimal}
            onChange={e => this.inputChanged('typeOfAnimal', e.target.value)}
            required
          >
            <option value='Cat'>Cat</option>
            <option value='Dog'>Dog</option>
            <option value='Other'>Other</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor='breed'>Breed</label>
          <Select
            name='breed'
            id='breed'
            value={breed}
            onChange={e => this.inputChanged('breed', e.target.value)}
            required
          >
            {this.renderBreedOptions()}
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor='sex'>Sex</label>
          <Select
            name='sex'
            id='sex'
            value={sex}
            onChange={e => this.inputChanged('sex', e.target.value)}
            required
          >
            <option value='Female'>Female</option>
            <option value='Male'>Male</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor='age'>Age</label>
          <Input
            name='age'
            id='age'
            type='number'
            value={age}
            onChange={e => this.inputChanged('age', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor='size'>Size</label>
          <Input
            name='size'
            id='size'
            value={size}
            onChange={e => this.inputChanged('size', e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor='availability'>Availability</label>
          <Select
            name='availability'
            id='availability'
            value={availability}
            onChange={e => this.inputChanged('availability', e.target.value)}
            required
          >
            <option value='Available'>Available</option>
            <option value='Not Available'>Not Available</option>
            <option value='Pending'>Pending</option>
            <option value='Adopted'>Adopted</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <label htmlFor='description'>Description</label>
          <TextArea
            name='description'
            id='description'
            value={description}
            onChange={e => this.inputChanged('description', e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup className='petImage'>
          <label htmlFor='petImage'>Pet Image</label>
          <FilesUploadComponent id='picture' onChange={this.onFileChange} required />
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='goodWithOtherAnimals'
            id='goodWithOtherAnimals'
            checked={goodWithOtherAnimals}
            onChange={e => this.checkBoxChanged('goodWithOtherAnimals')}
          />
          <label className='form-check-label' htmlFor='goodWithOtherAnimals'>Good With Other Animals</label>
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='goodWithChildren'
            id='goodWithChildren'
            checked={goodWithChildren}
            onChange={e => this.checkBoxChanged('goodWithChildren')}
          />
          <label className='form-check-label' htmlFor='goodWithChildren'>Good With Children</label>
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='mustBeLeashed'
            id='mustBeLeashed'
            checked={mustBeLeashed}
            onChange={e => this.checkBoxChanged('mustBeLeashed')}
          />
          <label className='form-check-label' htmlFor='mustBeLeashed'>Must Be Leashed</label>
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='neutered'
            id='neutered'
            checked={neutered}
            onChange={e => this.checkBoxChanged('neutered')}
          />
          <label className='form-check-label' htmlFor='neutered'>Neutered</label>
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='vaccinated'
            id='vaccinated'
            checked={vaccinated}
            onChange={e => this.checkBoxChanged('vaccinated')}
          />
          <label className='form-check-label' htmlFor='vaccinated'>Vaccinated</label>
        </FormGroup>
        <FormGroup className='form-check'>
          <Checkbox
            name='houseTrained'
            id='houseTrained'
            checked={houseTrained}
            onChange={e => this.checkBoxChanged('houseTrained')}
          />
          <label className='form-check-label' htmlFor='houseTrained'>House Trained</label>
        </FormGroup>
        <PrimaryButton type='submit'>
          Submit
        </PrimaryButton>
        <SecondaryButton type='button' onClick={this.props.onClickCancel}>
          Cancel
        </SecondaryButton>
      </form>
    );
  }
}
