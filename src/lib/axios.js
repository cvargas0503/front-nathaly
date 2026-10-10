import { API_URL } from './apiConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

export default api;
