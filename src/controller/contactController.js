import {ContactModel} from "../models/contactModel.js";
import {mongoIdValidator} from "../validators/mongoIdValidator.js";
import {sendErrorResponse} from "../customError/error.js";

export const addContact = async (req, res) =>{
  try{
    const { first_name, last_name, phone_number } = req.body;

    const contactCreated = await ContactModel.create({
      first_name,
      last_name,
      phone_number
    });

    res.status(200).json({
      status: 'Success',
      message: 'Contact Added Successfully',
      contactDate: contactCreated
    })

  }catch (err){
    res.status(400).json({
      status: 'Failed',
      message: err.message
    })
  }
}


export const getContactsById = async (req, res) => {
  try{
    const{ id } = req.query;
    if (!id){
      return res.status(400).json({
        message: "Please pass in a valid 'id' in the request query",
        status: "Bad Request",
      });
    }

    const { error } = mongoIdValidator.validate(req.query);
    if (error) return sendErrorResponse(res, 400, "Please pass in a valid mongoId")
    const contact = await ContactModel.findById(id)
    if (!contact) return sendErrorResponse(res, 404, `The contact with this id: ${id}, does not exist` )

    res.status(200).json({
      message: "Contact found successfully",
      status: "Success",
      data: {
        contact,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: 'Failed'
    })
  }
}

export const findAllContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find();

    return res.status(200).json({
      message: contacts.length < 1 ? "No customer found" : "contact(s) found successfully",
      status: "Success",
      data: {
        contacts,
      },
    })
  }catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'An error occurred while fetching contact.',
      error: error.message,
    });
  }
}

export const updateContactProfile = async (req, res) => {
  try {
    const profileId = req.params.id;

    const { first_name, last_name, phone_number } = req.body;

    const updatedContactDetails = await ContactModel.findByIdAndUpdate(profileId,
      { first_name, last_name, phone_number  },
      { new: true }).populate({
      path: 'first_name',
    });


    const profile = await ContactModel.findById(profileId);

    if (!updatedContactDetails) return sendErrorResponse(res, 400, "contact details not updated!");

    res.status(200).json({
      status: 'success',
      message: 'contact details updated',
      profile: { updatedContactDetails }
    })

  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}


export const deleteContact = async (req, res) => {
  try{
    const id = req.params.id

    await ContactModel.findOneAndDelete(id)

    return res.status(200).json({
      message: "contact deleted successfully",
      status: "Success",
    })
  }catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message
    })
  }
}