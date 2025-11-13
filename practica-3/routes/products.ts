import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectMongo, getDb } from "../mongo";
import { Cart, Product } from "../types";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";

const routerProductos = Router();

const coleccion = () => getDb().collection("ProductsPractica3");

routerProductos.get("/", verifyToken, async (req: AuthRequest, res) => {
    try {
        const products = coleccion();
        const resultado = await products.find({}).toArray();
        res.status(200).json({
            message: "Acceso permitido",
            user: req.user,
            productos: resultado,
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid JSON body", error });
    }
});

routerProductos.post("/", async (req, res) => {
    try {
        const { name, description, price, stock } = req.body as Product;
        const products = coleccion();

        if (!name || !price || !stock || stock < 0 || price < 0) {
            return res.status(400).json({ message: "Los datos son erroneos" });
        }
        await products.insertOne({ name, description, price, stock });
        res.status(201).json({ message: "Producto creado exitosamente" });
    } catch (error) {
        res.status(400).json({ message: "Invalid JSON body", error });
    }
});

export default routerProductos;
