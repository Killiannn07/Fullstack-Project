import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function Products() {
  const {addToCart} = useCart()
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  
  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data.data.items))
  }, []);

  return(
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4 text-primary">Products</h1>

      {products.map((p) => (
        <div key={p.id} className="border p-4 rounded mb-3">
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-gray-500 mb-2">Rp.{p.price}</p>
        </div>
      ))}
    </div>
  )
}

export default Products;