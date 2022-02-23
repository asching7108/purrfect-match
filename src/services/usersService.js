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
  }
};

export default UsersService;
