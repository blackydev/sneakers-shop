import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = process.env.SNEAKERS_API_URL + "/api";
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
};

export default httpService;
