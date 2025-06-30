import { Model, Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TAddress = {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export type TCustomer = {
  id: string;
  user: Types.ObjectId;
  designation?: string;
  name: TUserName;
  gender?: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo?: string;
  emergencyContactNo?: string;
  bloodGroup?: TBloodGroup;
  presentAddress?: string;
  permanentAddress?: string;
  shippingAddress?: TAddress;
  billingAddress?: TAddress;
  profileImg?: string;
  isDeleted: boolean;
};

export interface CustomerModel extends Model<TCustomer> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TCustomer | null>;
}
