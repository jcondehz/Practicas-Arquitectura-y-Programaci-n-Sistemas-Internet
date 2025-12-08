import { Router } from "express";
import { ObjectId } from "mongodb";
import { connectMongo, getDb } from "../mongo";
import { Cart } from "../types";
import { AuthRequest, verifyToken } from "../middleware/verifyToken";
import router from "./auth";

const routerCart = Router();
const coleccion = () => getDb().collection("CartsPractica3");

routerCart.get("/", verifyToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user || typeof req.user === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userIdString = (req.user as any).id;
    const userId = new ObjectId(userIdString) as ObjectId; 

    const carts = coleccion();

    let cart = await carts.findOne({ userId });

    if (!cart) {
      const newCart = {
        userId,
        items: [],
      };

      const result = await carts.insertOne(newCart);
      cart = { _id: result.insertedId, ...newCart };
    }

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el carrito",
      error,
    });
  }
});

routerCart.put("/add", verifyToken, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!req.user || typeof req.user === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (
      !productId || quantity === undefined || !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ProductId inválido" });
    }

    const userIdString = (req.user as any).id;
    const userId = new ObjectId(userIdString) as ObjectId;
    const prodId = new ObjectId(productId) as ObjectId;

    const carts = coleccion();

    let cart = await carts.findOne({ userId });

    if (!cart) {
      const newCart = {
        userId,
        items: [{ productId: prodId, quantity }],
      };

      const result = await carts.insertOne(newCart);
      cart = { _id: result.insertedId, ...newCart };

      return res.status(200).json(cart);
    }

    const index = cart.items.findIndex(
      (item: { productId: ObjectId; quantity: number }) =>
        item.productId.equals(prodId),
    );

    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ productId: prodId, quantity });
    }

    await carts.updateOne(
      { userId },
      { $set: { items: cart.items } },
    );

    const updatedCart = await carts.findOne({ userId });
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el carrito",
      error,
    });
  }
});

export default routerCart;
