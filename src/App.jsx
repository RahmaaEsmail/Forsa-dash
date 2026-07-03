import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import userProfileOptions from './hooks/auth/userProfileOptions';
import { toast } from 'sonner';
import { handleRefreshToken } from './services/auth';
import { config } from './api/config';
import { useLocation } from 'react-router-dom';
import { QUERY_KEYS } from './constants';

export default function App() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem(config.localStorageTokenName);

  const {
    data: userData,
  } = useQuery({
    ...userProfileOptions(),
    enabled: hasToken,
  });

  // Periodically refresh the token every 5 minutes when logged in
  useEffect(() => {
    if (!hasToken) return;

    const interval = setInterval(() => {
      handleRefreshToken()
        .then(() => {
          // Profile data could be updated or query invalidated if needed
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user_profile_key });
        })
        .catch((err) => {
          const status = err?.response?.status || err?.status;
          if (status === 401) {
            toast.error('Session expired, please log in again');
            localStorage.removeItem(config.localStorageTokenName);
            localStorage.removeItem(config.localStorageUserData);
            window.location.href = '/login';
          }
        });
    }, 1000 * 60 * 5); // 5 minutes

    return () => clearInterval(interval);
  }, [hasToken, queryClient]);

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-center" />
    </div>
  );
}
