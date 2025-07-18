// Mock do ProductRepository
const mockProductRepo = {
    findOne: jest.fn(),
    remove: jest.fn(),
};

// Mock do TypeORM para ProductRepository
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => mockProductRepo
        }),
    },
}));

import DeleteProductService from './DeleteProductService';
import AppError from '@shared/errors/AppError';

describe('DeleteProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve remover produto se existir', async () => {
        const fakeProduct = { id: '1', name: 'Produto', description: '', price: 1000 };
        mockProductRepo.findOne.mockResolvedValue(fakeProduct);
        mockProductRepo.remove.mockResolvedValue(undefined);

        const service = new DeleteProductService();

        await expect(
            service.execute({ id: '1' })
        ).resolves.toBeUndefined();

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(mockProductRepo.remove).toHaveBeenCalledWith(fakeProduct);
    });

    it('deve lançar erro se produto não existir', async () => {
        mockProductRepo.findOne.mockResolvedValue(null);

        const service = new DeleteProductService();

        await expect(
            service.execute({ id: '2' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
        expect(mockProductRepo.remove).not.toHaveBeenCalled();
    });
});
