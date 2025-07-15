import CreateUserService from './CreateUserService';
import UsersRepository from '../repositories/UsersRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import RoleEnum from '../shared/enums/Role.enum';

// Mocks
jest.mock('@config/typeorm', () => {
    // Simulando o repositório
    const mockRepo = {
        findByEmail: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };
    return {
        AppDataSource: {
            getRepository: () => ({
                extend: () => mockRepo
            }),
        },
    };
});
  
jest.mock('../repositories/UsersRepository');
jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
}));

describe('CreateUserService', () => {
    const baseUser = {
        id: 1,
        name: 'Usuário',
        lastName: 'Teste',
        email: 'user@mail.com',
        password: 'hashed123',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um usuário com role Admin', async () => {
        (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);
        (hash as jest.Mock).mockResolvedValue('hashed123');
        const AdminUser = { ...baseUser, role: RoleEnum.Admin, email: 'Admin@mail.com' };
        (UsersRepository.create as jest.Mock).mockReturnValue(AdminUser);
        (UsersRepository.save as jest.Mock).mockResolvedValue(AdminUser);

        const service = new CreateUserService();

        const result = await service.execute({
            name: 'Admin',
            lastName: 'System',
            email: 'Admin@mail.com',
            password: 'Adminpass',
            role: RoleEnum.Admin,
        });

        expect(UsersRepository.findByEmail).toHaveBeenCalledWith('Admin@mail.com');
        expect(hash).toHaveBeenCalledWith('Adminpass', 8);
        expect(UsersRepository.create).toHaveBeenCalledWith({
            name: 'Admin',
            lastName: 'System',
            email: 'Admin@mail.com',
            password: 'hashed123',
            role: RoleEnum.Admin,
        });
        expect(UsersRepository.save).toHaveBeenCalledWith(AdminUser);
        expect(result).toEqual(AdminUser);
    });

    it('deve criar um usuário com role Customer', async () => {
        (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(null);
        (hash as jest.Mock).mockResolvedValue('hashed123');
        const CustomerUser = { ...baseUser, role: RoleEnum.Customer, email: 'Customer@mail.com' };
        (UsersRepository.create as jest.Mock).mockReturnValue(CustomerUser);
        (UsersRepository.save as jest.Mock).mockResolvedValue(CustomerUser);

        const service = new CreateUserService();

        const result = await service.execute({
            name: 'Customer',
            lastName: 'Test',
            email: 'Customer@mail.com',
            password: 'cust123',
            role: RoleEnum.Customer,
        });

        expect(UsersRepository.findByEmail).toHaveBeenCalledWith('Customer@mail.com');
        expect(hash).toHaveBeenCalledWith('cust123', 8);
        expect(UsersRepository.create).toHaveBeenCalledWith({
            name: 'Customer',
            lastName: 'Test',
            email: 'Customer@mail.com',
            password: 'hashed123',
            role: RoleEnum.Customer,
        });
        expect(UsersRepository.save).toHaveBeenCalledWith(CustomerUser);
        expect(result).toEqual(CustomerUser);
    });

    it('deve lançar erro se o email já estiver cadastrado', async () => {
        (UsersRepository.findByEmail as jest.Mock).mockResolvedValue(baseUser);

        const service = new CreateUserService();

        await expect(service.execute({
            name: 'Outro',
            lastName: 'User',
            email: 'user@mail.com',
            password: '123456',
            role: RoleEnum.Admin,
        })).rejects.toBeInstanceOf(AppError);

        expect(UsersRepository.findByEmail).toHaveBeenCalledWith('user@mail.com');
        expect(hash).not.toHaveBeenCalled();
        expect(UsersRepository.create).not.toHaveBeenCalled();
        expect(UsersRepository.save).not.toHaveBeenCalled();
    });
});
