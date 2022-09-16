import http from "./httpService";

const apiEndpoint = "/p24";

export function getPaymentMethods() {
  return http.get(apiEndpoint);
}
