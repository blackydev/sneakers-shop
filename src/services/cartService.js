import http from "./httpService";

const apiEndpoint = "/carts";

const cartKey = "cartId";

const getUrl = (cartId) => apiEndpoint + "/" + cartId;

const setCartId = (cartId) => localStorage.setItem(cartKey, cartId);
const getCartId = () => localStorage.getItem(cartKey);
const removeCartId = () => localStorage.removeItem(cartKey);

const getCart = (cartId = getCartId()) => {
  return http.get(getUrl(cartId));
};

async function createCart() {
  const { data: cart } = await http.get(apiEndpoint);
  setCartId(cart._id);
  return cart._id;
}

async function pushProduct(productId, amount, cartId = getCartId()) {
  if (!cartId) cartId = await createCart();
  try {
    const res = await http.put(getUrl(cartId), {
      productId,
      amount,
    });
    return res;
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      removeCartId();
      return await pushProduct(productId, amount);
    }
  }
}

async function deleteProduct(productId, cartId = getCartId()) {
  if (!cartId) return null;
  try {
    var res = await http.delete(getUrl(cartId) + "/" + productId);
    if (res.status === 204) {
      removeCartId();

      return null;
    } else return res;
  } catch (ex) {
    if (ex.response && ex.response.status === 404) removeCartId();

    return null;
  }
}

const cartService = {
  setCartId,
  getCartId,
  removeCartId,
  getCart,
  pushProduct,
  deleteProduct,
};

export default cartService;
