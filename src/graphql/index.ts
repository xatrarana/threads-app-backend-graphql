import { ApolloServer } from "@apollo/server";
import { prismaClient } from "../lib/db";
import {User} from './user'

async function createApoloGraphqlServer() {
    // GraphQl Server config
    const gqlServer = new ApolloServer({
        typeDefs: `

            ${User.typeDefs}
            type Query {
                ${User.queries}

            }

            type Mutation {
                ${User.mutations}
            }
            
        `, // Schema
        resolvers: {
            Query: {
                ...User.resolvers.queries
                
            },

            Mutation: {
               ...User.resolvers.mutations
            }
           
        }  // folding logic
        ,
        


    });

    // start gqlServer
    await gqlServer.start();

    return gqlServer;
}


export default createApoloGraphqlServer;