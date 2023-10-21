import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {config} from '../config/index.js';

export const generateToken = (userExists) => {
  const payload = {
    _id: userExists._id,
    email: userExists.email,
    password: userExists.password
  }

  return jwt.sign(payload, config.jwt_web_token, {expiresIn: 60 * 60 * 24});
}

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt_web_token)
}

export const createRandomBytes = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(4, (err, buff) => {
      if (err) reject(err);

      const token = buff.toString('hex');
      resolve(token);

    });
  })
