// Mock do QueryBuilder
const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
};

// Mock do ProductRepository
const mockProductRepo = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

jest.mock('@config/typeorm', () => ({
    AppDataSource: {
        getRepository: (entity: any) => ({
            extend: () => mockProductRepo
        }),
    },
}));

import ListProductsService from './ListProductsService';

describe('ListProductsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve listar produtos sem filtros', async () => {
        const fakeProducts = [
            { id: '1', name: 'Produto A', description: 'A', price: 10 },
            { id: '2', name: 'Produto B', description: 'B', price: 20 },
        ];
        mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([fakeProducts, 2]);

        const service = new ListProductsService();

        const result = await service.execute({ page: 1, perPage: 10 });

        expect(mockProductRepo.createQueryBuilder).toHaveBeenCalledWith('product');
        expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('product.name', 'ASC');
        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
        expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
        expect(result).toEqual({
            data: fakeProducts,
            total: 2,
            page: 1,
            lastPage: 1,
        });
    });

    it('deve aplicar filtro de nome e descrição', async () => {
        mockQueryBuilder.getManyAndCount.mockResolvedValueOnce([[], 0]);

        const service = new ListProductsService();

        await service.execute({
            page: 2,
            perPage: 5,
            name: 'Test',
            description: 'Desc',
        });

        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            "product.name ILIKE :name",
            { name: '%Test%' }
        );
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
            "product.description ILIKE :description",
            { description: '%Desc%' }
        );
        expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
        expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });
});
