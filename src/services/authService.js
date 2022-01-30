const AuthService = {
  getToken() {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
  },
  isLoggedIn() {
    const token = AuthService.getToken();

    // TODO: make sure token is legit / verify with DB

    return token? true : false
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
    })
        .then(data => data.json())
  }
};

export default AuthService;
