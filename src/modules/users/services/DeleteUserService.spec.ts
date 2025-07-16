// Mock TypeORM ANTES de imports!
const mockRepo = {
    findOne: jest.fn(),
    remove: jest.fn(),
};
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: () => ({
            extend: () => mockRepo
        }),
    },
}));

import DeleteUserService from './DeleteUserService';
import AppError from '@shared/errors/AppError';

describe('DeleteUserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve deletar um usuário existente', async () => {
        const fakeUser = { id: '123', name: 'Test' };
        mockRepo.findOne.mockResolvedValue(fakeUser);
        mockRepo.remove.mockResolvedValue(undefined);

        const service = new DeleteUserService();

        await expect(
            service.execute({ id: '123' })
        ).resolves.toBeUndefined();

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
        expect(mockRepo.remove).toHaveBeenCalledWith(fakeUser);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
        mockRepo.findOne.mockResolvedValue(null);

        const service = new DeleteUserService();

        await expect(
            service.execute({ id: 'notfound' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'notfound' } });
        expect(mockRepo.remove).not.toHaveBeenCalled();
    });
});
