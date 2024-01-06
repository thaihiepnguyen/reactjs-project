
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';

const axiosInstance = axios.create({
  baseURL: `${process.env.API_URL}`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {

    let tokenStr =  getCookie('token')?.toString();
    let token = null;
    
    if (tokenStr) {
      token = JSON.parse(tokenStr);
    }
    const userId = getCookie('userId');
    const userName = getCookie('userName');
    const role = getCookie('role');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    if (userId) {
      config.headers['X-User-Id'] = userId;
    }

    if (userName) {
      config.headers['X-User-Name'] = encodeURI(userName);
    }
    if (role) {
      config.headers['X-Role'] = role;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if(response?.data?.data?.token) {
      setCookie('token', JSON.stringify(response.data.data.token))
      setCookie('userId', response.data.data.user.id)
      setCookie('userName', response.data.data.user.fullname)
      setCookie('role', response.data.data.user.role)
    }
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      if (getCookie('token')) {
        deleteCookie('token');
        deleteCookie('userId');
        deleteCookie('userName');
        deleteCookie('role');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;