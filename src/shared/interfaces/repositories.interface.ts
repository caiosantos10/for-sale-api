export interface ICartRepository {
    findOne(...args: any[]): Promise<any>;
    create(...args: any[]): any;
    save(...args: any[]): Promise<void>;
    remove(...args: any[]): Promise<void>;
}

export interface IProductRepository {
    findBy(...args: any[]): Promise<any>;
}

export interface ICartProductsRepository {
    create(...args: any[]): any;
    save(...args: any[]): Promise<any>;
    findBy(...args: any[]): Promise<any>;
    remove(...args: any[]): void;
} 