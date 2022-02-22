import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PetCard from './PetCard';
import { Input } from './Utils/Utils';
import PetsService from '../services/petsService';
import UsersService from '../services/usersService';
import AuthService from '../services/authService';

export default function PetList(props) {
  const {
    pets,
    page,
    typeOfAnimal,
    breed,
    sex,
    minAge,
    maxAge,
    more,
    inputChangeHandler,
    savedPreferencesHandler,
  } = props;

  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    if (breeds.length === 0) {
      PetsService.getBreeds()
        .then(breeds => setBreeds(breeds))
        .catch(error => console.log(error));
    }
  });

  // This useEffect only runs one when mounted
  useEffect(() => {
    const userID = AuthService.getUserIDFromToken()
    if (userID) {
      getSavedPreferences(userID);
    }
  }, [])

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
      return { value: breed.Breed, label: `${breed.TypeOfAnimal} - ${breed.Breed}` };
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

  const savePreferences = async (e) => {
    e.preventDefault();
    const objectKeys = ['typeOfAnimal', 'breed', 'sex', 'minAge', 'maxAge', 'more'];
    const preferenceTypes = [typeOfAnimal, breed, sex.value, minAge, maxAge, more];
    let changedPreferences = {};

    for (let i = 0; i < preferenceTypes.length; i++) {
      let type = preferenceTypes[i];
      if ((Array.isArray(type) && type.length !== 0) || (!Array.isArray(type) && type)) {
        changedPreferences[objectKeys[i]] = type;
      }
    }
    UsersService.saveUserPreferences(AuthService.getUserIDFromToken(), 'POST', changedPreferences);
  }

  const getSavedPreferences = async (userID) => {
    try {
      let res = await UsersService.getSavedPreferences(userID)
      res = res[0];

      const changedPrefs = {
        typeOfAnimal: res.TypeOfAnimal ? JSON.parse(res.TypeOfAnimal) : [],
        breed: res.Breed ? JSON.parse(res.Breed) : [],
        sex: res.Sex ? { value: res.Sex, label: res.Sex } : '',
        minAge: res.MinAge ? res.MinAge : '',
        maxAge: res.MaxAge ? res.MaxAge : '',
        more: res.More ? JSON.parse(res.More) : []
      }
      savedPreferencesHandler(changedPrefs);
    } catch (error) {
      console.log(error);
    }
  }
  const clearFilters = () => {
    for (const field of ['typeOfAnimal', 'breed', 'more']) {
      inputChangeHandler(field, []);
    }
    for (const field of ['sex', 'minAge', 'maxAge']) {
      inputChangeHandler(field, '');
    }
  };

  const renderPet = pet => {
    return (
      <div key={pet.PetID} className='col-sm-4'>
        <PetCard pet={pet} page={page} />
      </div>
    );
  };

  const renderPetRow = rowStart => {
    return (
      <div key={rowStart} className='row mb-2'>
        {pets.slice(rowStart, rowStart + 3).map(pet => renderPet(pet))}
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <>
        <form>
          <div className='row mb-2'>
            <div className='col-sm m-1'>
              <Select
                placeholder='TYPE OF PET'
                name='typeOfAnimal'
                id='typeOfAnimal'
                value={typeOfAnimal}
                options={typeOptions}
                onChange={selectedOptions => inputChangeHandler('typeOfAnimal', selectedOptions)}
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
                onChange={selectedOptions => inputChangeHandler('breed', selectedOptions)}
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
                onChange={selectedOption => inputChangeHandler('sex', selectedOption)}
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
                onChange={e => inputChangeHandler('minAge', e.target.value)}
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
                onChange={e => inputChangeHandler('maxAge', e.target.value)}
              />
            </div>
            <div className='col-sm m-1'>
              <Select
                placeholder='MORE'
                name='more'
                id='more'
                value={more}
                options={moreOptions}
                onChange={selectedOptions => inputChangeHandler('more', selectedOptions)}
                isMulti
              />
            </div>
          </div>
        </form>
        <div className='d-flex justify-content-end'>
          <button className='btn btn-primary btn-sm m-1' onClick={savePreferences}>Save Preferences</button>
          <button className='btn btn-outline-primary btn-sm m-1' onClick={clearFilters}>Clear Filters</button>
        </div>
      </>
    );
  };

  const renderPetList = () => {
    const petCount = pets.length;

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
      <div>
        {[...Array(petRows)].map((_, i) => renderPetRow(i * 3))}
      </div>
    );
  };

  return (
    <>
      {renderFilters()}
      <br />
      {renderPetList()}
    </>
  );
}
