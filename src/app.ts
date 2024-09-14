import express, { Request, Response, NextFunction } from "express";
import { errorMiddleware } from "./middlewares/error";
import { connectDB } from "./utils/features";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import Stripe from "stripe";

// importing Routes
import healthCheck from "./routes/health";
import userRoute from "./routes/user";
import productRoute from "./routes/products";
import orderRoute from "./routes/order";
import paymentRoute from "./routes/payment";
import dashboardRoute from "./routes/stats";


config({
  path: "./.env",
});

// imp-env-variables for app
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || " ";
const stripeKey = process.env.STRIPE_KEY || " ";

// DataBase Connection
connectDB(mongoURI);

// Payment-Gateway
export const stripe = new Stripe(stripeKey);

// Use Caching 
export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Api is Working with /api/v1");
});

// using Routes
app.use("/api/v1/health", healthCheck);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});
