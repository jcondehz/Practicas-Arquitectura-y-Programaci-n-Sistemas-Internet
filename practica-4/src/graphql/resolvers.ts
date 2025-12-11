import { IResolvers } from "@graphql-tools/utils";
import {
    addMembersToProject,
    createProject,
    createUser,
    returnProjects,
    returnUsers,
    tasksByProject,
    validateUser,
} from "../collection/projectsCollection";
import { signToken } from "../db/auth";
import { Project } from "../types/Project";

const collectionUser = "UsersPractica4";
const collectionProject = "ProjectsPractica4";

export const resolvers: IResolvers = {
    Query: {
        myProjects: async (_, __, { user }) => {
            if (!user || !user._id) {
                throw new Error("No autorizado");
            }

            return await returnProjects(user._id);
        },
        projectDetails: async (_,{ id }) => {
            const result = await returnProjects(id);
            return result;
        },
        users: async() => {
            const result = await returnUsers();
            return result;
        }

        
    },

    Mutation: {
        registerUser: async (
            _,
            { input }: {
                input: { username: string; email: string; password: string };
            },
        ) => {
            const userId = await createUser(
                input.username,
                input.email,
                input.password,
            );
            return signToken(userId.toString());
        },
        login: async (
            _,
            { input }: { input: { email: string; password: string } },
        ) => {
            const user = await validateUser(input.email, input.password);
            if (!user) throw new Error("Invalid credentials");
            return signToken(user._id.toString());
        },
        createProject: async (_, {input}: {input:{name:string,description:string,startDate:string,endDate:string}}, {user} ) => {
            
            if(!user || !user._id){
                throw new Error("No autorizado");
            }

            const project = await createProject(
                input.name,
                input.description,
                input.startDate,
                input.endDate,
                user._id
            );
            return project;
        },
        addMemberToProject: async (_, {projectId, userId}, {user}) => {
            if (!user || !user._id) {
                throw new Error("No autorizado");
            }
            const project = await addMembersToProject(projectId, userId);
            return project;
        },
    },

    Project: {
        ownerId: (project) => project.owner,
        tasks: async (parent) => {
            return tasksByProject(parent._id.toString());
        }

    }
};
