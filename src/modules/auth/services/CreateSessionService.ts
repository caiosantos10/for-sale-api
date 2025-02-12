import AppError from "src/shared/errors/AppError";
import { compare } from "bcryptjs";
import User from "src/modules/users/entities/Users";
import UsersRepository from "src/modules/users/repositories/UsersRepository";
import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";

interface IRequest {
    email : string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

export default class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await UsersRepository.findByEmail(email);

        if (!user) throw new AppError('Incorrect email/password combination.', 401);

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) throw new AppError('Incorrect email/password combination.', 401);

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn as any,
        });

        return { user, token };
    }
}