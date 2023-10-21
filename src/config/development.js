import dotenv from "dotenv";
dotenv.config();

export const development = {
  mongodb_connection_url: process.env.DEV_MONGODB_CONNECTION_URL,
  port: +process.env.DEV_PORT,
  bcrypt_password_salt_round: process.env.DEV_PASSWORD_BCRYPT_SALT_ROUND,
  jwt_web_token: process.env.DEV_JWT_SECRET,
  bcrypt_forgot_password_salt_round: process.env.DEV_FORGOT_PASSWORD_SALT_ROUND,
  DEV_MAIL_TRAP_USERNAME: process.env.DEV_MAIL_TRAP_USERNAME,
  DEV_MAIL_TRAP_PASSWORD: process.env.DEV_MAIL_TRAP_PASSWORD
};