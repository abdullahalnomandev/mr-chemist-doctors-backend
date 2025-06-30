import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import  { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import {  TLoginUser } from './auth.interface';
import { createToken, generateToken, sendResetPasswordLinkToCustomer, verifyToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client

  const jwtPayload = {
    _id: user._id,
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as string);

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (userData: JwtPayload, payload: { oldPassword: string; newPassword: string }) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as string);

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string): Promise<void> => {
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email is required");
  }

  // 1. Check if user exists by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found.");
  }

  // 2. Check if deleted
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User account is deleted.");
  }

  // 3. Check if blocked
  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User account is blocked.");
  }

  // 4. Generate a 6-digit OTP
  const token = generateToken();

  // 5. Update OTP in the user record
  const updated = await User.updateOne({ email }, { token });

  if (updated.modifiedCount === 0) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update OTP.");
  }

  // 6. Send REST link to user's email
  try {
    await sendResetPasswordLinkToCustomer(user.email, token, user.name);
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send OTP. Please try again later."
    );
  }
};



export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  if (!token || !newPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, "Token and new password are required.");
  }

  // 1. Find user by token
  const user = await User.findOne({ token });

  if (!user) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Reset link is invalid or has expired."
    );
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User account has been deleted.");
  }

  if (user.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "User account is blocked.");
  }

  // 2. Hash the new password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // 3. Update password and clear reset token
  const updateResult = await User.updateOne(
    { token },
    {
      password: hashedPassword,
      token: null,
      passwordChangedAt: new Date(),
      needsPasswordChange: false,
    }
  );

  if (updateResult.modifiedCount === 0) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to reset password.");
  }
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
