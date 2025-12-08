import { Db,MongoClient } from "mongodb"


let client: MongoClient;
let dB: Db;
const dbName = "Clases2526";


export const connectMongo = async (): Promise<void> => {
    try {
        const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_MONGO}@cluster.ukvoi.mongodb.net/?appName=Cluster`
        client = new MongoClient(mongoUrl);
        dB = client.db(dbName)
        console.log("Connected to MongoDB at" + dbName);
    }catch(err){
        console.log("Error connecting mongo",err);
    }
};

export const getDb=():Db => dB;