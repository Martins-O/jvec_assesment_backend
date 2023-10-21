import express from 'express';
import {createAccount, login} from "../controller/customerController.js";

const router = express.Router();

router.post('/sign_up', createAccount);
router.post('/sign_in', login);

export { router as customRouter };