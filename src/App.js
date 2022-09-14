import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar";
import Footer from "./components/footer";
import Home from "./components/home";
// import Products from "./components/products";
import Product from "./components/product";
import ProductNotFound from "./components/productNotFound";
import PrivacyPolicy from "./components/privacyPolicy";
import ShopStatute from "./components/shopStatute";
import ScrollToTop from "./components/scrollToTop";
import { toast, ToastContainer } from "react-toastify";
import "./styles/App.css";
import "./styles/shop.css";
import "./styles/home.css";

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <ScrollToTop>
          <ToastContainer />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/sklep" element={<Products />} /> */}
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicy />} />
            <Route path="/regulamin-sklepu" element={<ShopStatute />} />
            <Route path="/sklep/:id" element={<Product />} />
            <Route
              path="/produkt-nieodnaleziony"
              element={<ProductNotFound />}
            />
          </Routes>
          <Footer />
        </ScrollToTop>
      </React.Fragment>
    );
  }
}

export default App;
