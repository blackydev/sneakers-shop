import http from "./httpService";

const apiEndpoint = "/products";

function getProducts(categoryId) {
  return http.get(apiEndpoint, {
    params: { category: categoryId },
  });
}

function getProduct(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

function isPreorder(product) {
  return product.release && Date.parse(product.release) > new Date();
}

const productService = {
  getProducts,
  getProduct,
  isPreorder,
};

export default productService;
