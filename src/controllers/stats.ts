import { start } from "repl";
import { myCache } from "../app";
import { TryCatch } from "../middlewares/error";
import { Product } from "../models/product";
import { User } from "../models/user";
import { Order } from "../models/order";


export const getDashboardStats = TryCatch(async(req,res,next)=>{
    
    let stats={};

    if(myCache.has("admin-stats")){
        stats = JSON.parse(myCache.get("admin-stats") as string);
    }else{
        const today = new Date();

        const thisMonth = {
            start:new Date(today.getFullYear(),today.getMonth(),1),
            end:today
        }

        const lastMonth = {
            start:new Date(today.getFullYear(),today.getMonth()-1,1),
            end:new Date(today.getFullYear(),today.getMonth(),0)
        }

        const thisMonthProductsPromise = await Product.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthProductsPromise = await Product.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:lastMonth.end
            }
        })

        const thisMonthUsersPromise =await  User.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthUsersPromise = await User.find({
            createdAt:{
                $gte:lastMonth.start,
                $lte:thisMonth.end
            }
        })

        const thisMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const lastMonthOrdersPromise = await Order.find({
            createdAt:{
                $gte:thisMonth.start,
                $lte:thisMonth.end
            }
        })

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders
        ] = await Promise.all([
            thisMonthProductsPromise,
            lastMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthOrdersPromise
        ])
    }

    return res.status(200).json({
        success:true,
        stats
    })
}) 

export const getPieCharts = TryCatch(async(req,res,next)=>{

})

export const getBarCharts = TryCatch(async(req,res,next)=>{

})

export const getLineCharts = TryCatch(async(req,res,next)=>{

})