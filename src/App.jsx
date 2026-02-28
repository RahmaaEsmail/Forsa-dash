import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';
import { useQuery } from '@tanstack/react-query';
import userProfileOptions from './hooks/auth/userProfileOptions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { handleRefreshToekn } from './services/auth';
import refreshTokenOptions from './hooks/auth/refreshTokenOptions';
import Cookies from 'js-cookie';
import { config } from './api/config';

export default function App() {
  const navigate = useNavigate();
  // Fetch refresh token data
  const {error: refreshTokenError } = useQuery(refreshTokenOptions());

  // Fetch user data using the `useQuery` hook
  const {
    data: userData,
    isError: userDataError,
    error: userDataErrorObj,
  } = useQuery(userProfileOptions());

  useEffect(() => {
    console.log("userData", userData);
    console.log("userDataError", userDataError);
    console.log("userDataErrorObj", userDataErrorObj);
  } ,[userDataErrorObj , userDataError , userData])

  useEffect(() => {
    console.log("userData",userData);
    if (userData && userDataError) {
      if (userDataError?.status == 401) {
        handleRefreshToekn()
          .then((res) => {
						if(res?.data?.success) {
							// navigate("/")
						}
          })
          .catch((err) => {
            toast.error('Session expired, please log in again');
            localStorage.removeItem(config.localStorageTokenName);
            localStorage.removeItem(config.localStorageUserData);
            window.location.href = '/login';
          });
      } else {
        toast.error(userData?.error?.message);
        localStorage.removeItem(config.localStorageTokenName);
        localStorage.removeItem(config.localStorageUserData);
        window.location.href = '/login';
      }
    }
  }, [userData, userDataError, userDataErrorObj]);

  useEffect(() => {
    if (refreshTokenError) {
			if(refreshTokenError?.status == 401){
				toast.error("Must be login First!");
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
