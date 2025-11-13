import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectMongo, getDb } from "../mongo";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

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
        const passEncriptado = await bcrypt.hash(password, 10);
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

router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body as {
            email: string;
            password: string;
        };
        const users = coleccion();
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email invalido" });
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            user.passEncriptado,
        );
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password invalido" });
        }
        const secret = process.env.SECRET;
        const token = jwt.sign(
            { id: user._id?.toString(), email: user.email } as JwtPayload,
            secret as string,
            {
                expiresIn: "1h",
            },
        );
        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

export default router;
