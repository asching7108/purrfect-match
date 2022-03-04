import React from 'react';
import { useNavigate } from 'react-router';
import PetForm from '../components/PetForm';
import { Section } from '../components/Utils/Utils';
import AuthService from '../services/authService';

export default function AddPetPage() {
  const navigate = useNavigate();

  const handleAddPetSuccess = petID => {
    navigate(`/pets/${petID}`);
  }

  const handleClickCancel = () => {
    navigate(`/shelters/${AuthService.getShelterIDFromToken()}`);
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
