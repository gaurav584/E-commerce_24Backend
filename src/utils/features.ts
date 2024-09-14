import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types";
import { Product } from "../models/product";
import { myCache } from "../app";
import { Order } from "../models/order";
import { Response } from "express";

// Connection to Database
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

// Clear Cached
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

    if (typeof productId === "string") {
      productKeys.push(`product-${productId}`);
    }

    if (typeof productId === "object") {
      productId.forEach((i) => productKeys.push(`product-${i}`));
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

// Reduce Product Stock when New Order is Placed
export const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if (!product) throw new Error("Product Not Found");
    product.stock -= order.quantity;
    await product.save();
  }
};

// Additional Functionality of Token using JWT
// export type UserDetails = {
//   _id?: string; // uuid from firebase
//   name?: string;
//   email: string;
//   photo?: string;
//   role?: string;
//   gender?: string;
//   dob?: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
//   getJWTToken: () => string;
// }

// // Generate Token using JWT
// export const sendToken = (user: UserDetails, statusCode: number, res: Response) => {
//   const token = user.getJWTToken(); 

//   // Options for cookie
//   const option = {
//     expires: new Date(Date.now() + 5 * 24 * 60 * 1000),
//     httpOnly: true
//   }

//   res.status(statusCode).cookie("token", token, option).json({
//     success: true,
//     user,
//     token
//   })
// }

// // Email Sent using NodeMailer
// import nodeMailer from "nodemailer";

// export type EmailOption = {
//   email: string;
//   subject: string;
//   message: string;
// }

// export const sendEmail = async (options: EmailOption) => {
//   const transporter = nodeMailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "backendtesting1999@gmail.com",
//       pass: "P@ssw0rd"
//     }
//   })

//   const mailOptions = {
//     from: "backendtesting1999@gmail.com",
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//   };

//   await transporter.sendMail(mailOptions);
//   return true;
// }
