import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

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
      console.log(data);
      return data;
    },
  });
}


export { signUp, signIn };
