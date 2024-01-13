import { configureStore } from '@reduxjs/toolkit';
import authReducer, { REFRESH_TOKEN_FAIL } from './authSlice';
import { SETUSER_PROFILE, REFRESH_TOKEN_SUCCESS } from './authSlice';
import { isValidToken } from '@/utils/authUtils';
import { useMutation } from '@tanstack/react-query';
import { http } from '@/utils/api';

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
      const mutation = useMutation({
        mutationFn: async (refreshToken) => {
          const response = await http.post('/api/user/refresh-token', {
            refreshToken,
          });
          return response.data;
        },
      });

      try {
        await mutation.mutateAsync(refreshToken);
        const payload = mutation.data.data;
        const profile = localStorage.getItem('profile');
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          localStorage.setItem(
            'profile',
            JSON.stringify({ ...parsedProfile, ...payload })
          );
          store.dispatch(REFRESH_TOKEN_SUCCESS(payload));
        }
      } catch (error) {
        localStorage.removeItem('profile');
        store.dispatch(REFRESH_TOKEN_FAIL());
      }
    }
  }
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
