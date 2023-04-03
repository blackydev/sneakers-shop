import React, { useState } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import Products from "../components/products";
import ButtonGroup from "../components/common/buttonGroup";
import HomeHeader from "../components/homeHeader";

export async function loader() {
  try {
    const { data: products } = await productService.getProducts();
    const { data: categories } = await categoryService.getCategories();
    return { products, categories };
  } catch (ex) {
    throw new Response("", {
      status: 503,
      statusText: "Technical break",
    });
  }
}

export default function Home() {
  const rootState = useOutletContext();
  const loader = useLoaderData();
  const [products, setProducts] = useState(loader.products);
  const [selectedCategory, selectCategory] = useState();

  const handleCategorySelect = async ({ _id: categoryId }) => {
    if (categoryId === selectedCategory) categoryId = undefined;
    selectCategory(categoryId);
    const { data: products } = await productService.getProducts(categoryId);
    setProducts(products);
  };

  return (
    <>
      <HomeHeader product={loader.products[0]} />
      <main className="home container">
        <section className="d-flex justify-content-center my-1" id="categories">
          <ButtonGroup
            items={loader.categories}
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
