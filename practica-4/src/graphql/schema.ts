import { gql } from "apollo-server";

export const typeDefs = gql`
    type User{
        _id: ID!
        username: String!
        email: String!
        createdAt: String!
    }

    type Project{
        _id: ID!
        name: String!
        description: String!
        startDate: String!
        endDate: String!
        ownerId: ID!
        members: [User]
        tasks: [Task]!
    }

    type Task{
        _id: ID!
        title: String!
        projectId: ID!
        assignedTo: ID!
        status: String!
        priority: String!
        dueDate: String!
    }

    input RegisterInput{
        email: String!
        username: String!
        password: String!
    }

    input LoginInput{
        email: String!
        password: String!
    }

    input CreateProjectInput{
        name: String!
        description: String!
        startDate: String!
        endDate: String!
    }

    input UpdateTaskInput{
        title: String
    }

    input TaskInput{
        title: String!
    }

    input UpdateProjectInput{
        name: String
        description: String
        startDate: String
        endDate: String
    }
    
    type Query{
        myProjects: [Project]
        projectDetails(projectId: ID!): Project
        users: [User]
    }

    type Mutation{
        registerUser(input: RegisterInput!): String!
        login(input: LoginInput!): String
        createProject(input: CreateProjectInput!): Project
        updateProject(id: ID!, input: UpdateProjectInput!): Project
        addMemberToProject(projectId: ID!, userId: ID!): Project
        createTask(projectId: ID!, input: TaskInput!): Task
        updateTaskStatus(taskId: ID!): Task
        deleteProject(id: ID!): Boolean
    }
`;