import express from "express";
import { singleUpload } from "../middlewares/multer";
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getSingleProducts, getlatestProducts, newProduct, updateProduct } from "../controllers/product";
import { adminOnly } from "../middlewares/auth";

const app = express.Router();

// To create New Product - /api/v1/product/new
app.post("/new",singleUpload,newProduct);

// To get all Products -/api/v1/product/all
app.get("/all",getAllProducts);

// To create New Product - /api/v1/product/latest
app.get("/latest",getlatestProducts);

// To create New Product - /api/v1/product/categories
app.get("/categories",getAllCategories);

// To create New Product - /api/v1/product/admin-products
app.get("/admin-products",getAdminProducts);

app
   .route("/:id")
   .get(getSingleProducts)
   .put(singleUpload,updateProduct)
   .delete(deleteProduct);

export default app;