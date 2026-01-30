import React from 'react'
import Login from '../pages/Login/Login';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { config } from '../api/config';

export default function ProtectedRoute() {
  const location = useLocation()
  const userData = localStorage.getItem(config.localStorageUserData) ? localStorage.getItem(config.localStorageUserData) : null;

  if (!userData) {
    return <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  }

  return (
    <Outlet />
  )
}
