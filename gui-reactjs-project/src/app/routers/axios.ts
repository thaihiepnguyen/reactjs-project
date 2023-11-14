
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


axiosInstance.interceptors.response.use((response) => {
  const cookies = new Cookies();
  const token = cookies.set('token', 123123);
  console.log(response);
  return response;
}, (error) => {
  if(error?.response?.status === 401 || error?.response?.status  === 403 ){
    //refresh token
  }
  return Promise.reject(error);
})
 
export default axiosInstance;