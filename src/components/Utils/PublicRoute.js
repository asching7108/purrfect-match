import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth-service';

export default function PublicRoute({ children }) {
  return AuthService.hasAuthToken()
    ? <Navigate to={'/'} />
    : children;
}