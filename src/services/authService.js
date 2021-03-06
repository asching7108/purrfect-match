const { isExpired, decodeToken } = require('react-jwt');
const { HOSTNAME } = require('../config/hostname.config');

const AuthService = {
  getToken() {
    const tokenString = localStorage.getItem('token');

    if (tokenString === 'undefined') {
      return null;
    }

    const userToken = tokenString ? JSON.parse(tokenString) : null;
    if (userToken && userToken.token) {
      return userToken.token;
    }
  },

  setToken(userToken) {
    localStorage.setItem('token', JSON.stringify(userToken));
  },

  isLoggedIn() {
    const token = AuthService.getToken();
    if (!token) {
      return false;
    }
    // check JWT expiration
    const tokenIsExpired = isExpired(token);
    if (tokenIsExpired) {
      return false;
    }
    return true;
  },

  isShelterAdmin() {
    const token = AuthService.getToken();
    if (!token) {
      return false;
    }
    // check JWT expiration
    const tokenIsExpired = isExpired(token);
    if (tokenIsExpired) {
      return false;
    }
    // check JWT content
    const tokenContent = decodeToken(token);
    if (!tokenContent.hasOwnProperty('shelterID')) {
      return false
    }
    return true;
  },

  getUserIDFromToken() {
    if (!AuthService.isLoggedIn()) return null;
    const token = AuthService.getToken();
    const tokenContent = decodeToken(token);
    return tokenContent.userID;
  },

  getShelterIDFromToken() {
    if (!AuthService.isShelterAdmin()) return null;
    const token = AuthService.getToken();
    const tokenContent = decodeToken(token);
    return tokenContent.shelterID;
  },

  async loginUser(credentials) {
    return fetch(HOSTNAME + '/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then((data) => data.json());
  },
  
  async loginShelter(credentials) {
    return fetch(HOSTNAME + '/shelters/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then((data) => data.json())
  }
};

export default AuthService;
