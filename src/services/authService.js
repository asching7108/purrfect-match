const { isExpired } = require('react-jwt');

const AuthService = {
	getToken() {
		const tokenString = sessionStorage.getItem('token');
		const userToken = JSON.parse(tokenString);
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
		return fetch('http://localhost:8000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		}).then((data) => data.json());
	}
};

export default AuthService;
