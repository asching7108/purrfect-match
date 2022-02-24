import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import AuthContext from '../context/AuthContext';
import AddPetPage from '../routes/AddPetPage';
import EditPetPage from '../routes/EditPetPage';
import FavoritesPage from '../routes/FavoritesPage/FavoritesPage';
import HomePage from '../routes/HomePage/HomePage';
import LoginPage from '../routes/LoginPage/LoginPage';
import PetPage from '../routes/PetPage';
import PetsPage from '../routes/PetsPage';
import SheltersPage from '../routes/SheltersPage/SheltersPage';
import ProfilePage from '../routes/ProfilePage/ProfilePage';
import NotFoundPage from '../routes/NotFoundPage';
import AuthService from '../services/authService';

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
            <Route path={'/shelters/:shelterID'} element={<SheltersPage />} />
            <Route
              path={'/pets/create'}
              element={
                <PrivateRoute shelter={true}>
                  <AddPetPage />
                </PrivateRoute>
              }
            />
            <Route
              path={'/pets/:petID/edit'}
              element={
                <PrivateRoute shelter={true}>
                  <EditPetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login/shelter"
              element={
                <PublicRoute shelter={true}>
                  <LoginPage shelter={true} />
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
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <ProfilePage />
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
