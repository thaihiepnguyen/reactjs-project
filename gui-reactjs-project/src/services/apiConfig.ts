import { EAPI } from "@/models/general";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.API_URL}`,
});

//User login token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(EAPI.TOKEN);
  if (token) config.headers.common["Authorization"] = `Bearer ${token}`;
  return config;
});

export default api;
