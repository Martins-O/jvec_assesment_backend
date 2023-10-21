import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                // Regular expression for email validation
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
            },
            message: 'Please add a valid email string to the email path.',
        },
    },

    phoneNumber: {
        type: String,
        required: [true, 'Please enter phone number digits'],
        validate: {
            validator: (value) => {
                // Regular expression for phone number validation
                return /^(\+\d{1,3}\s?)?(\d{10,15})$/.test(value);
            },
            message: 'Please add a valid phone number.',
        },
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                // Regular expression for password validation
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message:
              'Password must contain a minimum of eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
    },
});

export const CustomerModel = mongoose.model('Customer', customerSchema);
