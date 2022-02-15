import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Input } from './Utils/Utils';
import PetsService from '../services/petsService';

export default function PetFilters(props) {
  const {
    typeOfAnimal,
    breed,
    sex,
    minAge,
    maxAge,
    more,
    inputChangeHandler,
    multiSelectChangeHandler
  } = props;
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    if (breeds.length === 0) {
      PetsService.getBreeds()
        .then(breeds => setBreeds(breeds))
        .catch(error => console.log(error));
    }
  });

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
            onChange={selectedOptions => multiSelectChangeHandler('typeOfAnimal', selectedOptions)}
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
            onChange={selectedOptions => multiSelectChangeHandler('breed', selectedOptions)}
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
            onChange={selectedOptions => multiSelectChangeHandler('more', selectedOptions)}
            isMulti
          />
        </div>
      </div>
    </form>
  );
}
