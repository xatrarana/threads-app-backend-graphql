import { prismaClient } from "../lib/db";
import {createHmac, randomBytes} from "node:crypto"
import JWT from 'jsonwebtoken'
export interface CreateUserPlayload {
    firstName: string
    lastName: string
    email: string
    password: string
}


export interface GetUserTokenPayload {
    email: string
    password: string
}

class UserService {

    private static generateHash(salt: string, password: string) {
        return createHmac("sha256",salt).update(password).digest('hex');
    }

    public static createUser(payload: CreateUserPlayload) {
        const {firstName,lastName,email,password} = payload;

        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt,password)
        return prismaClient.user.create({
            data: {
                firstName,
                lastName,
                email,
                password:hashedPassword,
                salt
            }
        })
    }

    public static getUserById(id:string) {
        return prismaClient.user.findUnique({where: {id}})
    }

    private static getUserByEmail(email: string) {
        return prismaClient.user.findUnique({where:{email}})
    }
    public static async getUserToken(payload: GetUserTokenPayload) {
        const {email,password} = payload;

        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error("user not found.");


        const userSalt = user.salt
        const userHashedPassword = UserService.generateHash(userSalt,password)

        if(userHashedPassword !== user.password) throw new Error('Invalid credentials.')

            // gen token

        const token = JWT.sign({id: user.id, email: user.email},process.env.SECRECT || '');
        return token;
    }

    public static decodeJWTToken(token: string){
        return JWT.verify(token,process.env.SECRECT || '')
    }
}


export default UserService;