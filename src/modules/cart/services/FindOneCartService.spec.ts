import FindOneCartService from './FindOneCartService';
import { ICartRepository } from '@shared/interfaces/repositories.interface';

describe('FindOneCartService', () => {
    const mockCartRepo: ICartRepository = {
        findOne: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar um carrinho com produtos', async () => {
        (mockCartRepo.findOne as jest.Mock).mockResolvedValue({
            id: '123',
            user_id: 'user-1',
            cartProducts: [
                {
                    product: { id: 'prod-1', name: 'Produto 1', price: 10, image: 'img.png' },
                    quantity: 1,
                    observations: '',
                },
            ],
        });

        const service = new FindOneCartService(mockCartRepo);

        const result = await service.execute({ id: '123' });

        expect(result.id).toBe('123');
        expect(result.products).toHaveLength(1);
        expect(result.products[0].name).toBe('Produto 1');
    });

    it('deve lançar erro se o carrinho não existir', async () => {
        (mockCartRepo.findOne as jest.Mock).mockResolvedValue(undefined);

        const service = new FindOneCartService(mockCartRepo);

        await expect(service.execute({ id: 'not-found' }))
            .rejects
            .toThrow('Cart not found.');
    });
});
