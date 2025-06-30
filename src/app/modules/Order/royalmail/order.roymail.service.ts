/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import config from '../../../config';
import { IOrder, RoyalMailEntry } from '../order.interface';
import { Customer } from '../../Customer/customer.model';
import { User } from '../../User/user.model';
import { Order } from '../order.model';


function createShippingRequest(customer:any, orderInfo: any) {
  const shippingAddress = customer.shippingAddress;

  const recipient = {
    address: {
      fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      addressLine1: shippingAddress.address,
      addressLine2: shippingAddress.apartment || '',
      addressLine3: '',
      city: shippingAddress.city,
      county: shippingAddress.state,
      postcode: shippingAddress.postalCode,
      countryCode: 'GBR', // Hardcoded, but can be dynamic if you map country to ISO codes
    },
    phoneNumber: shippingAddress.phone,
    emailAddress: customer.email,
  };

  const contents = orderInfo.items.map((item:any) => ({
    name: item?.name,
    quantity: item?.quantity,
    unitValue: item.price, // excluding tax
    // extendedCustomsDescription: "Fast-acting pain relief medication suitable for headaches, fever, and general body pain.", // ideally truncate to 300 chars
    originCountryCode: "GBR",
    unitWeightInGrams: parseInt(item.value, 10), // use item's variant value
  }));

  const packages = [{
    weightInGrams: contents.reduce((acc:any, item:any) => acc + (item.unitWeightInGrams * item.quantity), 0),
    packageFormatIdentifier: "parcel",
    contents
  }];

  const item = {
    orderReference: orderInfo.orderId,
    isRecipientABusiness: true,
    recipient,
    packages,
    orderDate: orderInfo.createdAt,
    subtotal: orderInfo.subTotal,
    shippingCostCharged: 0, // Add if you have it
    otherCosts: 0,
    total: orderInfo.totalAmount,
    orderTax: orderInfo.taxAmount,
    postageDetails: {
      sendNotificationsTo: "recipient",
      receiveEmailNotification: true,
      receiveSmsNotification: true
    }
  };

  return {
    items: [item]
  };
}

const createOrder = async (order: IOrder) => {
  const user = await User.findById(order?.customer).lean().exec();
  const customer = await Customer.findOne({id: user?.id}).lean();
  
  const shippingPayload = createShippingRequest(customer, order);

  try {
    const response = await axios.post(`${config.royal_mail_api_endpoint}/orders` as string, shippingPayload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.royal_mail_api_key as string,
      },
    });

    await Order.findOneAndUpdate(
      { orderId: order.orderId },
      {
        orderIdentifier: response.data.createdOrders[0]?.orderIdentifier,
        royalMailStatus: "New"
      }
    );

    return response.data;
  } catch (error) {
    await Order.findOneAndUpdate(
      { orderId: order?.orderId },
      {
        royalMailStatus: "royal_mail_failed"
      }
    );    
    if (axios.isAxiosError(error)) {
      throw new Error(error?.message || "Unable to create Royal Mail order. Please try again.");
    }
    throw error;
  }
};

const deleteOrder = async (orderId: number) => {
  const order = await axios.delete(`${config.royal_mail_api_endpoint}/orders/${orderId}` as string, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: config.royal_mail_api_key as string,
    },
  })

  return order;
}

const getOrderByIdentifier = async (identifier: number) => {
  
  const { data } = await axios.get<RoyalMailEntry[]>(
    `${config.royal_mail_api_endpoint}/orders/${identifier}`,
    {
      headers: {
        Authorization: config.royal_mail_api_key as string,
      },
    }
  );
  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }else {
    return null;
  }

}


export const RoyalMailOrderService = {
  createOrder,
  deleteOrder,
  getOrderByIdentifier
};
