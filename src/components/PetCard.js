import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { renderFavoriteIcon } from './Utils/Utils';
const { HOSTNAME } = require('../config/hostname.config');

export default function PetCard(props) {
  const { pet, page, favorites } = props;
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
    <div className='border rounded m-1 p-2' onClick={onClickCard}>
      <img className="img-fluid rounded" src={HOSTNAME + pet.Picture} width="100%"/>
      <h3>
        {pet.Name}
        <span> </span>
        {renderFavoriteIcon(pet.PetID, favorites)}
      </h3>
      <h6>{pet.TypeOfAnimal}, {pet.Breed}</h6>
      <p>{pet.Sex}, {pet.Age} yrs</p>
      {page === 'shelter' ? '' : renderShelter()}
    </div>
  );
}
