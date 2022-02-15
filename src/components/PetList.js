import React from 'react';
import PetCard from './PetCard';

export default function PetList({ pets, petCount, page }) {
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
}
