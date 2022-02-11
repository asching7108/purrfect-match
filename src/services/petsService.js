const { HOSTNAME } = require('../config/hostname.config');

const PetsService = {
  getPets() {
    return fetch(`${HOSTNAME}/pets`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },
  postPet(newPet) {
    return fetch(`${HOSTNAME}/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ ...newPet })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },
  getPet(petID) {
    return fetch(`${HOSTNAME}/pets/${petID}`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },
};

export default PetsService;
