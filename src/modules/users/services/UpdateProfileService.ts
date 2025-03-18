import AppError from "src/shared/errors/AppError";
import UsersRepository from "../repositories/UsersRepository";
import User from "../entities/Users";
import { compare } from "bcryptjs";

interface IRequest {
    id: string;
    name: string;
    email: string;
    old_password: string;
    new_password: string;
}

export default class UpdateProfileService {
    public async execute({
        id,
        name,
        email,
        old_password,
        new_password,
    }: IRequest): Promise<User> {
        const user = await UsersRepository.findOne({ where: { id } });
        
        if (!user) throw new AppError('User not found.', 400);
        
        const userByEmail = await UsersRepository.findByEmail(email);

        if (!userByEmail) throw new AppError('User not found.', 400);

        if (userByEmail && userByEmail.id !== user.id) {
            throw new AppError('There already one user with this email.', 400);
        }

        if (new_password && !old_password) {
            throw new AppError('Old old_password is required', 400);
        }

        if (old_password && new_password) {
            const checkPassword = compare(old_password, user.password);

            if (!checkPassword) throw new AppError('Old password does not match', 400);

            user.password = new_password;
        }

        user.name = name;
        user.email = email;

        await UsersRepository.save(user);

        return user;
    }
}