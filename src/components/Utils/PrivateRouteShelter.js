import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function PrivateRouteShelter({ children }) {
  return AuthService.isLoggedIn() && AuthService.isShelterAdmin()
    ? children
    : <Navigate to={'/login/shelter?redirect=' + window.location.pathname} />;
}
