import UserService, { CreateUserPlayload, GetUserTokenPayload } from "../../services/user";

const queries = {
    hello: () => "Hello I'm GraphQL server running.",
    getUserToken: async (_:any, payload: GetUserTokenPayload) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password
        })

        return token;
    },

    getCurrentLoggedInUser: async (_:any, params:any,context:any) => {
        if(context && context?.user){
            const id = context.user.id
            const user = await UserService.getUserById(id)
            return user;
        }
        throw new Error("I don't know who are you?")
    }
}

const mutations  = {
    createUser: async(_: any,payload: CreateUserPlayload) => {
        const res = await UserService.createUser(payload);
        return res.id
    }
}

export const resolvers = { queries, mutations};