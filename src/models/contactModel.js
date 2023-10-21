import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: [true, 'Please enter phone number digits'],
        validators: {
            match: [/^(\+\d{1,3}\s?)?(\d{10,15})$/, 'Please add a valid phone number']
        }
    },
})


export const ContactModel = mongoose.model('Contact', ContactSchema)