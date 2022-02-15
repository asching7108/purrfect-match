import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PetCard from './PetCard';
import { Input } from './Utils/Utils';
import PetsService from '../services/petsService';

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
    inputChangeHandler
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
