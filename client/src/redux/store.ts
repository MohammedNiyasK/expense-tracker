import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { SETUSER_PROFILE } from './authSlice';
import { isValidToken } from '@/utils/authUtils';

import { refreshTokenAction } from '@/utils/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const profile = localStorage.getItem('profile');

if (profile) {
  const parsedProfile = JSON.parse(profile);

  const accessToken = parsedProfile.accessToken;
  const refreshToken = parsedProfile.refreshToken;

  if (accessToken && refreshToken) {
    if (isValidToken(accessToken)) {
      store.dispatch(SETUSER_PROFILE(parsedProfile));
    } else {
      store.dispatch(refreshTokenAction(refreshToken));
    }
  }
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
