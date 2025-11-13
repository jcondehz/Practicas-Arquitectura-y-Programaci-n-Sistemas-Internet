import express from "express";
import { connectMongo } from "./mongo";
import dotenv from "dotenv";
import routerUser from "./routes/auth";
dotenv.config();

connectMongo();

const app = express();
app.use(express.json());
app.use("/api",routerUser)
app.listen(3000, () => console.log("API started"))