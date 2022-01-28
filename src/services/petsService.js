import config from '../config';

const PetsService = {
  getPets() {
    return fetch(`${config.API_BASE_URL}/pets`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  }
};

export default PetsService;
