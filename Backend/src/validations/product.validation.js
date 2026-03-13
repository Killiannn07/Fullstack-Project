const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(2, "Nama produk wajib di isi"),
  price: z.number().int().positive("Harga harus lebih dari 0"),
  stock: z.number().int().min(0, "Stock tidak boleh negatif"),
  image_url: z.string().url("URL gambar tidak valid").optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().min(0).optional(),
  image_url: z.string().url("URL gambar tidak valid").optional(),
});


module.exports = { createProductSchema, updateProductSchema };
