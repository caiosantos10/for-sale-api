import { PaymentMethodDTO } from "@modules/users/utils/users.dto";

interface ProductResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    observations: string;
}

export interface PurchaseResponseDTO {
    id: string;
    user_id: string;
    products: ProductResponseDTO[];
    status: string;
    delivery_address: string;
    payment_method: PaymentMethodDTO
}

export interface ProductsRequestDTO {
    id: string;
    quantity?: number;
    observations?: string;
}
