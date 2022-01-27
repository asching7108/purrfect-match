import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function PublicRoute({ children }) {
  return AuthService.isLoggedIn()
    ? <Navigate to={'/'} />
    : children;
}
