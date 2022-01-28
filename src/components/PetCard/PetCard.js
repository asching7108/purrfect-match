import React from 'react';
import { useNavigate } from "react-router";

export default function PetCard(props) {
  const { pet } = props;
  const navigate = useNavigate();

  const onClickOnCard = () => {
    navigate(`/pets/${pet.PetID}`);
  }

  return (
    <div onClick={onClickOnCard}>
      <img src={pet.Picture} />
      <h3>{pet.Name}</h3>
      <p>{pet.Sex}, {pet.Age} yrs</p>
      <p>{pet.ShelterName}</p>
    </div>
  );
}
