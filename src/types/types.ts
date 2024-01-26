import { Request, Response , NextFunction } from "express"

// user
export interface NewUserRequestBody{
    name:string,
    email:string,
    photo:string,
    gender:string,
    role:string,
    _id:string,
    dob:Date
}

// product
export interface NewProductRequestBody{
    name:string,
    category:string,
    price:number,
    stock:number
}

// product-(search,filter,pagination)
export type SearchRequestQuery = {
    search?:string,
    price?:string,
    category?:string,
    sort?:string,
    page?:string
}

export interface BaseQuery {
    name?:{
        $regex:string,
        $options:string
    };
    price?:{
        $lte:number
    };
    category?:string
}

export type ControllerType = (
    req:Request,
    res:Response,
    next:NextFunction
) => Promise<void | Response<any,Record<string,any>>>;

export type InvalidateCacheProps = {
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    userId?:string;
    orderId?:string;
    productId?:string | string[];
}

export type orderReduceprop={
   order:boolean
}

export type OrderItemType = {
    name:string,
    photo:string,
    price:number,
    quantity:number,
    productId:string
}

export type ShippingInfoType = {
    address:string;
    city:string;
    state:string;
    country:string;
    pinCode:number;
};

export interface NewOrdreRequestBody{
    shippingInfo:ShippingInfoType;
    user:string;
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    orderItems:OrderItemType[]
}


