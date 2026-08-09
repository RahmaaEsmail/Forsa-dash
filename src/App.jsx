import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import userProfileOptions from './hooks/auth/userProfileOptions';
import { config } from './api/config';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const hasToken = !!localStorage.getItem(config.localStorageTokenName);

  // userProfileOptions already has refetchInterval: 5 min built-in.
  // No separate setInterval is needed — having both caused a token-rotation
  // race condition that triggered spurious 401 logouts.
  useQuery({
    ...userProfileOptions(),
    enabled: hasToken,
  });

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-center" />
    </div>
  );
}
