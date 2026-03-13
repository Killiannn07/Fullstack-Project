import { useState } from "react";
import { useCart } from "../../context/CartContext";


export default function DetailProduct(){
    const [loading, setLoading] = useState({})
    const {addToCart} = useCart()
    return(
        <Button 
                    onClick={async () => {
                      try {
                        setLoading(prev => ({...prev, [p.id]: true}));
                        await addToCart(p.id, 1);
                        alert("Added to cart!");
                      } catch (error) {
                        alert("Failed to add to cart");
                      } finally {
                        setLoading(prev => ({...prev, [p.id]: false}));
                      }
                    }}
                    disabled={loading[p.id]}
                  >
                    {loading[p.id] ? "Loading..." : "Add to cart"}
                  </Button>
    )
}