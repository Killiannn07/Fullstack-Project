import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../ui/Button";
import DetailProduct from "./DetailProduct";
import { formatCurrencyRp } from "../../utils/formatCurrency";

function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data.data.items))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return(
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4 text-primary">Products</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 ">
        {products.map((p) => (
        <div key={p.id} className="border p-4 rounded mb-3">
          <div className="h-40 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center rounded overflow-hidden">
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-sm text-center">No Image</div>
            )}
          </div>
          <h3 className="font-medium">{p.name}</h3>
          <p className="text-gray-500 mb-2">{formatCurrencyRp(p.price)}</p>
          <Button onClick={<DetailProduct></DetailProduct>}>
            Detail
          </Button>
        </div>
      ))}
      </div>
      
    </div>
  )
}

export default Products;