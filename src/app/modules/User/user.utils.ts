import { User } from './user.model';

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: { $in: ['admin', 'editor'] },
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `U-${incrementId}`;
  return incrementId;
};

// Customer ID
export const findLastCustomerId = async () => {
  const lastCustomer = await User.findOne(
    {
      role: 'customer',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastCustomer?.id ? lastCustomer.id.substring(2) : undefined;
};

export const generateCustomerId = async () => {
  let currentId = (0).toString();
  const lastCustomerId = await findLastCustomerId();

  if (lastCustomerId) {
    currentId = lastCustomerId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `C-${incrementId}`;
  return incrementId;
};
