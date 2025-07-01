import { PageList } from "@shared/interfaces/page-list.interface";
import User from "../entities/Users";
import UsersRepository from "../repositories/UsersRepository";
import RoleEnum from "../shared/enums/Role.enum";
import AppError from "@shared/errors/AppError";

interface IRequest {
    page: number;
    perPage: number;
    name?: string;
    lastName?: string;
    email?: string;
    role?: RoleEnum
}

export default class ListUsersService {
    public async execute({ page, perPage, name, lastName, email, role }: IRequest): Promise<PageList<User>> {
        if (role && !Object.values(RoleEnum).includes(role)) {
            throw new AppError('Invalid role value', 400);
        }

        const query = UsersRepository.createQueryBuilder("users");
        if (name) {
            query.andWhere("users.name ILIKE :name", { name: `%${name}%` });
        }
        if (lastName) {
            query.andWhere("users.lastName ILIKE :lastName", { lastName: `%${lastName}%` });
        }
        if (email) {
            query.andWhere("users.email ILIKE :email", { email: `%${email}%` });
        }
        if (role) {
            query.andWhere("users.role = :role", { role });
        }

        query.orderBy("users.name", "ASC");
        query.skip((page - 1) * perPage).take(perPage);

        const [users, total] = await query.getManyAndCount();
        
        return {
            data: users,
            total,
            page,
            lastPage: Math.ceil(total / perPage),
        };
    }
}