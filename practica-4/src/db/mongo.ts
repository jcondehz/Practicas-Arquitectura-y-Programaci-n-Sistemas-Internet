import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;
const dbName = "Clases2526";

export const connectToMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    client = new MongoClient(mongoUrl!);
    await client.connect();
    dB = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting", err);
  }
};

export const getDB = (): Db => dB;

export const closeMongoDB = async () => {
  try {
    client && (await client.close());
  } catch (err) {
    console.log("Closing MongoDb ", err);
  }
};
