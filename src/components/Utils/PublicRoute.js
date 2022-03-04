import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/authService';

const determineRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get('redirect');
  return redirect ? redirect : '/';
}

export default function PublicRoute({ children, shelter }) {
  if (shelter) {
    return (AuthService.isLoggedIn() && AuthService.isShelterAdmin())
      ? <Navigate to={determineRedirect()} />
      : children;
  } else {
    return AuthService.isLoggedIn()
      ? <Navigate to={determineRedirect()} />
      : children;
  }
}
