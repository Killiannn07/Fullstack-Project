import { useEffect } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Products() {
  const {addToCart} = useCart()
  const navigate = useNavigate()
  
  useEffect(() => {
    api.get("/products")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>Products
    <button onClick={() => addToCart(Products.id)}>Add to Cart</button>
    <button onClick={() => navigate("/login")}>Login</button>
  </h1>;
}

export default Products;
