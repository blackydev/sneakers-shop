import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/movies";

export function getProducts() {
  return http.get(apiEndpoint);
}
