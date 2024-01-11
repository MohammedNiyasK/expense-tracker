import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const thunkHandler = async (asynFn: any, thunkApi: any) => {
  try {
    const response = await asynFn;
    return response.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.response.data.message);
  }
};
