const productService = require("../services/product.service");
const { successResponse, errorResponse } = require("../utils/response");

async function getProduct(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const product = await productService.getProducts();
    const totalPages = Math.ceil(product.total / limit);
    return successResponse(res, "Product Fetched", {
      items: product.items,
      pagination: { page, limit, total: product.total, totalPages },
    });
  } catch (error) {
    return errorResponse(res, "Failed to fetch product", 500);
  }
}

async function createProduct(req, res) {
  try {
    const { name, price, stock } = req.body;

    const product = await productService.createProduct(name, price, stock);
    return successResponse(res, "Product Created", product, 201);
  } catch (error) {
    return errorResponse(res, "Failed to create product", 500);
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);

    const product = await productService.getProductById(id);

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(res, "Preoduct Fetched", product);
  } catch (error) {
    return errorResponse(res, "Failed to fetched product", 500);
  }
}

async function updateProduct(req, res){
  try{
    const id = Number(req.params.id)
    const update = await productService.updateProduct(id, req.body)
    if(!update){
      return errorResponse(res, "Product not found", 404)
    }
    return successResponse(res, "products updated", update)
  }
  catch(error){
    return errorResponse(res, "Failed to Update products", 500)
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id)
    const deleted = await productService.deleteProduct(id)
    if(!deleted){
      return errorResponse(res, "Product not found", 404)
    }
    return successResponse(res, "Product deleted")
  } catch (error) {
    return errorResponse(res, "Failed tp delete product", 500)
  }
}

module.exports = { getProduct, createProduct, getProductById, updateProduct, deleteProduct };
