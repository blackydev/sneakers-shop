import http from "./httpService";

const apiEndpoint = "/categories";

function getCategories() {
  return http.get(apiEndpoint);
}

const categoryService = {
  getCategories,
};

export default categoryService;
