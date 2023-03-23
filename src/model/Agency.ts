export interface AgencyDocument {
    _id: string;
    name: string;
    address_1: string;
    address_2?: string;
    state: string;
    city: string;
    phoneNumber: string;
    createdAt?: Date;
    updatedAt?: Date;
}
