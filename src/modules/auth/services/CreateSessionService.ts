import AppError from "src/shared/errors/AppError";
import { compare } from "bcryptjs";
import UsersRepository from "src/modules/users/repositories/UsersRepository";
import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";
import { AuthResponse } from "../utils/Session.interface";

interface IRequest {
    email : string;
    password: string;
}

export default class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<AuthResponse> {
        const user = await UsersRepository.findByEmail(email);

        if (!user) throw new AppError('Incorrect email/password combination.', 401);

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) throw new AppError('Incorrect email/password combination.', 401);

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn as any,
        });

        const userResponse: AuthResponse = {
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            token
        }

        return userResponse;
    }
}