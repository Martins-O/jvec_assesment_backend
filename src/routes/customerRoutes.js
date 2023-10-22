import express from 'express';
import {createAccount, login, logout} from "../controller/customerController.js";
import {customerAuthJwt} from "../middleware/auth.js";

const router = express.Router();

router.post('/sign_up', createAccount);
router.post('/sign_in', login);
router.post('/sign_out/:id', customerAuthJwt, logout);

export { router as customRouter };