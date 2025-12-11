import bcrypt from "bcryptjs";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";

export const createUser = async (
    username: string,
    email: string,
    password: string,
) => {
    const db = getDB();
    const encryptPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("UsersPractica4").insertOne({
        username,
        email,
        password: encryptPassword,
        createdAt: new Date().toString(),
    });
    return result.insertedId.toString();
};

export const validateUser = async (email: string, password: string) => {
    const db = getDB();
    const user = await db.collection("UsersPractica4").findOne({ email });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return user;
};

export const returnProjects = async (userId: string) => {
    const db = getDB();

    const projects = await db.collection("ProjectsPractica4").find({
        $or: [
            { owner: userId },
            { members: userId },
        ],
    }).toArray();

    return projects;
};

export const returnProjectById = async (projectId: string) => {
    const db = getDB();
    const project = db.collection("ProjectsPractica4").findOne({
        _id: new ObjectId(projectId),
    });
    return project;
};

export const returnUsers = async () => {
    const db = getDB();
    const users = await db.collection("UsersPractica4").find().toArray();
    return users;
};

export const createProject = async (
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    ownerId: string,
) => {
    const db = getDB();
    if (endDate < startDate) {
        throw new Error("La fecha de fin no puede ser anterior a la de inicio");
    }
    const result = await db.collection("ProjectsPractica4").insertOne({
        name,
        description,
        startDate,
        endDate,
        owner: ownerId,
    });

    const project = await db.collection("ProjectsPractica4").findOne({
        _id: result.insertedId,
    });
    return project;
};

export const tasksByProject = async (projectId: string) => {
    const db = getDB(); 
    return await db
      .collection("TasksPractica4")
      .find({ projectId })
      .toArray();
}

export const addMembersToProject = async (projectId: string, userId: string) => {
    const db = getDB();
    const project = await db.collection("ProjectsPractica4").findOne({
        _id: new ObjectId(projectId),
    });

    if (!project) {
        throw new Error("Proyecto no encontrado");
    }

    if (project.members && project.members.includes(userId)) {
        throw new Error("El usuario ya es miembro del proyecto");
    }

    await db.collection("ProjectsPractica4").updateOne(
        { _id: new ObjectId(projectId) },
        { $addToSet: { members: userId } }
    );

    const updatedProject = await db.collection("ProjectsPractica4").findOne({
        _id: new ObjectId(projectId),
    });

    return updatedProject;
}