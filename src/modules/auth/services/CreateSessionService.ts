import AppError from "src/shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import User from "src/modules/users/entities/Users";
import UsersRepository from "src/modules/users/repositories/UsersRepository";

interface IRequest {
    email : string;
    password: string;
}

interface IResponse {
    user: User;
}

export default class CreateSessionService {
    public async execute({ email, password }: IRequest): Promise<User> {
        const user = await UsersRepository.findByEmail(email);

        if (!user) throw new AppError('Incorrect email/password combination.', 401);

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) throw new AppError('Incorrect email/password combination.', 401);

        return user;
    }
}