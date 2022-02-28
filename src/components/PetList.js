import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PetCard from './PetCard';
import { Input } from './Utils/Utils';
import PetsService from '../services/petsService';
import UsersService from '../services/usersService';
import AuthService from '../services/authService';
import * as logUtils from '../components/Utils/Logger';
const log = logUtils.getLogger();

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
    distance,
    zipCode,
    inputChangeHandler,
    savedPreferencesHandler,
    loading
  } = props;

  const [breeds, setBreeds] = useState([]);
  const [savedPrefs, setSavedPrefs] = useState(false);
  const [confirmSaved, setConfirmSaved] = useState(false);

  useEffect(() => {
    if (breeds.length === 0) {
      PetsService.getBreeds()
        .then(breeds => setBreeds(breeds))
        .catch(error => log.debug(error));
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

  const distanceOptions = [
    { value: '', label: 'Anywhere' },
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
    { value: '100', label: '100 miles' }
  ];

  const savePreferences = async (e) => {
    e.preventDefault();
    const objectKeys = ['typeOfAnimal', 'breed', 'sex', 'minAge', 'maxAge', 'more', 'distance', 'zipCode'];
    const preferenceTypes = [typeOfAnimal, breed, sex?.value, minAge, maxAge, more, distance, zipCode];
    let changedPreferences = {};

    for (let i = 0; i < preferenceTypes.length; i++) {
      let type = preferenceTypes[i];
      if ((Array.isArray(type) && type.length !== 0) || (!Array.isArray(type) && type)) {
        changedPreferences[objectKeys[i]] = type;
      }
    }
    // Determine if POST or PATCH
    if (savedPrefs) {
      await UsersService.saveUserPreferences(AuthService.getUserIDFromToken(), 'PATCH', changedPreferences);
      setConfirmSaved(true);
    } else {
      await UsersService.saveUserPreferences(AuthService.getUserIDFromToken(), 'POST', changedPreferences);
      setSavedPrefs(true);
      setConfirmSaved(true);
    }

  }

  const getSavedPreferences = async (userID) => {
    try {
      let res = await UsersService.getSavedPreferences(userID);
      if (res.length > 0) {
        res = res[0];

        const changedPrefs = {
          typeOfAnimal: res.TypeOfAnimal ? JSON.parse(res.TypeOfAnimal) : [],
          breed: res.Breed ? JSON.parse(res.Breed) : [],
          sex: res.Sex ? { value: res.Sex, label: res.Sex } : '',
          minAge: res.MinAge ? res.MinAge : '',
          maxAge: res.MaxAge ? res.MaxAge : '',
          more: res.More ? JSON.parse(res.More) : [],
          distance: res.Distance ? JSON.parse(res.Distance) : { value: '', label: 'Anywhere' },
          zipCode: res.ZipCode || zipCode
        }
        setSavedPrefs(true);
        savedPreferencesHandler(changedPrefs);
      } else {
        savedPreferencesHandler({});
      }
    } catch (error) {
      log.debug(error);
    }
  }

  const clearFilters = () => {
    setConfirmSaved(false);
    for (const field of ['typeOfAnimal', 'breed', 'more']) {
      inputChangeHandler(field, [], false);
    }
    for (const field of ['sex', 'minAge', 'maxAge']) {
      inputChangeHandler(field, '', false);
    }
    if (page === 'pets')
      inputChangeHandler('distance', { label: 'Anywhere', value: '' });
    else
      inputChangeHandler('distance', distance);
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

  const renderSaveButton = () => {

    if (!AuthService.getUserIDFromToken()) return null;
    if (confirmSaved) return (<button type='button' className='btn btn-success btn-sm my-1' disabled>Preferences saved!</button>)

    return (<button type='button' className='btn btn-primary btn-sm my-1' onClick={savePreferences}>Save Preferences</button>)
  }

  const renderFilters = () => {
    return (
      <>
        <form onSubmit={e => false}>
          <div className='row mb-2'>
            <div className='col-sm m-1'>
              <Select
                placeholder='TYPE OF PET'
                name='typeOfAnimal'
                id='typeOfAnimal'
                value={typeOfAnimal}
                options={typeOptions}
                onChange={selectedOptions => {
                  setConfirmSaved(false);
                  inputChangeHandler('typeOfAnimal', selectedOptions)
                }}
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
                onChange={selectedOptions => {
                  setConfirmSaved(false);
                  inputChangeHandler('breed', selectedOptions)
                }}
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
                onChange={selectedOption => {
                  setConfirmSaved(false);
                  inputChangeHandler('sex', selectedOption)
                }}
                isClearable
              />
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-sm m-1'>
              <Input
                placeholder='FROM AGE'
                name='minAge'
                id='minAge'
                type='number'
                value={minAge}
                onChange={e => {
                  setConfirmSaved(false);
                  inputChangeHandler('minAge', e.target.value)
                }}
              />
            </div>
            <div className='col-sm m-1'>
              <Input
                placeholder='TO AGE'
                name='maxAge'
                id='maxAge'
                type='number'
                value={maxAge}
                onChange={e => {
                  setConfirmSaved(false);
                  inputChangeHandler('maxAge', e.target.value)
                }}
              />
            </div>
            <div className='col-sm m-1'>
              <Select
                placeholder='MORE'
                name='more'
                id='more'
                value={more}
                options={moreOptions}
                onChange={selectedOptions => {
                  setConfirmSaved(false);
                  inputChangeHandler('more', selectedOptions)
                }}
                isMulti
              />
            </div>
          </div>
          <div className='row mb-2'>
            <div className='col-sm m-1'>
              {page == 'pets' ?
                <Select
                  placeholder='DISTANCE'
                  name='distance'
                  id='distance'
                  value={distance}
                  options={distanceOptions}
                  onChange={selectedOption => {
                    setConfirmSaved(false);
                    inputChangeHandler('distance', selectedOption)
                  }}
                /> : ''}
            </div>
            <div className='col-sm m-1 d-flex align-items-start'>
              {page == 'pets' ?
                <>
                  <label className='mt-2' htmlFor='zipCode'>near </label>
                  <Input
                    className='ml-2'
                    placeholder='ZIP CODE'
                    name='zipCode'
                    id='zipCode'
                    type='number'
                    min='1'
                    max='99999'
                    value={zipCode}
                    onChange={e => {
                      setConfirmSaved(false);
                      e.target.value == '' || e.target.value.length == 5
                        ? inputChangeHandler('zipCode', e.target.value)
                        : inputChangeHandler('zipCode', e.target.value, false);
                    }}
                  />
                </> : ''}
            </div>
            <div className='col-sm m-1 d-flex justify-content-end row'>
              {renderSaveButton()}
              <button type='button' className='btn btn-outline-primary btn-sm my-1 ml-2' onClick={clearFilters}>Clear Filters</button>
            </div>
          </div>
        </form>
      </>
    );
  };

  const renderPetList = () => {
    if (!pets) return '';

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
      {loading ? <p className='text-center text-info'>Loading pets...</p> : ''}
      {renderPetList()}
    </>
  );
}
