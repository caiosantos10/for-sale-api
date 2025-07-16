import AppError from "@shared/errors/AppError";
import UsersRepository from "../repositories/UsersRepository";
import User from "../entities/Users";

interface IRequest {
    id: string;
}

export default class FindOneUserService {
    public async execute({ id }: IRequest): Promise<User> {
        const user = await UsersRepository.findOne({ where: { id } });

        if (!user) throw new AppError('User not found.');

        return user;
    }
}