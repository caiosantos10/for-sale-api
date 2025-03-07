import AppError from "src/shared/errors/AppError"; 
import UsersRepository from "../../repositories/UsersRepository";
import UserTokensRepository from "../../repositories/UserTokensRepository";
import { hash } from "bcryptjs";

interface IRequest {
    email : string;
}

export default class SendForgotPasswordEmailService {
    public async execute({ email  }: IRequest): Promise<void> {
        const user = await UsersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User does not exists.', 400);
        }

        const token = await UserTokensRepository.generate(user.id);

        console.log(token);
    }
}