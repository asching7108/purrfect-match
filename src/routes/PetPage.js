import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup, isShelterAdmin, PrimaryButton, renderFavoriteIcon, SecondaryButton, Section, TextArea } from '../components/Utils/Utils';
import PetsService from '../services/petsService';
import { Link } from 'react-router-dom';
const { HOSTNAME } = require('../config/hostname.config');

export default function PetPage () {
  const navigate = useNavigate();
  const params = useParams();
  const [pet, setPet] = useState(null);
  const [petNews, setPetNews] = useState(null);
  const [creatingNews, setCreatingNews] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pet) {
      PetsService.getPet(params.petID)
        .then(pet => setPet(pet))
        .catch(e => {
          setError(e.error);
        });
    }
    if (!petNews) {
      PetsService.getPetNews(params.petID)
        .then(petNews => setPetNews(petNews))
        .catch(e => {
          setError(e.error);
        });
    }
  });

  const onClickDelete = () => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      PetsService.deletePet(pet.PetID)
        .then(() => {
          navigate(`/shelters/${pet.ShelterID}`);
        })
        .catch(res => {
          window.alert(res.error);
        });
    }
  };

  const toggleCreatingNewsState = () => {
    setCreatingNews(!creatingNews);
  };

  const onClickDeleteNewsItem = newsItemID => {
    if (window.confirm('Are you sure you want to delete this news update?')) {
      PetsService.deletePetNews(pet.PetID, newsItemID)
        .then(() => {
          window.location.reload(false);
        })
        .catch(res => {
          window.alert(res.error);
        });
    }
  };

  const handleSubmitNewUpdate = e => {
    e.preventDefault();
    PetsService.postPetNews(pet.PetID, newUpdate)
      .then(res => {
        window.location.reload(false);
      })
      .catch(e => {
        setError(e.error);
      });
  };

  const renderPetBio = () => {
    return (
      <div className='col-md m-1'>
        <div className='d-flex justify-content-between align-items-center flex-wrap'>
          <div>
            <h2>
              Hi, I'm {pet.Name}!
              <span> </span>
              {renderFavoriteIcon(pet.PetID)}
            </h2>
          </div>
          {isShelterAdmin(pet.ShelterID) &&
            <div>
              <Link className='btn p-2 text-primary' to={`/shelters/${pet.ShelterID}/pets/${pet.PetID}/edit`}>
                <FontAwesomeIcon icon='edit' />
              </Link>
              <span role='button' className='btn p-2 text-primary' onClick={onClickDelete}>
                <FontAwesomeIcon icon='trash-alt' />
              </span>
            </div>
          }
        </div>
        <h6>{pet.TypeOfAnimal}, {pet.Breed}</h6>
        <table className='table table-sm table-borderless'>
          <tbody>
            <tr>
              <td scope='row'>Sex:</td>
              <td>{pet.Sex}</td>
            </tr>
            <tr>
              <td scope='row'>Age:</td>
              <td>{pet.Age} {pet.Age === 1 ? 'year' : 'years'} old</td>
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
    return (
      <div className='col-md m-1 border rounded'>
        <img className="img-fluid" src={HOSTNAME + pet.Picture} alt={pet.Name} width="500" height="600"></img>
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

  const renderNewUpdateSection = () => {
    if (!creatingNews) {
      return (
        <div className='row justify-content-center'>
          <button className='btn btn-primary mb-2' onClick={toggleCreatingNewsState}>
            New Update
          </button>
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmitNewUpdate}>
        <FormGroup className='row'>
          <TextArea
            placeholder='Enter here'
            value={newUpdate}
            onChange={e => setNewUpdate(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup className='d-flex justify-content-center'>
          <div className='mx-1'>
            <SecondaryButton type='button' onClick={toggleCreatingNewsState}>
              Cancel
            </SecondaryButton>
          </div>
          <div className='mx-1'>
            <PrimaryButton type='submit'>Submit</PrimaryButton>
          </div>
        </FormGroup>
      </form>
    );
  };

  const renderNewsUpdateItems = () => {
    if (petNews.length === 0) {
      return (
        <div className='row alert alert-success text-center' role='alert'>
          News coming soon!
        </div>
      );
    }
    return (
      <div>
        {petNews.map(news =>
          <div key={news.NewsItemID} className='row border rounded my-1'>
            <div className='col'>
              <p>{news.NewsItem}</p>
              <span className='d-block text-right small'>
                {new Date(news.DatePosted).toLocaleString()}
                {isShelterAdmin(pet.ShelterID) &&
                  <span
                    role='button'
                    className='btn p-2 text-primary'
                    onClick={e => onClickDeleteNewsItem(news.NewsItemID)}>
                    <FontAwesomeIcon icon='trash-alt' />
                  </span>
                }
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNewsUpdates = () => {
    return (
      <>
        <h2 className='text-center'>News Updates</h2>
        {isShelterAdmin(pet.ShelterID) && renderNewUpdateSection()}
        {petNews && renderNewsUpdateItems()}
      </>
    );
  };

  if (error) {
    return <div className='alert alert-danger' role='alert'>{error}</div>;
  }

  // initial state
  if (!pet) {
    return <></>;
  }

  return (
    <Section>
      <div className='row'>
        {renderPetBio()}
        {renderPetPic()}
      </div>
      <div className='row'>
        {renderPetDescription()}
        {renderShelterInfo()}
      </div>
      {renderNewsUpdates()}
    </Section>
  );
}
