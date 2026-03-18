import { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../ui/Button";
import DetailProduct from "./DetailProduct";
import { formatCurrencyRp } from "../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data.data.items);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      });
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      <h1 className="text-xl font-semibold mb-4 text-primary">Products</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 min-w-6xl">
        {products && products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="shadow-lg bg-white  p-4 rounded-lg mb-3">
              <div className="h-50  bg-linear-to-br from-stone-100 to-stone-200 flex items-center justify-center rounded overflow-hidden">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm text-center">
                    No Image
                  </div>
                )}
              </div>
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-gray-500 mb-2">{formatCurrencyRp(p.price)}</p>
              <Button onClick={() => handleSelectProduct(p)}>Detail</Button>
            </div>
          ))
        ) : (
          <div className="col-span-5 text-center text-gray-500">
            No products available
          </div>
        )}
      </div>
      {selectedProduct && (
        <DetailProduct
          product={selectedProduct}
          addToCart={addToCart}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

export default Products;
