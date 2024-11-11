import express from 'express';
import { register, login, refreshSession, logout, resetPasswordController, sendResetEmailController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userSchema, userLoginSchema, requestResetPasswordSchema, resetPasswordSchema } from '../validation/user.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const authRoutes = express.Router();

  

authRoutes.post('/register', validateBody(userSchema), ctrlWrapper(register));
authRoutes.post('/login', validateBody(userLoginSchema), ctrlWrapper(login));
authRoutes.post('/refresh', ctrlWrapper(refreshSession));
authRoutes.post('/logout', ctrlWrapper(logout));
authRoutes.post('/send-reset-email', validateBody(requestResetPasswordSchema), ctrlWrapper(sendResetEmailController));
authRoutes.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default authRoutes; 