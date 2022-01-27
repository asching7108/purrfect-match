import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function PrivateRoute({ children }) {
  return AuthService.isLoggedIn()
    ? children
    : <Navigate to={'/login'} />;
}
