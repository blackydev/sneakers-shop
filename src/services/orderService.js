import http from "./httpService";
import cartService from "./cartService";

const apiEndpoint = "/orders";

async function postOrder(
  customer,
  deliveryId,
  cartId = cartService.getCartId(),
) {
  return await http.post(`${apiEndpoint}`, {
    cartId,
    customer,
    deliveryId,
  });
}

function pay(orderId) {
  return http.get(`${apiEndpoint}/${orderId}/payment`, {
    headers: {
      "Access-Control-Allow-Origin": "https://sandbox-go.przelewy24.pl",
    },
  });
}

const orderService = {
  postOrder,
  pay,
};

export default orderService;
