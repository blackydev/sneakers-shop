import http from "./httpService";
import configInfo from "../config.json";

const apiUrl = configInfo.apiUrl;
const apiEndpoint = apiUrl + "/products";

export function getProducts() {
  return http.get(apiEndpoint);
}

export function getNewestProduct() {
  return http.get(`${apiEndpoint}?pageLength=1`);
}

export function getProduct(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function getProductUrl(fileName) {
  if (!fileName) return "";
  return apiUrl + "/public/images/products/" + fileName;
}
