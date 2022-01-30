import React, { Component } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from '../Header/Header';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicRoute from '../Utils/PublicRoute';
import AuthContext from '../../context/AuthContext';
import FavoritesPage from '../../routes/FavoritesPage/FavoritesPage';
import HomePage from '../../routes/HomePage/HomePage';
import LoginPage from '../../routes/LoginPage/LoginPage';
import NotFoundPage from '../../routes/NotFoundPage';
import AuthService from '../../services/authService';

class App extends Component {
	static contextType = AuthContext;

	componentDidMount() {
		this.context.setLoggedInState(AuthService.isLoggedIn());
		this.context.setShelterAdminState(AuthService.isShelterAdmin());
	};

  

	render() {
		return (
			<div className="App">
				<header>
					<Header />
				</header>
				<main className="contentWrapper">
					<Routes>
						<Route path={'/'} element={<HomePage />} />
						<Route
							path="/login"
							element={
								<PublicRoute>
									<LoginPage />
								</PublicRoute>
							}
						/>
						<Route
							path="/favorites"
							element={
								<PrivateRoute>
									<FavoritesPage />
								</PrivateRoute>
							}
						/>
						<Route path={'*'} element={<NotFoundPage />} />
					</Routes>
				</main>
			</div>
		);
	}
}

export default App;
