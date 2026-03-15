const express = require("express")

const cors = require('cors')

const app = express()

const productRoute = require('./routes/product.route')

const authRoute = require('./routes/auth.route')

const cartRoute = require('./routes/cart.route')

const orderRoute = require('./routes/order.route')
const { errorResponse } = require("./utils/response")

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://ian-store.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
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