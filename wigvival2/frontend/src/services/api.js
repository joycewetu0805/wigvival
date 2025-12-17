import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor réponse (centralise success / errors)
api.interceptors.response.use(
  (response) => {
    // On retourne directement data pour éviter response.data.data partout
    return response.data;
  },
  (error) => {
    console.error(
      '❌ API error:',
      error?.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;