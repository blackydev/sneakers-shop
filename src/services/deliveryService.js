import http from "./httpService";

const apiEndpoint = "/deliveries";

const getDeliveries = () => http.get(apiEndpoint);

const deliveryService = {
  getDeliveries,
};

export default deliveryService;
