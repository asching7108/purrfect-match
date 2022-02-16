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
  },
  async createShelter(newShelter) {
    const res = await fetch(`${HOSTNAME}/shelters`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newShelter)
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  }
};

export default SheltersService;
