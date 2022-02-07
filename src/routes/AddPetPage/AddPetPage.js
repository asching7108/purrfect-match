import React from 'react';
import { useNavigate, useParams } from 'react-router';
import PetForm from '../../components/PetForm/PetForm';
import { Section } from '../../components/Utils/Utils';

export default function AddPetPage () {
  const navigate = useNavigate();
  const params = useParams();

  const handleAddPetSuccess = petID => {
    navigate(`/pets/${petID}`);
  }

  const handleClickCancel = () => {
    navigate(`/shelters/${params.shelterID}/pets`);
  }

  return (
    <Section>
      <h2>Add A Pet</h2>
      <PetForm
        type='create'
        shelterID={params.shelterID}
        onAddPetSuccess={handleAddPetSuccess}
        onClickCancel={handleClickCancel}
      />
    </Section>
  );
}
