import QueryBuilder from "../../builder/QueryBuilder";
import { ICoupon } from "./coupon.interface";
import { Coupon } from "./coupon.model";


const createCouponCode = async (payload: ICoupon) => {

   const { code, type, value, expiry } = payload;
   if (!code || !type || !value || !expiry)  throw new Error('All fields are required');
   
   return await Coupon.create(payload);  
};

const getAllCouponCodes = async () => {
  const couponQuery = new QueryBuilder(Coupon.find(), {})
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await couponQuery.modelQuery;
  const meta = await couponQuery.countTotal();

  return {
    meta,
    result,
  };
};
const getSingleCouponCode = async (coupon: string) => {

 if (!coupon)  throw new Error('Coupon code is required');

  const result = await Coupon.findOne({ 
    code: coupon, 
    active: true
 }).lean();

 
  if (!result) {
    throw new Error('Invalid coupon code');
  }

  // Validate expiry
  if (new Date(result.expiry) < new Date()) {
    throw new Error('Coupon has expired');
  }


  // Return validated coupon data
  return {
    id: result._id,
    code: result.code,
    type: result.type,
    value: result.value
  };
}

export const CouponCodService = {
  createCouponCode,
  getAllCouponCodes,
  getSingleCouponCode,
};