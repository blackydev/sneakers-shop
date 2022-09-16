import productService from "../../services/productService";

export default function AlertMessage({ product }) {
  const num = product.numberInStock;
  if (num === 0) return "OUT OF STOCK!";
  if (productService.isPreorder(product)) return "PREORDER";

  if (num < 10 && num !== 0) return "LAST IN STOCK";
}
