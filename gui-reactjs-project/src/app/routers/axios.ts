
import axios from 'axios';
import { getCookies, setCookie, deleteCookie, getCookie } from 'cookies-next';

const axiosInstance = axios.create({
  baseURL: `${process.env.API_URL}`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {

    let tokenStr =  getCookie('token')?.toString();
    let token = {
      accessToken: ""
    };
    if (tokenStr) {
      token = JSON.parse(tokenStr);
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response.data.data)
    if(response?.data?.data?.token) {
      setCookie('token', JSON.stringify(response.data.data.token))
      setCookie('userId', response.data.data.user.id)
      setCookie('userName', response.data.data.user.fullname)
      setCookie('role', response.data.data.user.role)
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;