import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { thunkHandler } from '@/utils/api';
import { http } from '@/utils/api';

interface InitialState {
  user: User | {};
  refreshToken: string | undefined;
  accessToken: string | undefined;
  signInError: string | undefined;
  signUpError: string | undefined;
  loading: boolean;
  signUpSuccess: string | undefined;
  signInSuccess: string | undefined;
  success: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: InitialState = {
  loading: false,
  refreshToken: '',
  accessToken: '',
  signInError: '',
  signUpError: '',
  user: {
    _id: '',
    username: '',
    email: '',
    createdAt: '',
    updatedAt: '',
  },
  signUpSuccess: '',
  signInSuccess: '',
  success: false,
};

export const signUpUser = createAsyncThunk(
  'user/signUpUser',
  async (
    user: {
      username: string;
      email: string;
      password: string;
    },
    thunkApi
  ) => await thunkHandler(http.post('/api/user/signUp', user), thunkApi)
);

export const signInUser = createAsyncThunk(
  'user/signInUser',
  async (
    user: {
      email: string;
      password: string;
    },
    thunkApi
  ) => await thunkHandler(http.post('/api/user/signIn', user), thunkApi)
);

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUpUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.data;
      state.signUpSuccess = action.payload?.message;
      state.success = action.payload?.success;
    });

    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false;
      state.user = {};
      state.signUpError = action.payload as string;
      state.signUpSuccess = '';
      state.success = false;
    });

    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.data?.user;
      state.signInSuccess = action.payload?.message;
      state.success = action.payload?.success;
      state.accessToken = action.payload?.data?.accessToken;
      state.refreshToken = action.payload?.data?.refreshToken;
    });

    builder.addCase(signInUser.rejected, (state, action) => {
      state.loading = false;
      state.user = {};
      state.signInError = action.payload as string;
      state.signInSuccess = '';
      state.success = false;
      state.refreshToken = '';
      state.accessToken = '';
    });
  },
});

export default authSlice.reducer;
