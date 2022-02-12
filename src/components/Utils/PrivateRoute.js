import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function PrivateRoute({ children, shelter }) {
  if (shelter) {
    return AuthService.isLoggedIn() && AuthService.isShelterAdmin()
    ? children
    : <Navigate to={'/login/shelter?redirect=' + window.location.pathname} />;
  } else {
    return AuthService.isLoggedIn()
    ? children
    : <Navigate to={'/login?redirect=' + window.location.pathname} />;
  }
  
  
}
