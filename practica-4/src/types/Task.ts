import { ObjectId } from "mongodb";

export type Task = {
    _id: ObjectId;
    title: string;
    projectId: ObjectId;
    assignedTo: ObjectId;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date;
}