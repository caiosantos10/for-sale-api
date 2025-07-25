import GetByUserCartService from './GetByUserCartService';
import { ICartRepository } from '@shared/interfaces/repositories.interface';

describe('GetByUserCartService', () => {
    const mockCartRepo: ICartRepository = {
        findOne: jest.fn(),
    } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar um carrinho pelo user_id', async () => {
        (mockCartRepo.findOne as jest.Mock).mockResolvedValue({
            id: 'cart-1',
            user_id: 'user-1',
            cartProducts: [
                {
                    product: { id: '1', name: 'Produto', price: 5, image: 'img.png' },
                    quantity: 1,
                    observations: '',
                },
            ],
        });

        const service = new GetByUserCartService(mockCartRepo);

        const result = await service.execute({ user_id: 'user-1' });

        expect(result.user_id).toBe('user-1');
        expect(result.products).toHaveLength(1);
        expect(result.products[0].name).toBe('Produto');
    });

    it('deve lançar erro se não encontrar carrinho', async () => {
        (mockCartRepo.findOne as jest.Mock).mockResolvedValue(undefined);

        const service = new GetByUserCartService(mockCartRepo);

        await expect(service.execute({ user_id: 'user-404' }))
            .rejects
            .toThrow('Cart not found.');
    });
});
