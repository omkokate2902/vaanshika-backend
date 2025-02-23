import admin from '../config/firebaseAdmin.js'; // Firebase Admin initialization
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token = (req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Token missing.' });
    }

    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Find the user in MongoDB using the Firebase UID
    const user = await User.findOne({ userId: decodedToken.uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user info to request object
    req.user = { ...user.toObject(), firebase: decodedToken };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    }

    res.status(500).json({ message: 'Authentication failed. Please log in again.' });
  }
};