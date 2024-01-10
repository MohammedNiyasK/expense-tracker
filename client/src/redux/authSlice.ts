import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from './store'
import axios from 'axios';

interface InitialState {
  userData: any;
  refreshToken: string | null;
  accessToken: string | null;
  signInError: string | null;
  signUpError: string | null;
  successMessage: string | null;
  loading: boolean;
}

const initialState: InitialState = {
  loading: false,
  refreshToken: '',
  accessToken: '',
  signInError: '',
  signUpError: '',
  successMessage: '',
  userData: '',
};

export const signUpUser = createAsyncThunk(
  'user/signUpUser',
  async (credentials) => {
    const response = await axios.post('/api/user/signUp', credentials);

    console.log(response.data);

    return response.data;
  }
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
      state.userData = action.payload;
      state.signUpError = '';
    });

    builder.addCase(signUpUser.rejected, (state, action) => {
      state.loading = false;
      state.userData = '';
      state.signUpError = 'something went wrong';
    });
  },
});

export default authSlice.reducer;
