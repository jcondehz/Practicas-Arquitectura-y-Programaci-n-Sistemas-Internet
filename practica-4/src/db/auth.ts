import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { getDB } from "./mongo";

dotenv.config();

const SECRETO = process.env.SECRET; //podemos copiar esto para pegar esto y olvidarnos

type TokenPayload = {
  userId: string;
};

export const signToken = (userId: string) =>
  jwt.sign({ userId }, SECRETO!, { expiresIn: "1h" });

export const verifyToken = (token: string): TokenPayload | null => {
  try {2
    return jwt.verify(token, SECRETO!) as TokenPayload;
  } catch (err) {
    return null;
  }
};

export const getUserFromToken = async (token: string) => {
  const payload = verifyToken(token);
  if (!payload) return null;
  const db = getDB();
  return await db.collection("UsersPractica4").findOne({
    _id: new ObjectId(payload.userId),
  });
};