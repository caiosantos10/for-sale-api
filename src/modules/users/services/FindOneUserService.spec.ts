const mockRepo = {
    findOne: jest.fn(),
};
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: () => ({
            extend: () => mockRepo
        }),
    },
}));

import FindOneUserService from './FindOneUserService';
import AppError from '@shared/errors/AppError';

describe('FindOneUserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar um usuário existente', async () => {
        const fakeUser = { id: '321', name: 'Test', email: 'test@test.com' };
        mockRepo.findOne.mockResolvedValue(fakeUser);

        const service = new FindOneUserService();

        const result = await service.execute({ id: '321' });

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: '321' } });
        expect(result).toBe(fakeUser);
    });

    it('deve lançar erro se usuário não for encontrado', async () => {
        mockRepo.findOne.mockResolvedValue(null);

        const service = new FindOneUserService();

        await expect(
            service.execute({ id: 'notfound' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 'notfound' } });
    });
});
