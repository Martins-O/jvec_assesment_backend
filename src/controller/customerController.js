import {config} from "dotenv";
import bcrypt from "bcrypt";
import validationResult from 'express-validator';
import {generateToken} from "../utils/jwt.js";
import {customerRegDataValidation, loginValidator} from "../validators/joiValidators.js";
import {CustomerModel} from "../models/customerModel.js";


export const createAccount = async (req, res) => {
  try {
    // Validate the request body
    const { error } = customerRegDataValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: "Failed",
        message: error.details[0].message
      });
    }

    const { username, email, phoneNumber, password } = req.body;

    // Check if the email already exists
    const emailExists = await CustomerModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Email already exists. Please login instead.',
      });
    }

    // Hash the password
    const saltRounds = +config.bcrypt_password_salt_round; // Use your salt value from the config
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new customer
    const customerCreated = await CustomerModel.create({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Your account has been created successfully',
      userData: customerCreated,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }
};



export const login = async (req, res) => {
  try {
    // Validate the request body
    const { error } = loginValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const { username, password } = req.body;

    // Check if the user exists
    const userExists = await CustomerModel.findOne({ username });
    if (!userExists) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Username does not exist. Please sign up.',
      });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Incorrect password or does not exist.',
      });
    }

    // Generate a new token
    const token = generateToken(userExists);

    // Filter and clean up old tokens
    const oldTokens = (userExists.tokens || []).filter((tokenInfo) => {
      const timeDiff = (Date.now() - parseInt(tokenInfo.signedAt)) / 1000;
      return timeDiff < 86400;
    });

    // Update user with the new token
    await CustomerModel.findByIdAndUpdate(
      userExists._id,
      {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
      },
      { runValidators: true }
    );

    // Respond with success
    res
      .status(200)
      .header('auth_token', token)
      .json({
        status: 'Success',
        message: 'User logged in successfully',
        access_token: token,
      });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

