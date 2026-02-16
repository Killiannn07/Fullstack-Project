const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(2, "Nama produk wajib di isi"),
  price: z.number().int().positive("Harga harus lebih dari 0"),
  stock: z.number().int().min(0, "Stock tidak boleh negatif"),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
});


module.exports = { createProductSchema, updateProductSchema };
