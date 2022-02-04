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
};

export default PetsService;
