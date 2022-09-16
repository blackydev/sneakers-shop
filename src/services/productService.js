import http from "./httpService";

const apiEndpoint = "/products";

function getProducts(options) {
  return http.get(apiEndpoint, options);
}

async function getNewestProduct() {
  const res = await http.get(`${apiEndpoint}?pageLength=1&sortBy=-_id`, {
    params: {
      pageLength: "1",
      sortBy: "-_id",
    },
  });
  return {
    ...res,
    data: res.data[0],
  };
}

function getProduct(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

function isPreorder(product) {
  return product.release && Date.parse(product.release) > new Date();
}

const productService = {
  getProducts,
  getNewestProduct,
  getProduct,
  isPreorder,
};

export default productService;
