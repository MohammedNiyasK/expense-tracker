import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  username: string;
  email: string;
  password: string;
}
interface SignIn {
  email: string;
  password: string;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const API = axios.create();

API.interceptors.request.use(
  (config) => {
    const profile = localStorage.getItem('profile');

    if (profile) {
      const parsedProfile = JSON.parse(profile);

      const accessToken = parsedProfile.accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshTokenAction = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string) => {
    const response = await http.post('/api/user/refresh-token', {
      refreshToken,
    });
    localStorage.setItem('profile', JSON.stringify(response.data));
    return response.data;
  }
);

function signUp() {
  return useMutation({
    mutationFn: async (user: User) => {
      const { data } = await http.post('/api/user/signup', user);
      console.log(data);
      return data;
    },
  });
}

function signIn() {
  return useMutation({
    mutationFn: async (user: SignIn) => {
      const { data } = await http.post('/api/user/signin', user);
      return data;
    },
  });
}

async function recent() {
  const { data } = await API.get('/api/expense/recent');
  console.log(data);
  return data;
}
async function getSummary() {
  const { data } = await API.get('/api/expense/summary');
  return data;
}
async function getAllExpense() {
  const { data } = await API.get('/api/expense/all');
  console.log(data);
  return data;
}

async function getReport() {
  const { data } = await API.get('/api/expense/report?year=2024&month=1');
  console.log(data);
  return data;
}

 const logout = async () => {
  try {
    const { data }  = await API.post("/api/user/logout");
    return data
  } catch (error) {
    console.log(error)
  }
};

export { signUp, signIn, refreshTokenAction, recent,getSummary,getAllExpense,getReport,logout};
