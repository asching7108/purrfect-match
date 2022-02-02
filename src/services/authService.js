const { isExpired } = require('react-jwt');
const { HOSTNAME } = require('../config/hostname.config');

const AuthService = {
	getToken() {
		const tokenString = localStorage.getItem('token');

    if (tokenString === 'undefined') {
      return null;
    }

		const userToken = tokenString? JSON.parse(tokenString) : null;
		if (userToken && userToken.token) {
			return userToken.token;
		}
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
		// TODO
		return false;
	},
	async loginUser(credentials) {
		return fetch( HOSTNAME + '/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		}).then((data) => data.json());
	}
};

export default AuthService;
