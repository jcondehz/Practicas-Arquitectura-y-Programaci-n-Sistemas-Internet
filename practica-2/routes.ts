import { Router } from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import { create } from "domain";

const router = Router();
const coleccion = () => getDb().collection("Libros");

router.get("/", async (req, res) => {
    try {
        const libros = await coleccion().find().toArray();
        res.json(libros);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/", async (req, res) => {
    try {
        const titulo = req.body?.title;
        const autor = req.body?.author;
        const paginas = req.body?.pages;
        const createdAt = new Date();
        const updatedAt = createdAt;
        if (
            titulo &&
            autor &&
            paginas &&
            typeof titulo === "string" &&
            typeof autor === "string" &&
            typeof paginas === "number" && paginas > 1
        ) {
            const nuevoLibro = {
                title: titulo,
                author: autor,
                pages: paginas,
                createdAt,
                updatedAt,
            };
            const result = await coleccion().insertOne(nuevoLibro);
            const idMongo = result.insertedId;
            const libroAñadido = await coleccion().findOne({ _id: idMongo });
            res.status(201).json(libroAñadido);
        } else {
            res.status(400).json({ message: "Invalid input body" });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put("/:id", async (req, res) => {
    try {
        const id = req.params?.id;

        if (ObjectId.isValid(id)) {
            const result = await coleccion().updateOne({
                _id: new ObjectId(req.params?.id),
            }, { $set: { ...req.body, updatedAt: new Date() } });
            res.json(result);
        } else {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    } catch (err) {
        res.status(404).json(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = req.params?.id;
        if (ObjectId.isValid(id)) {
            const result = await coleccion().deleteOne({
                _id: new ObjectId(req.params?.id),
            });
            res.status(200).json({ message: "Deleted successfully" });
        } else {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    } catch (err) {
        res.status(400).json(err);
    }
});

export default router;
