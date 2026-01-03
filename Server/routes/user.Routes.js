import { Router } from "express";

import { register, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

/**
 * @route GET /
 * @description Returns available user endpoints
 * @access Public
 */
router.get('/', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'User API is working',
        endpoints: {
            'POST /register': 'Register a new user',
            'POST /login': 'Log in',
            'POST /logout': 'Log out',
            'GET /me': 'Get logged-in user profile (requires auth)',
            'POST /reset': 'Request password reset',
            'POST /reset/:resetToken': 'Reset password with token',
            'POST /change-password': 'Change password (requires auth)',
            'PUT /update': 'Update profile (requires auth)'
        }
    });
});
/**
 * @route POST /register
 * @description Registers a new user and uploads their avatar.
 * @access Public
 */
router.post('/register', upload.single("avatar"), register),
    /**
     * @route POST /login
     * @description Logs in the user.
     * @access Public
     */
    router.post('/login', login);
/**
 * @route POST /login
 * @description Logs in the user.
 * @access Public
 */
router.post('/logout', logout);
/**
 * @route GET /me
 * @description Fetches the logged-in user's profile.
 * @access Private, Authenticated users only
 */
router.get('/me', isLoggedIn, getProfile);

/**
 * @route POST /reset
 * @description Initiates password reset process by sending a reset link.
 * @access Public
 */
router.post('/reset', forgotPassword);
/**
 * @route POST /reset/:resetToken
 * @description Resets the password using the reset token.
 * @access Public
 */
router.post('/reset/:resetToken', resetPassword);
/**
 * @route POST /change-password
 * @description Changes the logged-in user's password.
 * @access Private, Authenticated users only
 */
router.post('/change-password', isLoggedIn, changePassword)

/**
 * @route PUT /update
 * @description Updates the logged-in user's profile information and avatar.
 * @access Private, Authenticated users only
 */
router.put('/update', isLoggedIn, upload.single("avatar"), updateUser)

export default router;