const express = require("express")

const app = express()

const productRoute = require('./routes/product.route')

const authRoute = require('./routes/auth.route')

const cartRoute = require('./routes/cart.route')

app.use(express.json())
app.use("/products", productRoute)
app.use("/auth", authRoute)
app.use("/cart", cartRoute)




module.exports = app