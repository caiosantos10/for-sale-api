import AppError from '@shared/errors/AppError';
import CreatePurchaseService from './CreatePurchaseService';

jest.mock('../repositories/PurchaseRepository', () => {
    const mock = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('../repositories/PurchaseProductsRepository', () => {
    const mock = {
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('@modules/cart/repositories/CartRepository', () => {
    const mock = {
        findByUser: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('@modules/users/repositories/UsersRepository', () => {
    const mock = {
        findOne: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('../repositories/PaymentMethodsRepository', () => {
    const mock = {
        create: jest.fn(),
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

import PurchaseRepository from '../repositories/PurchaseRepository';
import PurchaseProductsRepository from '../repositories/PurchaseProductsRepository';
import CartRepository from '@modules/cart/repositories/CartRepository';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import PaymentMethodsRepository from '../repositories/PaymentMethodsRepository';

describe('CreatePurchaseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('cria uma compra a partir do carrinho (fluxo feliz)', async () => {
        const user_id = 'user-123';
        const input = {
            user_id,
            delivery_address: {
                street: 'Rua A',
                number: '123',
                city: 'Cidade',
                state: 'ST',
                zip_code: '00000-000',
            },
            payment_method: {
                method: 'CARD',
                installments: 3,
                cardBrand: 'VISA',
            },
        };

        // 1) Carrinho existe
        (CartRepository.findByUser as jest.Mock).mockResolvedValueOnce({ id: 'cart-1' });

        // 2) Usuário encontrado (service chama, não usa)
        (UsersRepository.findOne as jest.Mock).mockResolvedValueOnce({ id: user_id });

        // 3) PurchaseRepository.create/save
        const expectedAddress = 'Rua A,  123, Cidade, ST, 00000-000'; // espaço duplo após a vírgula
        (PurchaseRepository.create as jest.Mock).mockImplementation((data: any) => ({
            id: 'purchase-1',
            status: 'PENDING',
            delivery_address: data.delivery_address,
            user: data.user,
        }));
        (PurchaseRepository.save as jest.Mock).mockImplementation(async (p: any) => p);

        // 4) PaymentMethodsRepository.create/save
        (PaymentMethodsRepository.create as jest.Mock).mockImplementation((data: any) => ({
            id: 'pay-1',
            ...data,
        }));
        (PaymentMethodsRepository.save as jest.Mock).mockImplementation(async (p: any) => p);

        // 5) Carrinho completo com itens
        (CartRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id: 'cart-1',
            cartProducts: [
                {
                    product: { id: 'prod-1', name: 'Produto 1', price: 25, image: 'img.png' },
                    quantity: 3,
                    observations: 'sem cebola',
                },
            ],
        });

        // 6) Salvar purchaseProducts
        (PurchaseProductsRepository.save as jest.Mock).mockResolvedValueOnce(undefined);

        // 7) Purchase completa com produtos
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id: 'purchase-1',
            purchaseProducts: [
                {
                    product: { id: 'prod-1', name: 'Produto 1', price: 25, image: 'img.png' },
                    quantity: 3,
                    observations: 'sem cebola',
                },
            ],
        });

        const service = new CreatePurchaseService();
        const result = await service.execute(input);

        expect(CartRepository.findByUser).toHaveBeenCalledWith(user_id);
        expect(PurchaseRepository.create).toHaveBeenCalledWith({
            delivery_address: expectedAddress,
            user: { id: user_id },
        });
        expect(PurchaseRepository.save).toHaveBeenCalled();
        expect(PaymentMethodsRepository.create).toHaveBeenCalledWith({
            method: input.payment_method.method,
            installments: input.payment_method.installments,
            card_brand: input.payment_method.cardBrand,
            purchase_id: 'purchase-1',
        });
        expect(PaymentMethodsRepository.save).toHaveBeenCalled();
        expect(PurchaseProductsRepository.save).toHaveBeenCalledWith([
            {
                product_id: 'prod-1',
                purchase_id: 'purchase-1',
                quantity: 3,
                observations: 'sem cebola',
            },
        ]);
        expect(PurchaseRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'purchase-1' },
            relations: ['purchaseProducts', 'purchaseProducts.product'],
        });
        expect(CartRepository.remove).toHaveBeenCalledWith({ id: 'cart-1' });

        // Estrutura do DTO de resposta
        expect(result).toEqual({
            id: 'purchase-1',
            user_id,
            products: [
                {
                    id: 'prod-1',
                    name: 'Produto 1',
                    description: 'Produto 1',
                    price: 25,
                    image: 'img.png',
                    quantity: 3,
                    observations: 'sem cebola',
                },
            ],
            status: 'PENDING',
            delivery_address: expectedAddress,
            payment_method: {
                installments: 3,
                method: 'CARD',
                cardBrand: 'VISA',
            },
        });
    });

    it('lança AppError quando o carrinho não existe', async () => {
        (CartRepository.findByUser as jest.Mock).mockResolvedValueOnce(null);

        const service = new CreatePurchaseService();
        await expect(
            service.execute({
                user_id: 'user-123',
                delivery_address: {
                    street: 'Rua A',
                    number: '123',
                    city: 'Cidade',
                    state: 'ST',
                    zip_code: '00000-000',
                },
                payment_method: { method: 'CARD', installments: 1, cardBrand: 'VISA' },
            })
        ).rejects.toEqual(new AppError('Cart not found', 404));
    });
});
