import axios from "axios";
import { toast } from "react-toastify";

export const apiUrl = process.env.REACT_APP_API_URL + "/api";
axios.defaults.baseURL = apiUrl;

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) toast.error("An unexpected error occurred");

  return Promise.reject(error);
});

const setJwt = (jwt) => (axios.defaults.headers.common["x-auth-token"] = jwt);

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
  apiUrl,
};

export default httpService;
