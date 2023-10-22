import express from "express";
import {
  addContact,
  deleteContact,
  findAllContacts,
  getContactsById,
  updateContactProfile
} from "../controller/contactController.js";
import {customerAuthJwt} from "../middleware/auth.js";

const router = express.Router();

router.post('/add_contact', customerAuthJwt, addContact)
router.get('/find_contact', getContactsById)
router.get('/find_all_contact', findAllContacts)
router.put('/update/:id', updateContactProfile)
router.delete('/delete/:id', deleteContact)

export { router as contactRouter };