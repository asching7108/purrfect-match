import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth-service';

export default function PrivateRoute({ children }) {
  return AuthService.isLoggedIn()
    ? children
    : <Navigate to={'/login'} />;
}