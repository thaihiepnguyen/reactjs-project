import { routes } from "@/app/routers/routes";
import { EAPI } from "@/models/general";
import axios from "axios";
import {redirect} from "next/navigation"
import { cookies } from 'next/headers'

const api = axios.create({
  baseURL: `${process.env.API_URL}`,
  withCredentials: true,
});

//User login token
api.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const token = cookieStore.get(EAPI.token);

  return config;
});

api.interceptors.response.use((response) => {
  return response;
 }, (error) => {
  if(error?.response?.status === 401 || error?.response?.status  === 403 ){
    //refresh token
    //Tham khảo tại: https://codestus.com/posts/refresh-token-trong-axios-nhu-the-nao
  }
  return Promise.reject(error);
 });
 
export default api;
