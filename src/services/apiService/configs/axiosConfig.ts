import axios, { AxiosError } from "axios";
import { useKanbanStore } from "@/stores/KanbanStore";

const baseDomain = "http://localhost:3000";
const baseURL = `${baseDomain}`; // In case of /api/v1;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

const errorHandler = (error: AxiosError) => {
  const store = useKanbanStore();

  const statusCode = error.response?.status

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error)
  }

  store.setToast('error', error.message);

  return Promise.reject(error);
}

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})
