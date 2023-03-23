export interface ClientDocument {
    _id?: string;
    agencyId:string;
    name: string;
    email: string;
    phoneNumber: string;
    totalBill: number;
    createdAt?: Date;
    updatedAt?: Date;
}
