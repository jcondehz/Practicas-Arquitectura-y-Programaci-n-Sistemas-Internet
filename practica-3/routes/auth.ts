import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectMongo, getDb } from "../mongo";
import bcrypt from "bcryptjs";


const router = Router();

const secret = process.env.SECRET;

type User = {
    _id: ObjectId;
    username: String;
    email: String;
    passwordHash: String;
    createdAt: Date;
};

type Product = {
    _id: ObjectId;
    name: String;
    description: String;
    price: Number;
    stock: Number;
    createdAt: Date;
};

type Cart = {
    _id: ObjectId;
    userId: ObjectId;
    items: String[];
};

const coleccion = () => getDb().collection("UsersPractica3");

router.post("/auth/register", async (req, res) => {
    try {
        const { username, email, password } = req.body as {
            username: string;
            email: string;
            password: string;
        };
        const users = coleccion();
        const existingUser = await users.findOne({ username });
        if (existingUser) {
            return res.status(409).json({
                message: "Usuario ya registrado",
            });
        }
        const existingEmail = await users.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({
                message: "Email ya registrado",
            });
        }
        const passEncriptado = await bcrypt.hash(password,10);
        await users.insertOne({
            username,
            email,
            passEncriptado,
        });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(400).json({ message: "Invalid JSON body", error });
    }
});

export default router;
