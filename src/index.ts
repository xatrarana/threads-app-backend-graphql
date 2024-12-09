import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors";

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
            
        `, // Schema
        resolvers: {
            Query: {
                hello: () => "Hey there I'm graphQl server",
                say: (_, {name} : {name: string}) =>  ` Hey ${name}. How are you?`
            },
           
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