// Mocks do ProductRepository
const mockProductRepo = {
    findByName: jest.fn(),
    create: jest.fn(),
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

import CreateProductService from './CreateProductService';
import AppError from '@shared/errors/AppError';

describe('CreateProductService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const fakeProduct = {
        id: '1',
        name: 'Notebook',
        description: 'Um notebook ótimo!',
        price: 3200,
    };

    it('deve criar um novo produto se não existir', async () => {
        mockProductRepo.findByName.mockResolvedValue(null);
        mockProductRepo.create.mockReturnValue(fakeProduct);
        mockProductRepo.save.mockResolvedValue(fakeProduct);

        const service = new CreateProductService();

        const result = await service.execute({
            name: 'Notebook',
            description: 'Um notebook ótimo!',
            price: 3200,
        });

        expect(mockProductRepo.findByName).toHaveBeenCalledWith('Notebook');
        expect(mockProductRepo.create).toHaveBeenCalledWith({
            name: 'Notebook',
            description: 'Um notebook ótimo!',
            price: 3200,
        });
        expect(mockProductRepo.save).toHaveBeenCalledWith(fakeProduct);
        expect(result).toEqual(fakeProduct);
    });

    it('deve lançar erro se já existir produto com o mesmo nome', async () => {
        mockProductRepo.findByName.mockResolvedValue(fakeProduct);

        const service = new CreateProductService();

        await expect(service.execute({
            name: 'Notebook',
            description: 'Um notebook ótimo!',
            price: 3200,
        })).rejects.toBeInstanceOf(AppError);

        expect(mockProductRepo.findByName).toHaveBeenCalledWith('Notebook');
        expect(mockProductRepo.create).not.toHaveBeenCalled();
        expect(mockProductRepo.save).not.toHaveBeenCalled();
    });
});
