import express, { Request } from "express";
import { TryCatch } from "../middlewares/error";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types";
import { Product } from "../models/product";
import ErrorHandler from "../utils/utility-class";
import { rm } from "fs";
import { myCache } from "../app";
import { invalidateCache } from "../utils/features";

// Revalidate on New , update, delete, Product & New Order
export const getlatestProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("latest-product"))
    products = JSON.parse(myCache.get("latest-product") as string);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-product", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

// Revalidate on New , update, delete, Product & New Order
export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;

  if (myCache.has("categories"))
    categories = JSON.parse(myCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    myCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

// Revalidate on New , update, delete, Product & New Order
export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;

  if (myCache.has("all-products"))
    products = JSON.parse(myCache.get("all-products") as string);
  else {
    products = await Product.find({});
    myCache.set("all-products", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProducts = TryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (myCache.has(`product-${id}`))
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  else {
    product = await Product.findById(id);

    if (!product) return next(new ErrorHandler("Product Not found", 404));
    myCache.set(`product-${id}`, JSON.stringify(`product-${id}`));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please add Photo", 400));

    if (!name || !price || !stock || !category) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new ErrorHandler("Please enter All Feilds", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });

    // clean cached data after new product is create.
    await invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      message: "Product created succesfully",
    });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Invalid Product Id", 404));

  if (!photo) return next(new ErrorHandler("Please add Photo", 400));

  if (!name || !price || !stock || !category) {
    rm(photo.path, () => {
      console.log("Deleted");
    });

    return next(new ErrorHandler("Please enter all Feilds", 400));
  }

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old photo deleted");
    });

    product.photo = photo.path;
  }

  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  await product.save();

  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product Created Succesfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  rm(product.photo!, () => {
    console.log("Products Photo Deleted");
  });

  await Product.deleteOne();

  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    product,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }

    if (category) baseQuery.category = category;

    /*----> in this both await will run takes more time
     const products = await Product.find(baseQuery)
     .sort(sort &&  {price:sort === "asc" ? 1: -1})
     .limit(limit)
     .skip(skip);

     const filteredOnlyProduct = await Product.find(baseQuery);
     */

    const [products, filteredOnlyProduct] = await Promise.all([
      Product.find({ baseQuery })
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    console.log(products);
    console.log("break");
    console.log(filteredOnlyProduct);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);
