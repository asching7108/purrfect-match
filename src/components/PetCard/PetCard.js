import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { renderFavoriteIcon } from '../Utils/Utils';
import './PetCard.css';

export default function PetCard(props) {
  const { pet, page, className } = props;
  const navigate = useNavigate();

  const onClickCard = () => {
    navigate(`/pets/${pet.PetID}`);
  }

  const onClickShelter = (e) => {
    e.stopPropagation();
  }

  const renderShelter = () => {
    return (
      <p>
        <Link to={`/shelters/${pet.ShelterID}`} onClick={onClickShelter}>
          <FontAwesomeIcon icon='house-user' />
          <span> </span>
          {pet.ShelterName}
        </Link>
      </p>
    );
  }

  return (
    <div className={className} onClick={onClickCard}>
      <img src={pet.Picture} />
      <h3>
        {pet.Name}
        <span> </span>
        {renderFavoriteIcon(pet.petID)}
      </h3>
      <h6>{pet.TypeOfAnimal}, {pet.Breed}</h6>
      <p>{pet.Sex}, {pet.Age} yrs</p>
      {page === 'shelter' ? '' : renderShelter()}
    </div>
  );
}
