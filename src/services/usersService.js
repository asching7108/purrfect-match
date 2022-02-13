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
  }
};

export default UsersService;
