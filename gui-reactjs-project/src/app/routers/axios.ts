
import axios from 'axios';
import Cookies from "universal-cookie/es6";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const userId = cookies.get('userId');
    const userName = cookies.get('userName');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    if (userId) {
      config.headers['X-User-Id'] = userId;
    }

    if (userName) {
      config.headers['X-User-Name'] = userName;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;