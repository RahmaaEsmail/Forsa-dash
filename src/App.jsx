import React, { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import userProfileOptions from './hooks/auth/userProfileOptions';
import { toast } from 'sonner';
import refreshTokenOptions from './hooks/auth/refreshTokenOptions';
import { config } from './api/config';
import { QUERY_KEYS } from './constants';

export default function App() {
  const queryClient = useQueryClient();
  const [enableRefresh, setEnableRefresh] = useState(false);

  // Refresh query runs ONLY when the profile returns 401
  const { error: refreshTokenError, isSuccess: refreshSuccess } = useQuery({
    ...refreshTokenOptions(),
    enabled: enableRefresh,
  });

  const {
    data: userData,
    isError: userDataIsError,
    error: userDataErrorObj,
  } = useQuery(userProfileOptions());

  // Profile failed with 401 → trigger refresh
  useEffect(() => {
    if (userDataIsError && userDataErrorObj?.status === 401) {
      setEnableRefresh(true);
    }
  }, [userDataIsError, userDataErrorObj]);

  // Refresh succeeded → refetch profile with new token
  useEffect(() => {
    if (refreshSuccess) {
      setEnableRefresh(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user_profile_key });
    }
  }, [refreshSuccess, queryClient]);

  // Refresh failed with 401 → session truly expired, logout
  useEffect(() => {
    if (refreshTokenError) {
      if (refreshTokenError?.status === 401) {
        toast.error('Session expired, please log in again');
        localStorage.removeItem(config.localStorageTokenName);
        localStorage.removeItem(config.localStorageUserData);
        window.location.href = '/login';
      }
    }
  }, [refreshTokenError]);

  return (
    <div>
      <AppRoutes />
      <Toaster position="top-center" />
    </div>
  );
}
