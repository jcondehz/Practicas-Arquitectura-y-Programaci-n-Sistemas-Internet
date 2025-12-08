import express from "express";
import { connectMongo } from "./mongo";
import dotenv from "dotenv";
import routerLibros from "./routes";

dotenv.config();

connectMongo();

const app = express();
app.use(express.json());
app.use("/api/books",routerLibros)
app.listen(3000, () => console.log("API started"))
