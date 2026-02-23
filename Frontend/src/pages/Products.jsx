import { useEffect } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

function Products() {
  const {addToCart} = useCart()
  
  useEffect(() => {
    api.get("/products")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>Products
    <button onClick={() => addToCart(Products.id)}>Add to Cart</button>
  </h1>;
}

export default Products;
