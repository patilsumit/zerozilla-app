export interface UserDocument  {
    _id:string;
    firstName:string;
    lastName:string;
    email: string;
    address:string;
    password?: string;
    roleName?: string;
    status?:string;
    isDeleted?:boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  