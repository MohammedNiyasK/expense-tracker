import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { refreshTokenAction } from '@/utils/api';

interface InitialState {
  user: User | {};
  refreshToken: string | undefined;
  accessToken: string | undefined;
  signInError: string | undefined;
  signUpError: string | undefined;
  successMessage: string | undefined;
  isLoading: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

interface Payload {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

const initialState: InitialState = {
  user: {},
  refreshToken: '',
  accessToken: '',
  signInError: '',
  signUpError: '',
  successMessage: '',
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SIGNUP_SUCCESS: (state, action: PayloadAction<string>) => {
      state.signInError = '';
      state.signUpError = '';
      state.successMessage = action.payload;
    },
    SIGNUP_FAIL: (state, action: PayloadAction<string>) => {
      state.successMessage = '';
      state.signInError = '';
      state.signUpError = action.payload;
    },
    CLEAR_MESSAGE: (state) => {
      state.successMessage = '';
      state.signInError = '';
      state.signUpError = '';
    },
    SIGNIN_SUCCESS: (state, action: PayloadAction<Payload>) => {
      state.user = action.payload.data.user;
      state.refreshToken = action.payload.data.refreshToken;
      state.accessToken = action.payload.data.accessToken;
      state.signInError = '';
      state.signUpError = '';
      state.successMessage = action.payload.message;
    },

    SIGNIN_FAIL: (state, action: PayloadAction<string>) => {
      state.user = {};
      state.refreshToken = '';
      state.accessToken = '';
      state.signInError = action.payload;
      state.signUpError = '';
      state.successMessage = '';
    },
    SETUSER_PROFILE: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    REFRESH_TOKEN_SUCCESS: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    REFRESH_TOKEN_FAIL: (state) => {
      state.user = {};
      state.accessToken = '';
      state.refreshToken = '';
      state.signInError = '';
      state.signUpError = '';
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokenAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.refreshToken = action.payload.data.refreshToken;
        state.accessToken = action.payload.data.accessToken;
      })
      .addCase(refreshTokenAction.rejected, (state) => {
        state.user = {};
        state.accessToken = '';
        state.refreshToken = '';
        state.signInError = '';
        state.signUpError = '';
        state.successMessage = '';
      });
  },
});

export default authSlice.reducer;
export const {
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CLEAR_MESSAGE,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SETUSER_PROFILE,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
} = authSlice.actions;
