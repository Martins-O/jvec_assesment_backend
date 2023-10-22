import {config} from "dotenv";
import bcrypt from "bcrypt";
import {generateToken, verifyToken} from "../utils/jwt.js";
import {customerRegDataValidation, loginValidator} from "../validators/joiValidators.js";
import {CustomerModel} from "../models/customerModel.js";


export const createAccount = async (req, res) => {
  try {
    const { error } = customerRegDataValidation(req.body);
    if (error) {
      return res.status(400).json({
        status: "Failed",
        message: error.details[0].message
      });
    }

    const { username, email, phoneNumber, password } = req.body;

    const emailExists = await CustomerModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Email already exists. Please login instead.',
      });
    }

    const saltRounds = +config.bcrypt_password_salt_round;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
    const { error } = loginValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const { username, password } = req.body;

    const userExists = await CustomerModel.findOne({ username });
    if (!userExists) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Username does not exist. Please sign up.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    if (!passwordMatch) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Incorrect password or does not exist.',
      });
    }

    const token = generateToken(userExists);

    const oldTokens = (userExists.access_token || []).filter((tokenInfo) => {
      const timeDiff = (Date.now() - parseInt(tokenInfo.signedAt)) / 1000;
      return timeDiff < 86400;
    });

    await CustomerModel.findByIdAndUpdate(
      userExists._id,
      {
        access_token: [...oldTokens, { token, signedAt: Date.now().toString() }],
      },
      { runValidators: true }
    );

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

export const logout = async (req, res) => {
  try {
    const token = req.header('auth_token');

    if (!token) {
      return res.status(401).json({
        status: 'Failed',
        message: 'Unauthorized. No token provided.',
      });
    }

    const decoded = verifyToken(token);

    const user = await CustomerModel.findById(decoded._id);
    console.log(user)
    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        message: 'User not found.',
      });
    }

    user.access_token = user.access_token.filter((tokenInfo) => tokenInfo.token !== token);

    await user.save();

    res.status(200).json({
      status: 'Success',
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: error.message,
    });
  }
};



// export const logout = async (req, res) => {
//   try {
//     const userId = req.params.id;
//
//     const user = await CustomerModel.findByIdAndUpdate(
//       userId,
//       {
//         $pull: {
//           tokens: {
//             token: req.access_token
//           }
//         }
//       }
//     );
//
//     if (!user) {
//       return res.status(404).json({ status: 'Failed', message: 'User not found' });
//     }
//
//     res.status(200).json({ status: 'Success', message: 'User logged out successfully' });
//   }catch (error) {
//       res.status(500).json({ status: 'Failed', message: 'Internal server error' });
//   }
//
// };
