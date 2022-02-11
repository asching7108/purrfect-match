import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Section } from '../../components/Utils/Utils';
import PetsService from '../../services/petsService';
import { Link } from 'react-router-dom';

export default function PetPage () {
  const navigate = useNavigate();
  const params = useParams();
  const [pet, setPet] = useState({});

  useEffect(() => {
    async function getPet() {
      const pet = await PetsService.getPet(params.petID);
      setPet(pet);
    }
    if (Object.keys(pet).length === 0) {
      getPet();
    }
  });

  const renderFavoriteIcon = () => {
    // TODO
    if (true) {
      return <span className='text-danger'><FontAwesomeIcon icon='heart' /></span>;
    }
    return <span className='text-danger'><FontAwesomeIcon icon={['far', 'heart']} /></span>;
  }

  const renderPetBio = () => {
    return (
      <div className='col-md m-1'>
        <h2>
          Hi, I'm {pet.Name}!
          <span> </span>
          {renderFavoriteIcon()}
          </h2>
        <table className='table table-sm table-borderless'>
          <tbody>
            <tr>
              <td scope='row'>Breed:</td>
              <td>{pet.Breed}</td>
            </tr>
            <tr>
              <td scope='row'>Sex:</td>
              <td>{pet.Sex}</td>
            </tr>
            <tr>
              <td scope='row'>Age:</td>
              <td>{pet.Age} yrs</td>
            </tr>
            <tr>
              <td scope='row'>Size:</td>
              <td>{pet.Size}</td>
            </tr>
            <tr>
              <td scope='row'>I am:</td>
              <td style={{whiteSpace: 'pre-wrap'}}>
              {pet.GoodWithOtherAnimals ? 'Good With Other Animals' : 'Not Good With Other Animals'}
              {pet.GoodWithChildren ? '\nGood With Children' : '\nNot Good With Children'}
              {pet.MustBeLeashed ? '\nMust Be Leashed' : '\nLeash Not Required'}
              {pet.Neutered ? '\nNeutered' : '\nNot Yet Neutered'}
              {pet.Vaccinated ? '\nVaccinated' : '\nNot Yet Vaccinated'}
              {pet.HouseTrained ? '\nHouse Trained' : '\nNot Yet House Trained'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderPetPic = () => {
    // TODO
    return (
      <div className='col-md m-1 border rounded'>

      </div>
    );
  };

  const renderShelterInfo = () => {
    return (
      <div className='col-md m-1 border border-primary rounded'>
        <h4><small>Shelter Info</small></h4>
        <h3><Link to={`/shelters/${pet.ShelterID}`}>{pet.ShelterName}</Link></h3>
        <p>
          <FontAwesomeIcon icon='globe' />
          <span> </span>
          <a href={pet.Website} target="_blank">{pet.Website}</a>
        </p>
        <p>
          <FontAwesomeIcon icon='phone' />
          <span> </span>
          <a href={'tel:' + pet.PhoneNumber}>{pet.PhoneNumber}</a>
        </p>
        <p>
          <FontAwesomeIcon icon='envelope' />
          <span> </span>
          <a href={'mailto:' + pet.EmailAddress}>{pet.EmailAddress}</a>
        </p>
        <p>
          <FontAwesomeIcon icon='location-arrow' />
          <span> </span>
          {pet.Address}
        </p>
      </div>
    );
  };

  const renderPetDescription = () => {
    return (
      <div className='col-md m-1 border border-primary rounded'>
        <h3>About Me</h3>
        <p>{pet.Description}</p>
      </div>
    );
  };

  const renderNewsUpdates = () => {
    // TODO
    return (
      <div>
        <h2 className='m-10 text-center'>News Updates</h2>
      </div>
    );
  };

  return (
    <Section>
      <div className='row'>
        {renderPetBio()}
        {renderPetPic()}
      </div>
      <div className='row'>
        {renderShelterInfo()}
        {renderPetDescription()}
      </div>
      {renderNewsUpdates()}
    </Section>
  );
}
