const { HOSTNAME } = require('../config/hostname.config');

const SheltersService = {
  getShelter(shelterID) {
    return fetch(`${HOSTNAME}/shelters/${shelterID}`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },
  getPetsByShelter(shelterID) {
    return fetch(`${HOSTNAME}/shelters/${shelterID}/pets`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  }
};

export default SheltersService;
