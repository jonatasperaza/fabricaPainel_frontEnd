import axios from "axios";
import { useAuth } from "@/stores/auth";
import { globalRouter } from "./globalRouter";

const api = axios.create({
  baseURL: 'https://painelapi.fabricadesoftware.ifc.edu.br/api',
  //baseURL: 'http://localhost:8000/api',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 100000,
});

api.interceptors.request.use((config) => {
  const authStore = useAuth();
  const token = authStore?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      useAuth().logout();
      globalRouter.router?.push("/auth/login/");
    }
    return Promise.reject(error);
  }
);

export default api;
