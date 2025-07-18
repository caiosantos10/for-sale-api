// Mock do ProductRepository
const mockProductRepo = {
    findOne: jest.fn(),
};

// Mock do TypeORM para ProductRepository
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => mockProductRepo
        }),
    },
}));

import FindOneProductService from './FindOneProductService';
import AppError from '@shared/errors/AppError';

describe('FindOneProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar o produto se existir', async () => {
        const fakeProduct = { id: '1', name: 'Produto', description: 'Desc', price: 123 };
        mockProductRepo.findOne.mockResolvedValue(fakeProduct);

        const service = new FindOneProductService();

        const result = await service.execute({ id: '1' });

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(result).toEqual(fakeProduct);
    });

    it('deve lançar erro se produto não existir', async () => {
        mockProductRepo.findOne.mockResolvedValue(null);

        const service = new FindOneProductService();

        await expect(
            service.execute({ id: '2' })
        ).rejects.toBeInstanceOf(AppError);

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
    });
});
