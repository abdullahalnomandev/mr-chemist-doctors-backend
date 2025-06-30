import { TContact } from './contact.interface';
import { Contact } from './contact.model';
// import { sendEmailToCustomer } from './contact.util';

const createContactIntoDB = async (payload: TContact) => {
  const result = await Contact.create(payload);
  // sendEmailToCustomer(result._id.toString())
  return result;
};

const getAllContactsFromDB = async () => {
  const result = await Contact.find();
  return result;
};

export const ContactServices = {
  createContactIntoDB,
  getAllContactsFromDB,
};