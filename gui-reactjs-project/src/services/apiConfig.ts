import { routes } from "@/app/routers/routes";
import { EAPI } from "@/models/general";
import axios from "axios";
import {redirect} from "next/navigation"

const api = axios.create({
  baseURL: `${process.env.API_URL}`,
});

//User login token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(EAPI.TOKEN);
  if (token) config.headers.common["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use((response) => {
  return response;
 }, (error) => {
  if(error.response.status === 401 || error.response.status  === 403 ){
    //refresh token
    //Tham khảo tại: https://codestus.com/posts/refresh-token-trong-axios-nhu-the-nao
  }
  return Promise.reject(error);
 });
 
export default api;
