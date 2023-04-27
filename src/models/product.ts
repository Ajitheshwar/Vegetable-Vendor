import { Address, UserDetails } from "./user"

export type CatandSubCat = {
    subCategories : [string],
    category : string
}

export type Product = {
    name : string,
    sellingPrice : number,
    category : string,
    description : string,
    subCategory : string,
    benefits : string[],
    image : string,
    _id : string
}

export type AdminProduct= {
    name : string,
    sellingPrice : number,
    category : string,
    description : string,
    subCategory : string,
    benefits : string[],
    image : string,
    _id : string,
    costPrice : number,
    numberOfDays : number,
    stockFromPastDays : number[],
}

export type Cart = {
    name : string,
    quantity : number,
    productId : {
        name : string,
        category : string,
        subCategory : string,
        sellingPrice : number,
        image : string
    } | any
}

export type Order = {
    _id :string,
    date : Date,
    address : Address,
    products : Cart[],
    status : string,
    modeOfPayment : string,
    totalCost : number,
    customerId : any
}

export type ProductNotification = {
    name : string,
    quantity : number,
    category : string,
    subCategory : string
}

export interface SingleProduct{
    name : string,
    category : string,
    subCategory : string,
    sellingPrice : number,
    wasted : number,
    costPrice : number,
    stockFromPastDays : number[],
    numberOfDays  : number
}