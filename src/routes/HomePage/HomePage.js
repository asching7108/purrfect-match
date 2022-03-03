import React, { useEffect, useState } from 'react';
import { Section } from '../../components/Utils/Utils';
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCat, faStar, faPaw } from "@fortawesome/free-solid-svg-icons";
import PetsService from '../../services/petsService';
import PetCard from '../../components/PetCard';
import * as logUtils from '../../components/Utils/Logger';
import { Link } from 'react-router-dom';

const { HOSTNAME } = require('../../config/hostname.config');
const log = logUtils.getLogger();

export default function HomePage() {

  const [pets, setPets] = useState(null);
  const [petNews, setpetNews] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {

    window.addEventListener("resize", () => {
      const ismobile = window.innerWidth < 1200;
      if (ismobile !== isMobile) setIsMobile(ismobile);
    }, false);

    if (!pets) {
      PetsService.getPets({ "limit": 3 })
        .then(pets => setPets(pets))
        .catch(e => {
          log.debug(e.error);
        });
    }

    if (!petNews) {
      PetsService.getNews(3)
        .then(news => setpetNews(news))
        .catch(e => {
          log.debug(e.error);
        });
    }
  }, [isMobile]);

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
            <p>We want to help people find a pet that is perfect for them! Using a filter system, we allow users to narrow down their search. Our goal is to make the adoption experience easy and fun!</p>
          </div>
          <div className="col-sm border rounded m-1 p-2">
            <FontAwesomeIcon icon={faStar} className="fa-4x text-info" />
            <h3>Easy to Use</h3>
            <p>Click on the "Pets" link in the header to view a list of pets. In the Pets page, you can filter by animal type, breed, sex, age range, and more. If you have an account, you can even save your filters!</p>
          </div>
          <div className="col-sm border rounded m-1 p-2">
            <FontAwesomeIcon icon={faCat} className="fa-4x text-info" />
            <h3>Favorites</h3>
            <p>Click the heart icon next to a pet's name to add it to your favorites list! On the favorites page, you can view your favorite animals all in one place.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderFeaturedPets = () => {
    if (pets) {
      return (
        <div className="container text-center m-3">
          <h1 className="text-info font-weight-bold">MEET OUR NEW PETS!</h1>
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
          <a className="btn btn-outline-info" href="/pets">Looking for different match? Click here!</a>
        </div>
      );
    }
  }

  const renderNewsFeed = () => {

    let cardClass = 'd-flex border rounded m-2 p-2';
    let textClass = 'row col-8';
    let leftClass = 'col-4'

    if (isMobile) {
      cardClass = 'border rounded m-2 p-2';
      textClass = 'row m-2 p-2';
      leftClass = ''
    }

    if (petNews) {
      return (
        <div className="container text-center m-3">
          <h1 className="text-info font-weight-bold">NEWS UPDATE!</h1>
          <div>
            <div>
              {petNews.map(news =>
                <Link key={news.NewsItemID} to={`/pets/${news.PetID}`} className='baseFont'>
                  <div className={cardClass}>
                    <div className={leftClass}>
                      <img className="rounded" src={HOSTNAME + news.Picture} alt={news.Name} style={{ width: "80%", maxWidth: "200px", minWidth: "200px" }} />
                      <h4>{news.Name}</h4>
                      <h6>{news.ShelterName}</h6>
                    </div>
                    <div key={news.NewsItemID} className={textClass} height={"100%"}>
                      <p>{news.NewsItem}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
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
      <div className='row'>
        {renderNewsFeed()}
      </div>
    </Section>
  );
}
