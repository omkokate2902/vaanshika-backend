import { clientAuthInstance } from '../services/firebaseService.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import User from '../models/User.js';

// 🚀 Register User with Email Verification
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const userCredential = await createUserWithEmailAndPassword(clientAuthInstance, email, password);
    await sendEmailVerification(userCredential.user);

    const newUser = new User({
      name,
      email,
      userId: userCredential.user.uid,
      isVerified: false,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Login User with Email Verification Check
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(clientAuthInstance, email, password);

    if (!userCredential.user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email.' });
    }

    await User.findOneAndUpdate(
      { userId: userCredential.user.uid },
      { isVerified: true },
      { new: true }
    );

    const token = await userCredential.user.getIdToken();
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🔒 Forgot Password - Send Reset Email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(clientAuthInstance, email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// 🚪 Logout User
export const logoutUser = async (req, res) => {
  try {
    await signOut(clientAuthInstance);
    res.status(200).json({ message: 'User logged out successfully.' });
  } catch (error) {
    console.error('Logout Error:', error.message);
    res.status(500).json({ message: 'Failed to log out. Please try again.' });
  }
};