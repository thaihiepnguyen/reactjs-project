
import axios from 'axios';
import Cookies from "universal-cookie/es6";

const axiosInstance = axios.create();

// I attach the token to the header of each request
axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const userId = cookies.get('userId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    if (userId) {
      config.headers['X-User-Id'] = '' + userId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;