import React, { Component } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from '../Header/Header';
import PrivateRoute from '../Utils/PrivateRoute';
import PrivateRouteShelter from '../Utils/PrivateRouteShelter';
import PublicRoute from '../Utils/PublicRoute';
import AuthContext from '../../context/AuthContext';
import AddPetPage from '../../routes/AddPetPage/AddPetPage';
import FavoritesPage from '../../routes/FavoritesPage/FavoritesPage';
import HomePage from '../../routes/HomePage/HomePage';
import LoginPage from '../../routes/LoginPage/LoginPage';
import PetPage from '../../routes/PetPage/PetPage';
import PetsPage from '../../routes/PetsPage/PetsPage';
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
      <div className='App'>
        <header>
          <Header />
        </header>
        <main>
          <Routes>
            <Route path={'/'} element={<HomePage />} />
            <Route path={'/pets'} element={<PetsPage />} />
            <Route path={'/pets/:petID'} element={<PetPage />} />
            <Route path={'/shelters/:shelterID/pets/create'} element={<AddPetPage />} />
            {/* temporary set to public page
            <Route
              path="/pets/create"
              element={
                <PrivateRouteShelter>
                  <AddPetPage />
                </PrivateRouteShelter>
              }
            /> */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path='/favorites'
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
