import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

import nodemailer from "nodemailer";
import config from '../../config';

// export const createToken = (jwtPayload: { userId: string; role: string }, secret: string, expiresIn: string) => {
//   return jwt.sign(jwtPayload, secret, {
//     expiresIn,
//   });
// };
export const createToken = (jwtPayload: { userId: string; role: string }, secret: string, expiresIn: string) => {

  const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] }; 
  return jwt.sign(jwtPayload, secret, options);


};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};


export const generateToken = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 32;
  let token = '';
  
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  
  return token;
};


export const sendResetPasswordLinkToCustomer = async (
  email: string,
  token: string,
  fullName?: string
) => {
  if (!email) throw new Error("Email is required");
  if (!token) throw new Error("Token is required");

  const resetUrl = `${config.client_url}/auth/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: Number(config.smtp_port),
    secure: false,
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  const htmlContent = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 10px; border: 1px solid #e5e7eb; color: #111827;">
    
    <h2 style="font-size: 24px; color: #1d4ed8; margin-bottom: 24px; font-weight: 600;">
      ${fullName ? `Hi ${fullName},` : "Hello,"}
    </h2>

    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
      We received a request to reset your password. To proceed, click the button below:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" target="_blank" style="
        background-color: #1d4ed8;
        color: #ffffff;
        padding: 14px 28px;
        border-radius: 6px;
        text-decoration: none;
        font-size: 16px;
        font-weight: 600;
        display: inline-block;
      ">
        Reset Your Password
      </a>
    </div>

    <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
      If you did not request a password reset, please ignore this message. This link will expire for your security.
    </p>

    <p style="font-size: 13px; color: #6b7280; margin-top: 30px;">
      If the button doesn’t work, copy and paste the following link into your browser:<br />
      <a href="${resetUrl}" style="color: #1d4ed8;">${resetUrl}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;" />

    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      This message was sent by <strong>Mr. Chemist</strong>. Please do not reply to this email.
    </p>
  </div>
`;


  try {
    await transporter.sendMail({
      from: `Mr. Chemist <${config.smtp_user}>`,
      to: email,
      subject: "Reset Your Password – Mr. Chemist",
      html: htmlContent,
    });
  } catch (error) {
    throw new Error("Failed to send password reset email");
  }
};


