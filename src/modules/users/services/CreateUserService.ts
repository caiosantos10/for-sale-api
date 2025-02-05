import AppError from "src/shared/errors/AppError";
import User from "../entities/Users";
import UsersRepository from "../repositories/UsersRepository";
import RoleEnum from "../shared/enums/Role.enum";

interface IRequest {
    name: string;
    lastName: string
    email : string;
    password: string;
    role: RoleEnum;
}

export default class CreateUserService {
    public async execute({ name, lastName, email, password, role }: IRequest): Promise<User> {
        const userExists = await UsersRepository.findByEmail(email);

        if (userExists) throw new AppError('There is already one User with this email.');

        const user = UsersRepository.create({
            name,
            lastName,
            email,
            password,
            role
        });

        await UsersRepository.save(user);

        return user;
    }
}