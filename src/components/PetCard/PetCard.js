import React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './PetCard.css';

export default function PetCard(props, newClass) {
  const { pet } = props;
  const navigate = useNavigate();

  const onClickCard = () => {
    navigate(`/pets/${pet.PetID}`);
  }

  const onClickShelter = (e) => {
    e.stopPropagation();
  }

  let classStr = props.className === undefined ? "petCard": "petCard " + props.className

  return (
    <div className={classStr} onClick={onClickCard}>
      <img src={pet.Picture} />
      <h3>{pet.Name}</h3>
      <p>{pet.Sex}, {pet.Age} yrs</p>
      <p>
        <Link to={`/shelters/${pet.ShelterID}`} onClick={onClickShelter}>{pet.ShelterName}</Link>
      </p>
    </div>
  );
}
