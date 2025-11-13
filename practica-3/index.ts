import express from "express";
import { connectMongo } from "./mongo";
import dotenv from "dotenv";
import routerUser from "./routes/auth";
import routerProducts from "./routes/products";

dotenv.config();

connectMongo();

const app = express();
app.use(express.json());
app.use("/api/auth",routerUser)
app.use("/api/products",routerProducts)

app.listen(3000, () => console.log("API started"))