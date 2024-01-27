import express, {Request,Response, NextFunction } from "express";
import { errorMiddleware } from "./middlewares/error";
import { connectDB } from "./utils/features";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";

// importing Routes
import userRoute from "./routes/user";
import productRoute from "./routes/products";
import orderRoute from "./routes/order";
import paymentRoute from "./routes/payment";


config({
    path:"./.env",
})

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || " ";

connectDB(mongoURI);

export const myCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.send("Api is Working with /api/v1");
})

// using Routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/payment",paymentRoute);


app.use("/uploads",express.static("uploads"));
app.use(errorMiddleware);

/*app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    return res.status(400).json({
        success:true,
        message:"Some Error"
    })
})*/

app.listen(port,()=>{
    console.log(`Server si working on http://localhost:${port}`);
});