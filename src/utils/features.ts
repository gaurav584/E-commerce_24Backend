import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types";
import { Product } from "../models/product";
import { myCache } from "../app";
import { Order } from "../models/order";

// connection  to DataBase
export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "Ecommerce_24",
    })
    .then((c) => {
      console.log(`DB connected to ${c.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

// clear cached
export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "categories",
      "all-products",
    ];

    if(typeof productId === "string"){
      productKeys.push(`product-${productId}`);
    }

    if(typeof productId === "object"){
      productId.forEach((i)=> productKeys.push(`product-${i}`));
    }

    myCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "all-orders",
       `my-orders-${userId}`,
        `order-${orderId}`
      ];

    myCache.del(orderKeys);
  }
};

// Reduce Product when new Order is Placed
export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};
