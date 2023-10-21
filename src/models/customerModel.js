import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    customerEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        immutable: true,
        validators: {
            match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please add a valid email string to the email path."]
        }
    },

    phoneNumber: {
        type: String,
        required: [true, 'Please enter phone number digits'],
        validators: {
            match: [/^(\+\d{1,3}\s?)?(\d{10,15})$/, 'Please add a valid phone number']
        }
    },

    password: {
        type: String,
        required: true,
        validators: {
            match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain minimum of eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.']
        }
    },

})

export const CustomerModel = mongoose.model('Customer', CustomerSchema);