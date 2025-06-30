export type ICoupon = {
    _id?: string;
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    active: boolean;
    expiry: Date;
    createdAt?: Date;
    updatedAt?: Date;
  };
  