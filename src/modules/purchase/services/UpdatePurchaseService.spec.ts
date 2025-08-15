import UpdatePurchaseService from './UpdatePurchaseService';
import AppError from '@shared/errors/AppError';

jest.mock('../repositories/PurchaseRepository', () => {
    const mock = {
        findOne: jest.fn(),
        save: jest.fn(),
    };
    return { ...mock, default: mock };
});

import PurchaseRepository from '../repositories/PurchaseRepository';
import PurchaseStatus from '../utils/purchaseStatus.enum';

describe('UpdatePurchaseService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('atualiza o status da compra (fluxo feliz)', async () => {
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValue({
            id: 'pur-1',
            status: PurchaseStatus.CREATED,
            user: { id: 'user-1' },
        });
        (PurchaseRepository.save as jest.Mock).mockImplementation(async (p: any) => p);

        const service = new UpdatePurchaseService();
        const result = await service.execute({
            id: 'pur-1',
            userId: 'user-1',
            status: PurchaseStatus.DELIVERED,
        });

        expect(PurchaseRepository.findOne).toHaveBeenCalledWith({
            where: { id: 'pur-1', user: { id: 'user-1' } },
        });
        expect(PurchaseRepository.save).toHaveBeenCalledWith({
            id: 'pur-1',
            status: PurchaseStatus.DELIVERED,
            user: { id: 'user-1' },
        });
        expect(result.status).toBe(PurchaseStatus.DELIVERED);
    });

    it('lança AppError quando a compra não é encontrada', async () => {
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValue(null);

        const service = new UpdatePurchaseService();

        expect.assertions(2);
        try {
            await service.execute({
                id: 'not-found',
                userId: 'user-1',
                status: PurchaseStatus.GETTING_READY,
            });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Purchase not found.');
        }
    });

    it('lança AppError para status inválido', async () => {
        (PurchaseRepository.findOne as jest.Mock).mockResolvedValue({
            id: 'pur-1',
            status: PurchaseStatus.CREATED,
            user: { id: 'user-1' },
        });

        const service = new UpdatePurchaseService();

        expect.assertions(2);
        try {
            await service.execute({
                id: 'pur-1',
                userId: 'user-1',
                status: 'INVALID' as any,
            });
        } catch (err: any) {
            expect(err).toBeInstanceOf(AppError);
            expect(err.message).toBe('Invalid status.');
        }
    });

    it('isValidPurchaseStatus: true para valores do enum, false para outros', () => {
        const service = new UpdatePurchaseService();
        expect(service.isValidPurchaseStatus(PurchaseStatus.CREATED)).toBe(true);
        expect(service.isValidPurchaseStatus(PurchaseStatus.OUT_FOR_DELIVERY)).toBe(true);
        expect(service.isValidPurchaseStatus('ANYTHING_ELSE' as any)).toBe(false);
    });
});
