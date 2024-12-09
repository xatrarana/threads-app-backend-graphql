import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors";
import { prismaClient } from "./lib/db";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // middleware
    app.use(express.json());
    app.use(cors())

    // GraphQl Server config
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name:String): String
            }


            type Mutation {
                createUser(
                    firstName: String!,
                    lastName: String!,
                    email: String!,
                    password: String!
                ): Boolean
            }
            
        `, // Schema
        resolvers: {
            Query: {
                hello: () => "Hey there I'm graphQl server",
                say: (_, {name} : {name: string}) =>  ` Hey ${name}. How are you?`
            },

            Mutation: {
                createUser: async(_,{
                    firstName,lastName,email,password
                }:{
                    firstName: string, lastName: string, email: string, password: string
                }) => {
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt:"random_salt"
                        }
                    })

                    return true;
                }
            }
           
        }  // folding logic



    });

    // start gqlServer
    await gqlServer.start();

    app.get('/', (req, res) => {
        res.json({ message: "Server is running" })
    });

    //@ts-ignore
    app.use('/graphql',expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(`Server is running at port:${PORT}`))
}

init();