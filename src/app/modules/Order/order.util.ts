import SMTPTransport from "nodemailer/lib/smtp-transport";
import config from "../../config";
import { Product } from "../Product/product.model";
import { CreateOrderPayload, IOrderItem, RoyalMailEntry } from "./order.interface";
import { Order } from "./order.model";
import nodemailer from "nodemailer";
import { User } from "../User/user.model";

// Generate Order ID
const findLastOrderId = async (): Promise<string | undefined> => {
  const lastOrder = await Order.findOne({}, { orderId: 1, _id: 0 })
    .sort({ createdAt: -1 }) 
    .lean();

  return lastOrder?.orderId;
};

export const generateOrderId = async (): Promise<string> => {
  const lastId = await findLastOrderId(); 

  let numericPart = 0;

  if (lastId) {
    numericPart = parseInt(lastId) || 0;
  }

  const newIdNumber = numericPart + 1;
  const newId = newIdNumber.toString().padStart(3, '0'); 

  return newId;
};


// Build Order Items
export const buildOrderItems = async (items: CreateOrderPayload['items']) => {
  const productIds = items.map((item) => item.id);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    throw new Error('Some products not found');
  }

  return items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.id);
    if (!product) throw new Error(`Product ${item.id} not found`);

    let price = product.basePrice;
    let variant = null;

    if (item.variant_id) {
      variant = product.variants?.find((v) => v?._id?.toString() === item.variant_id);
      if (!variant) throw new Error(`Variant ${item.variant_id} not found in product ${item.id}`);
      price = variant.price;
    }

    const quantity = item.quantity;
    const taxRate = 0.01;
    const taxAmount = price * quantity * taxRate;

    return {
      product: product._id,
      variant,
      productBasePrice: product.basePrice,
      name: product.name,
      quantity,
      taxRate,
      taxAmount,
      type: variant?.type,
      unit: variant?.unit,
      price,
      value: variant?.value,
    };
  });
};

export const getRoyalMailStatusByDates = (data: RoyalMailEntry): string => {
  if (data.shippedOn) return "shipped";
  if (data.manifestedOn) return "manifested";
  if (data.printedOn) return "printed";
  if (data.createdOn) return "new";
  return "new"; // fallback if nothing found
};



export const sendEmailToCustomer = async (orderId: string) => {
  // 1. Fetch order with items
  const order = await Order.findOne({orderId}).lean();
  if (!order) throw new Error("Order not found");

  // 2. Fetch customer
  const user = await User.findById(order.customer).lean();
  if (!user?.email) throw new Error("Customer email not found");

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  } as SMTPTransport.Options);

  const orderItemsHtml = order.items
    ?.map(
      (item: IOrderItem) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.value}${item.unit}</td>
          <td>$${item.price?.toFixed(2) ?? "0.00"}</td>
        </tr>`
    )
    .join("") || "";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">Mr. Chemist — Order Confirmation</h2>
      <p>Thank you for your order <strong>#${order.orderId}</strong> placed on ${
    order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"
  }.</p>

      <h4>Order Summary</h4>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr style="background-color: #f5f5f5;">
            <th>Product</th>
            <th>Quantity</th>
            <th>Weight</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
      </table>

      <br />
      <p><strong>Subtotal:</strong> $${order.subTotal?.toFixed(2) ?? "0.00"}</p>
      <p><strong>Tax:</strong> $${order.taxAmount?.toFixed(2) ?? "0.00"}</p>
      <p><strong>Total:</strong> <span style="color: #007bff;">$${order.totalAmount?.toFixed(2) ?? "0.00"}</span></p>

      <hr />
      <p><strong>Order Status:</strong> ${order.royalMailStatus}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

      <br />
      <p>Need help? Contact us anytime.</p>
      <p style="font-size: 14px; color: #888;">Mr. Chemist</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `Mr. Chemist <${config.smtp_user}>`,
      to: user.email,
      subject: `Your Order #${order.orderId} Confirmation`,
      html: htmlContent,
    });
  } catch (err) {
    throw new Error("Email sending failed");
  }
};