export const queries = `#graphql
    hello: String
    getUserToken(email: String!, password: String!): String
    getCurrentLoggedInUser: User
`