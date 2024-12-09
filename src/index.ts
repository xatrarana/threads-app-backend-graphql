import express, { query } from "express";
import { expressMiddleware } from '@apollo/server/express4';
import cors from "cors";
import createApoloGraphqlServer from "./graphql";

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // middleware
    app.use(express.json());
    app.use(cors())

    

    app.get('/', (req, res) => {
        res.json({ message: "Server is running" })
    });

    // ApolloServer configuration
    const gqlServer = await createApoloGraphqlServer()
    //@ts-ignore
    app.use('/graphql',expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(`Server is running at port:${PORT}`))
}

init();