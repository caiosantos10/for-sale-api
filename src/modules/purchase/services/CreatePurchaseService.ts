import AppError from "src/shared/errors/AppError";
import { PurchaseResponseDTO } from "../utils/purchase.dto";
import PurchaseRepository from "../repositories/PurchaseRepository";
import PurchaseProductsRepository from "../repositories/PurchaseProductsRepository";
import CartRepository from "@modules/cart/repositories/CartRepository";
import { AddressDTO, PaymentMethodDTO } from "@modules/users/utils/users.dto";
import PaymentMethodsRepository from "../repositories/PaymentMethodsRepository";
import UsersRepository from "@modules/users/repositories/UsersRepository";

interface IRequest {
    user_id: string;
    delivery_address: AddressDTO;
    payment_method: PaymentMethodDTO;
}

export default class CreatePurchaseService {
    public async execute({ user_id, delivery_address, payment_method }: IRequest): Promise<PurchaseResponseDTO> {
        const cartExists = await CartRepository.findByUser(user_id);
        if (!cartExists) {
            throw new AppError('Cart not found', 404);
        }

        const user = await UsersRepository.findOne({ where: { id: user_id } });
        
        const purchase = PurchaseRepository.create({
            delivery_address: this.addressToString(delivery_address),
            user: { id: user_id }
        });
        await PurchaseRepository.save(purchase);

        const payment = PaymentMethodsRepository.create({
            method: payment_method.method,
            installments: payment_method.installments,
            card_brand: payment_method.cardBrand,
            purchase_id: purchase.id
        })
        await PaymentMethodsRepository.save(payment);

        const cart = await CartRepository.findOne({
            where: { id: cartExists.id },
            relations: ['cartProducts', 'cartProducts.product']
        });


        // Create a PurchaseProducts for each Product 
        const purchaseProducts = cart!.cartProducts.map(cartProduct => ({
            product_id: cartProduct.product.id,
            purchase_id: purchase.id,
            quantity: cartProduct.quantity,
            observations: cartProduct.observations,
        }));

        await PurchaseProductsRepository.save(purchaseProducts);

        // Get the whole Purchase with Products attached
        const purchaseComplete = await PurchaseRepository.findOne({
            where: { id: purchase.id },
            relations: ['purchaseProducts', 'purchaseProducts.product'],
        });

        const purchaseResponse: PurchaseResponseDTO = {
            id: purchase.id,
            user_id,
            products: purchaseComplete?.purchaseProducts.map(purchaseProduct => ({
                id: purchaseProduct.product.id,
                name: purchaseProduct.product.name,
                description: purchaseProduct.product.name,
                price: purchaseProduct.product.price,
                image: purchaseProduct.product.image,
                quantity: purchaseProduct.quantity,
                observations: purchaseProduct.observations,
            })) ?? [],
            status: purchase.status,
            delivery_address: purchase.delivery_address,
            payment_method: {
                installments: payment.installments,
                method: payment.method,
                cardBrand: payment.card_brand
            }
        };
        
        await CartRepository.remove(cartExists);

        return purchaseResponse;

    }

    private addressToString(address: AddressDTO): string {
        return `${address.street},  ${address.number}, ${address.city}, ${address.state}, ${address.zip_code}`;
    }
}