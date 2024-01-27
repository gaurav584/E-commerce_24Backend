import  express  from "express";
import { adminOnly } from "../middlewares/auth";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment";

const app = express.Router();

// route - /api/v1/payment/coupon/new
app.post("/coupon/new",adminOnly,newCoupon);

// route - /api/v1/payment/coupon/discount
app.get("/discount",applyDiscount);

// route - /api/v1/payment/coupon/all
app.get("/coupon/all",adminOnly,allCoupons);

//route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id",adminOnly,deleteCoupon);

export default app;