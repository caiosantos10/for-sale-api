import FindOnePurchaseService from './FindOnePurchaseService';
import AppError from '@shared/errors/AppError';

jest.mock('../repositories/PurchaseRepository', () => {
    const mock = {
        findOne: jest.fn(),
    };
    return { ...mock, default: mock };
});

jest.mock('../repositories/PaymentMethodsRepository', () => {
    const mock = {
        findByPurchaseId: jest.fn(),
    };
    return { ...mock, default: mock };
});

import PurchaseRepository from '../repositories/PurchaseRepository';
import PaymentMethodsRepository from '../repositories/PaymentMethodsRepository';

describe('FindOnePurchaseService', () => {
    const id = 'purchase-1';
    const userId = 'user-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna a compra com produtos e método de pagamento (fluxo feliz)', async () => {
        // purchase completa com relacionamentos
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValueOnce({
            id,
            status: 'PENDING',
            delivery_address: 'Rua X,  100, Cidade, ST, 00000-000',
            purchaseProducts: [
                {
                    product: {
                        id: 'prod-1',
                        name: 'Produto 1',
                        price: 50,
                        image: 'img.png',
                    },
                    quantity: 2,
                    observations: 'sem cebola',
                },
            ],
        });

        // payment method encontrado
        (PaymentMethodsRepository.findByPurchaseId as jest.Mock).mockResolvedValueOnce({
            installments: 3,
            method: 'CARD',
            card_brand: 'VISA',
        });

        const service = new FindOnePurchaseService();
        const result = await service.execute({ id, userId });

        // verificação das chamadas com filtros e relations
        expect(PurchaseRepository.findOne).toHaveBeenCalledWith({
            where: { id, user: { id: userId } },
            relations: ['user', 'purchaseProducts', 'purchaseProducts.product', 'paymentMethod'],
        });
        expect(PaymentMethodsRepository.findByPurchaseId).toHaveBeenCalledWith(id);

        // DTO final
        expect(result).toEqual({
            id,
            user_id: userId,
            products: [
                {
                    id: 'prod-1',
                    name: 'Produto 1',
                    description: 'Produto 1',
                    price: 50,
                    image: 'img.png',
                    quantity: 2,
                    observations: 'sem cebola',
                },
            ],
            status: 'PENDING',
            delivery_address: 'Rua X,  100, Cidade, ST, 00000-000',
            payment_method: {
                installments: 3,
                method: 'CARD',
                cardBrand: 'VISA',
            },
        });
    });

    it('lança AppError quando a compra não é encontrada', async () => {
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

        const service = new FindOnePurchaseService();

        await expect(service.execute({ id, userId }))
            .rejects.toBeInstanceOf(AppError);

        await expect(service.execute({ id, userId }))
            .rejects.toHaveProperty('message', 'Purchase not found.');
    });

    it('lança AppError quando o método de pagamento não é encontrado', async () => {
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValue({
            id,
            status: 'PENDING',
            delivery_address: 'Rua X,  100, Cidade, ST, 00000-000',
            purchaseProducts: [],
        });
        (PaymentMethodsRepository.findByPurchaseId as jest.Mock).mockResolvedValue(null);

        const service = new FindOnePurchaseService();

        expect.assertions(2);
        try {
            await service.execute({ id, userId });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Payment Method not found or invalid.');
        }
    });  
});
