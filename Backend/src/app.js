const express = require("express")

const app = express()

const productRoute = require('./routes/product.route')

const authRoute = require('./routes/auth.route')

app.use(express.json())
app.use("/products", productRoute)
app.use("/auth", authRoute)




module.exports = app