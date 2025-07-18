// Mock do ProductRepository
const mockProductRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
};

// Mock do TypeORM para ProductRepository
jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => mockProductRepo
        }),
    },
}));

import UpdateProductService from './UpdateProductService';
import AppError from '@shared/errors/AppError';

describe('UpdateProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve atualizar o produto se existir', async () => {
        const fakeProduct = { id: '1', name: 'Antigo', description: 'Desc', price: 10 };
        const updatedProduct = { id: '1', name: 'Novo', description: 'Nova Desc', price: 100 };
        mockProductRepo.findOne.mockResolvedValue({ ...fakeProduct });
        mockProductRepo.save.mockResolvedValue({ ...updatedProduct });

        const service = new UpdateProductService();

        const result = await service.execute({
            id: '1',
            name: 'Novo',
            description: 'Nova Desc',
            price: 100,
        });

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(mockProductRepo.save).toHaveBeenCalledWith({
            ...fakeProduct,
            name: 'Novo',
            description: 'Nova Desc',
            price: 100,
        });
        expect(result).toEqual(updatedProduct);
    });

    it('deve lançar erro se produto não existir', async () => {
        mockProductRepo.findOne.mockResolvedValue(null);

        const service = new UpdateProductService();

        await expect(service.execute({
            id: '2',
            name: 'X',
            description: 'Y',
            price: 1,
        })).rejects.toBeInstanceOf(AppError);

        expect(mockProductRepo.findOne).toHaveBeenCalledWith({ where: { id: '2' } });
        expect(mockProductRepo.save).not.toHaveBeenCalled();
    });
});
