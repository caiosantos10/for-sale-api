import AppError from "@shared/errors/AppError";
import UsersRepository from "../repositories/UsersRepository";

interface IRequest {
    id: string;
}

export default class DeleteUserService {
    public async execute({ id }: IRequest): Promise<void> {
        const user = await UsersRepository.findOne({ where: { id } });

        if (!user) throw new AppError('User not found.');

        await UsersRepository.remove(user);
    }
}