// routes/authRoutes.js
import express from 'express';
import { registerUser, loginUser, logoutUser, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword); // Added forgot password route

export default router;