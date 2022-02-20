import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import PetForm from '../components/PetForm';
import { Section } from '../components/Utils/Utils';
import AuthService from '../services/authService';
import PetsService from '../services/petsService';

export default function EditPetPage () {
  const navigate = useNavigate();
  const params = useParams();
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pet) {
      PetsService.getPet(params.petID)
        .then(pet => setPet(pet))
        .catch(e => {
          setError(e.error);
        });
    }
  });

  const handleEditPetSuccess = () => {
    navigate(`/pets/${pet.PetID}`);
  }

  const handleClickCancel = () => {
    navigate(`/pets/${pet.PetID}`);
  }

  if (error) {
    return <div className='alert alert-danger' role='alert'>{error}</div>;
  }

  // initial state
  if (!pet) {
    return <></>;
  }

  if (!AuthService.isShelterAdmin()) {
    return (
      <div className='alert alert-danger' role='alert'>
        Not authorized to edit pets for the selected shelter.
      </div>
    );
  }

  if (params.shelterID != pet.ShelterID) {
    return (
      <div className='alert alert-danger' role='alert'>
        Not authorized to edit the selected pet.
      </div>
    );    
  }

  return (
    <Section>
      <h2>Edit Pet</h2>
      <PetForm
        type='edit'
        shelterID={AuthService.getShelterIDFromToken()}
        pet={pet}
        onSubmitSuccess={handleEditPetSuccess}
        onClickCancel={handleClickCancel}
      />
    </Section>
  );
}
