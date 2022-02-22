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
    
    // TODO: delete all preferences for user before saving new ones

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
        ? res.json().then(e => Promise.reject(e))
        : res.json());
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
  }
};

export default UsersService;
