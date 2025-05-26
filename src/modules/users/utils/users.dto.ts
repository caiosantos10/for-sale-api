import RoleEnum from "../shared/enums/Role.enum";

export interface UpdateUserDTO {
    id: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleEnum;
    addresses: Array<AddressDTO>;
}

export interface AddressDTO {
    id?: string;
    street: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
}