import React from 'react';
import { useNavigate, useParams } from 'react-router';
import PetForm from '../components/PetForm';
import { isShelterAdmin, Section } from '../components/Utils/Utils';
import AuthService from '../services/authService';

export default function AddPetPage () {
  const navigate = useNavigate();
  const params = useParams();

  const handleAddPetSuccess = petID => {
    navigate(`/pets/${petID}`);
  }

  const handleClickCancel = () => {
    navigate(`/shelters/${AuthService.getShelterIDFromToken()}/pets`);
  }

  if (!isShelterAdmin(params.shelterID)) {
    return (
      <div className='alert alert-danger' role='alert'>
        Not authorized to create pets for the selected shelter.
      </div>
    );
  }

  return (
    <Section>
      <h2>Add A Pet</h2>
      <PetForm
        type='create'
        shelterID={AuthService.getShelterIDFromToken()}
        onSubmitSuccess={handleAddPetSuccess}
        onClickCancel={handleClickCancel}
      />
    </Section>
  );
}
