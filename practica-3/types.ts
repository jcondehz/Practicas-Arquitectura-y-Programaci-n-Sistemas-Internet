import { ObjectId } from "mongodb";


export type User = {
    _id: ObjectId;
    username: String;
    email: String;
    passwordHash: String;
    createdAt: Date;
};

export type Product = {
    _id: ObjectId;
    name: String;
    description: String;
    price: number;
    stock: number;
    createdAt: Date;
};

export type Cart = {
    _id: ObjectId;
    userId: ObjectId;
    items: String[];
};
