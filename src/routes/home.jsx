import React, { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import Products from "../components/products";
import ButtonGroup from "../components/common/buttonGroup";
import HomeHeader from "../components/homeHeader";

const params = {
  sortBy: "-_id",
  select: ["name", "image", "price", "category", "release", "numberInStock"],
};

export async function loader() {
  try {
    const { data: products } = await productService.getProducts({ params });
    const { data: categories } = await categoryService.getCategories();
    return { products, categories, newestProduct: products[0] };
  } catch (ex) {
    throw new Response("", {
      status: 503,
      statusText: "Technical break",
    });
  }
}

export default function Home() {
  const rootState = useOutletContext();
  const { products: allProducts, categories, newestProduct } = useLoaderData();
  const [products, setProducts] = useState(allProducts);
  const [selectedCategory, selectCategory] = useState(false);

  const handleCategorySelect = async ({ _id: id }) => {
    if (id === selectedCategory) id = null;
    selectCategory(id);
    const { data: products } = await productService.getProducts({
      params: { ...params, category: id },
    });
    setProducts(products);
  };

  return (
    <>
      <HomeHeader product={newestProduct} />
      <main className="home container">
        <section className="d-flex justify-content-center my-1" id="categories">
          <ButtonGroup
            items={categories}
            selectedItem={selectedCategory}
            size={"lg"}
            onItemSelect={handleCategorySelect}
            color={"dark"}
          />
        </section>
        <section id="products" className="row">
          <Products
            products={products}
            rootState={rootState}
            className={"col-6 col-lg-4 col-xl-3 my-3"}
          />
        </section>
      </main>
    </>
  );
}
