import AppError from "src/shared/errors/AppError";
import UsersRepository from "../repositories/UsersRepository";
import User from "../entities/Users";
import RoleEnum from "../shared/enums/Role.enum";

interface IRequest {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleEnum;
}

export default class UpdateUserService {
    public async execute({ id, name, lastName, email, password, role }: IRequest): Promise<User> {
        const user = await UsersRepository.findOne({ where: { id } });

        if (!user) throw new AppError('User not found.');

        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.password = password;
        user.role = role;

        await UsersRepository.save(user);

        return user;
    }
}