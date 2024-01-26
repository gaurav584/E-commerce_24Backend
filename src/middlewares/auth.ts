import { User } from "../models/user";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "./error";


export const adminOnly = TryCatch(async(req,res,next)=>{
    const {id} = req.query;

    if(!id) return next(new ErrorHandler("Please login",400));

    const user=await User.findById(id);
    if(!user) return next(new ErrorHandler("Invalid userId",401));

    if(user.role !== "admin"){
        return next(new ErrorHandler("User Not corrcet accessed",400));
    }
    
    next();
})