import AppError from "src/shared/errors/AppError"; 
import UsersRepository from "../../repositories/UsersRepository";
import UserTokensRepository from "../../repositories/UserTokensRepository";
import { hash } from "bcryptjs";
import { addHours, isAfter } from "date-fns";

interface IRequest {
    token : string;
    password : string;
}

export default class ResetPasswordService {
    public async execute({ token, password  }: IRequest): Promise<void> {
        const userToken = await UserTokensRepository.findByToken(token);
        if (!userToken) {
            throw new AppError('User Token does not exists.', 400);
        }

        const user = await UsersRepository.findOne({ where: { id: userToken.user_id } });
        if (!user) {
            throw new AppError('User does not exists.', 400);
        }

        const compareDate = addHours(userToken.created_at, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired.', 401);
        }

        user.password = await hash(password, 8);
        
        UserTokensRepository.save(user);
    }
}