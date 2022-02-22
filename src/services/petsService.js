import AuthService from './authService';
const { HOSTNAME } = require('../config/hostname.config');

const PetsService = {
  getPets(filters) {
    const query = [];
    for (const [key, value] of Object.entries(filters)) {
      if (Array.isArray(value)) {
        query.push(`${key}=${value.join(',')}`);
      } else {
        query.push(`${key}=${value}`);
      }
    }
    return fetch(`${HOSTNAME}/pets?${query.join('&').replace(' ', '%20')}`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },

  postPet(pet) {
    return fetch(`${HOSTNAME}/pets`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      },
      body: JSON.stringify({ ...pet })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },

  patchPet(petID, pet) {
    return fetch(`${HOSTNAME}/pets/${petID}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      },
      body: JSON.stringify({ ...pet })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(e => Promise.reject(e));
        }
      });
  },

  deletePet(petID) {
    return fetch(`${HOSTNAME}/pets/${petID}`, {
      method: 'DELETE',
      headers: { 'authorization': AuthService.getToken() }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(e => Promise.reject(e));
        }
      });
  },

  postImage(profileImg) {
    const formData = new FormData()
    formData.append('petimage', profileImg)
    return fetch(`${HOSTNAME}/pets/imgupload`, {
      method: 'POST',
      headers: {
        'enctype': 'multipart/form-data',
        'authorization': AuthService.getToken()
      },
      body: formData
    }).then(res =>
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json()
    );
  },

  postPetNews(petID, newsItem) {
    return fetch(`${HOSTNAME}/pets/${petID}/news`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      },
      body: JSON.stringify({ newsItem })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },

  deletePetNews(petID, newsItemID) {
    return fetch(`${HOSTNAME}/pets/${petID}/news/${newsItemID}`, {
      method: 'DELETE',
      headers: { 'authorization': AuthService.getToken() }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(e => Promise.reject(e));
        }
      });
  },

  getPet(petID) {
    return fetch(`${HOSTNAME}/pets/${petID}`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  },

  getPetNews(petID) {
    return fetch(`${HOSTNAME}/pets/${petID}/news`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
        );
  },

  getBreeds() {
    return fetch(`${HOSTNAME}/breeds`)
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      );
  }
};

export default PetsService;
