import express, { Request,Response,NextFunction } from "express";
import { TryCatch } from "../middlewares/error"


export const checkHealth = TryCatch(async(req,res,next) => {

    console.log("system-started")

    res.status(200).json({
        message:"server is ok",
        status:200
    })
})