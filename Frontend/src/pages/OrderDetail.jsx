import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function OrderDetail(){
    const {orderId} = useParams()

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await api.get(`/order/orderdetail/${orderId}`)
            setItems(res.data.data)
            setLoading(false)
        }
        fetchDetail()
    }, [orderId])

    if(loading){return <p>Loading...</p>}
    if(!items.length){return <p>Order empty</p>}

    return (
        <div>
            <h2>Order Detail #{orderId}</h2>

            {items.map((item) => (
                <div key={item.product_id}>
                    <p>{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: Rp.{item.price_at_purchase}</p>
                    <p>Total: Rp.{item.price_at_purchase * item.quantity}</p>
                </div>
            ))}
        </div>
    )
}

export default OrderDetail