import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { Contact } from "./contact.model";
import config from "../../config";


export const sendEmailToCustomer = async (contactId: string) => {
  // 1. Fetch the contact message
  const contact = await Contact.findById(contactId).lean();
  if (!contact) throw new Error("Contact not found");

  if (!contact.email) throw new Error("Customer email not provided");

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  } as SMTPTransport.Options);

  const fullName = `${contact.firstName} ${contact.lastName}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #007bff;">Mr. Chemist — New Contact Message</h2>

      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p style="margin-left: 20px;">${contact.message}</p>

      ${
        contact.attachment
          ? `<p><strong>Attachment:</strong> <a href="${contact.attachment}" target="_blank">${contact.attachment}</a></p>`
          : ""
      }

      <hr />
      <p style="font-size: 14px; color: #888;">Mr. Chemist</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `Mr. Chemist <${config.smtp_user}>`,
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      html: htmlContent,
    });
  } catch{
    throw new Error("Email sending failed");
  }
};
