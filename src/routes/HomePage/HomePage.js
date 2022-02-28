import React, { useEffect, useState } from 'react';
import { Section } from '../../components/Utils/Utils';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faStar, faPaw } from "@fortawesome/free-solid-svg-icons";
import PetsService from '../../services/petsService';
import PetCard from '../../components/PetCard';
import { useNavigate } from 'react-router';
import * as logUtils from '../../components/Utils/Logger';
const log = logUtils.getLogger();

export default function HomePage() {

  const [pets, setPets] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pets) {
      PetsService.getPets({ "limit": 3 })
        .then(pets => setPets(pets))
        .catch(e => {
          log.debug(e.error);
        });
    }
  });

  const renderImage = () => {
    return (
      <div className='homeImageContainer'>
        <img src={process.env.PUBLIC_URL + '/homeimage.JPG'}
          alt="HomeImage" width="100%" object-fit="cover" object-position="50% 50%"></img>
        <div id="message" className="font-weight-bold text-white">
          FIND YOUR PURRFECT PET<br />
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="container text-center m-3">
        <div className="row d-flex p-2">

          <div className="col-sm border rounded m-1 p-2">
            <FontAwesomeIcon icon={faPaw} className="fa-4x text-info" />
            <h3>Our Vision</h3>
            <p>Intently sniff hand sleep on my human's head. Lick face hiss at owner, pee a lot, and meow repeatedly scratch at fence purrrrrr eat muffins and poutine until owner comes back chase little red dot someday it will be mine!</p>
          </div>
          <div className="col-sm border rounded m-1 p-2">
            <FontAwesomeIcon icon={faStar} className="fa-4x text-info" />
            <h3>Easy to Use</h3>
            <p>Blep bork floofs shoob shoober, long bois most angery pupper I have ever seen maximum borkdrive blop, he made many woofs shoob many pats.</p>
          </div>
          <div className="col-sm border rounded m-1 p-2">
            <FontAwesomeIcon icon={faCat} className="fa-4x text-info" />
            <h3>Favorites</h3>
            <p>Nap all day cat dog hate mouse eat string barf pillow no baths hate everything but kitty poochy. Sleep on keyboard toy mouse squeak roll over. Mesmerizing birds. Poop on grasses licks paws destroy couch intently sniff hand.</p>

          </div>
        </div>
      </div>
    );
  }

  const renderFeaturedPets = () => {
    if (pets) {
      return (
        <div className="container text-center m-3">
          <h1 className="title text-info font-weight-bold">MEET OUR NEW PETS!</h1>
          <Section className="row">
            <div key="pet1" className='col-sm-4'>
              <PetCard pet={pets[0]} />
            </div>
            <div key="pet2" className='col-sm-4'>
              <PetCard pet={pets[1]} />
            </div>
            <div key="pet3" className='col-sm-4'>
              <PetCard pet={pets[2]} />
            </div>
          </Section>
          <a class="btn btn-outline-info" href="/pets">Looking for different match? Click here!</a>
        </div>
      );
    }

  }

  return (
    <Section>
      <div className='row'>
        {renderImage()}
      </div>
      <div className='row'>
        {renderOverview()}
      </div>
      <div className='row'>
        {renderFeaturedPets()}
      </div>
    </Section>
  );
}
