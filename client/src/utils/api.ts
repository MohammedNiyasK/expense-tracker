import axios from 'axios';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useSearchParams } from 'react-router-dom';

interface User {
  username: string;
  email: string;
  password: string;
}
interface SignIn {
  email: string;
  password: string;
}

interface Expense {
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface UpdateExpenseVariable {
  updatedExpense: Expense;
  id: string;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

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

/*
 *Handle if refresh token is rejected
 */
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
  return data;
}
async function getSummary() {
  const { data } = await API.get('/api/expense/summary');
  return data;
}
async function getAllExpense() {
  const { data } = await API.get('/api/expense/all');
  return data;
}

async function getReport() {
  const { data } = await API.get('/api/expense/report?year=2024&month=1');
  console.log(data);
  return data;
}

const logout = async () => {
  try {
    const { data } = await API.post('/api/user/logout');
    return data;
  } catch (error) {
    console.log(error);
  }
};

const addExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: Expense) => {
      const { data } = await API.post('/api/expense/create', expense);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
const editExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updatedExpense }: UpdateExpenseVariable) => {
      const { data } = await API.put(`/api/expense/${id}`, updatedExpense);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

const deleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await API.delete(`/api/expense/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

const useFetchExpenseWithParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const category = searchParams.get('category');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  const { isLoading, isError, error, data } = useQuery({
    queryKey: [
      'all_expenses',
      search,
      startDate,
      endDate,
      category,
      page,
      limit,
    ],
    queryFn: async () => {
      const { data } = await API.get(
        `/api/expense/all?${category ? `&category=${category}` : ''}${
          startDate ? `&startDate=${startDate}` : ''
        }${endDate ? `&endDate=${endDate}` : ''}${
          search ? `&search=${search}` : ''
        }${page ? `&page=${page}` : ''}${limit ? `&limit=${limit || 5}` : ''}`
      );
      return data;
    },
  });

  return { isLoading, isError, error, data, setSearchParams, searchParams };
};

const useFetchReportWithParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = searchParams.get('year');
  const month = searchParams.get('month');

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['report', year, month],
    queryFn: async () => {
      const { data } = await API.get(
        `/api/expense/report?year=${year}${month ? `&month=${month}` : ''}`
      );

      return data;
    },
  });

  return { isLoading, data, isError, error, searchParams, setSearchParams };
};

export {
  signUp,
  signIn,
  refreshTokenAction,
  recent,
  getSummary,
  getAllExpense,
  getReport,
  logout,
  addExpense,
  deleteExpense,
  editExpense,
  useFetchExpenseWithParams,
  useFetchReportWithParams,
};
