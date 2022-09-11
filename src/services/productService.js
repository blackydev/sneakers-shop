import http from "./httpService";
import configInfo from "../config.json";

const apiUrl = configInfo.apiUrl;

const apiEndpoint = apiUrl + "/products";

export function getProducts() {
  return http.get(apiEndpoint);
}
