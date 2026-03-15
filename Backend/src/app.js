const express = require("express")

const cors = require('cors')

const app = express()

const productRoute = require('./routes/product.route')

const authRoute = require('./routes/auth.route')

const cartRoute = require('./routes/cart.route')

const orderRoute = require('./routes/order.route')
const { errorResponse } = require("./utils/response")

const corsOptions = {
  origin: "https://ian-store.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(express.json())
app.use(cors(corsOptions))
app.use("/products", productRoute)
app.use("/auth", authRoute)
app.use("/cart", cartRoute)
app.use("/order", orderRoute)

app.use((err, req, res, next) => {
    console.error(err); 
    return errorResponse(res, err.message, 400)})

module.exports = app