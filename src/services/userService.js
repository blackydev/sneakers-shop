import http from "./httpService";
import auth from "./authService";

const apiEndpoint = "/users";

async function register(user) {
  const res = await http.post(apiEndpoint, {
    email: user.email,
    password: user.password,
  });
  auth.loginWithJwt(res.data);
}

const getOrders = () => http.get(apiEndpoint + "/orders");

const userService = {
  register,
  getOrders,
};

export default userService;
