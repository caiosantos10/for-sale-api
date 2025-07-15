import ListUsersService from '../services/ListUsersService';
import UsersRepository from '../repositories/UsersRepository';
import RoleEnum from '../shared/enums/Role.enum';
import AppError from '@shared/errors/AppError';

// Mock para QueryBuilder do TypeORM
const mockQueryBuilder: any = {
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
};

// Mock estático para o UsersRepository
jest.mock('../repositories/UsersRepository', () => ({
    createQueryBuilder: jest.fn(),
}));

describe('ListUsersService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (UsersRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
    });

    it('deve listar usuários paginados', async () => {
        const users = [
            { id: 1, name: 'User', lastName: 'Test', email: 'test@mail.com' }
        ];
        mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([users, 1]);

        const service = new ListUsersService();
        const result = await service.execute({ page: 1, perPage: 10 });

        expect(result.data).toEqual(users);
        expect(result.total).toBe(1);
        expect(UsersRepository.createQueryBuilder).toHaveBeenCalledWith('users');
    });

    it('deve aplicar filtros quando fornecidos', async () => {
        mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);

        const service = new ListUsersService();
        await service.execute({ page: 1, perPage: 10, name: 'Caio', email: 'caio@' });

        expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
        expect(UsersRepository.createQueryBuilder).toHaveBeenCalledWith('users');
    });

    it('deve lançar erro para role inválido', async () => {
        const service = new ListUsersService();

        await expect(
            service.execute({ page: 1, perPage: 10, role: 'papagaio' as RoleEnum })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('deve listar sem filtros opcionais', async () => {
        mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);
        const service = new ListUsersService();
        const result = await service.execute({ page: 1, perPage: 10 });
        expect(result.data).toEqual([]);
        expect(result.total).toBe(0);
    });
});
