import http from "./httpService";
import cartService from "./cartService";

const apiEndpoint = "/orders";

async function postOrder(
  customer,
  deliveryId,
  cartId = cartService.getCartId()
) {
  return await http.post(`${apiEndpoint}`, {
    cartId,
    customer,
    deliveryId,
  });
}

function pay(orderId) {
  return http.get(`${apiEndpoint}/${orderId}/payment`, {
    withCredentials: true,
  });
}

const orderService = {
  postOrder,
  pay,
};

export default orderService;
