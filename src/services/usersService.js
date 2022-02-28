import AuthService from './authService';

const { HOSTNAME } = require('../config/hostname.config');

const UsersService = {
  async createUser(newUser) {
    const res = await fetch(`${HOSTNAME}/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  },
  async saveUserPreferences(userID, method, changedPreferences) {
    const res = await fetch(`${HOSTNAME}/users/${userID}/prefs`, {
      method: method,
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      },
      body: JSON.stringify(changedPreferences)
    });
    return await (
      (!res.ok)
        ? res.text().then(e => Promise.reject(e))
        : res.text());
  },
  async getUser(userID) {
    const res = await fetch(`${HOSTNAME}/users/${userID}`, {
      method: 'GET'
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  },
  async updateUser(userID, userUpdates) {
    const res = await fetch(`${HOSTNAME}/users/${userID}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      },
      body: JSON.stringify(userUpdates)
    });
    return await (
      (!res.ok)
        ? res.then(e => Promise.reject(e))
        : res);
  },
  async getSavedPreferences(userID) {
    const res = await fetch(`${HOSTNAME}/users/${userID}/prefs`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': AuthService.getToken()
      }
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  },
  async addUserFavorite(userID, petID) {
    const res = await fetch(`${HOSTNAME}/users/${userID}/favorites/${petID}`, {
      method: 'PUT',
      headers: {
        'authorization': AuthService.getToken()
      }
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  },
  async getUserFavorites(userID) {
    const res = await fetch(`${HOSTNAME}/users/${userID}/favorites`, {
      method: 'GET'
    });
    return await (
      (!res.ok)
        ? res.json().then(e => Promise.reject(e))
        : res.json());
  },
  async removeUserFavorite(userID, petID) {
    const res = await fetch(`${HOSTNAME}/users/${userID}/favorites/${petID}`, {
      method: 'DELETE',
      headers: {
        'authorization': AuthService.getToken()
      }
    });
    return await (
      (!res.ok)
        ? res.text().then(e => Promise.reject(e))
        : res.text());
  },
};

export default UsersService;
