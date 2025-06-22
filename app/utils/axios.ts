// utils/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8002',
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;
