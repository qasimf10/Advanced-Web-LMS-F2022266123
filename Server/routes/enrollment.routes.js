import { Router } from 'express';

import {
    enrollInBundle,
    getEnrolledCourses,
    updateProgress,
    cancelEnrollment
} from '../controllers/enrollment.controller.js';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';

const router = Router();

/**
 * @route POST /enroll
 * @description Enrolls user in all courses (subscription bundle)
 * @access Private, Authenticated users only
 */
router.post('/enroll', isLoggedIn, enrollInBundle);

/**
 * @route GET /my-courses
 * @description Gets user's enrolled courses with progress
 * @access Private, Authenticated users only
 */
router.get('/my-courses', isLoggedIn, getEnrolledCourses);

/**
 * @route POST /progress/:courseId/:lectureId
 * @description Updates progress for a lecture
 * @access Private, Authenticated users only
 */
router.post('/progress/:courseId/:lectureId', isLoggedIn, updateProgress);

/**
 * @route POST /cancel
 * @description Cancels user's subscription
 * @access Private, Authenticated users only
 */
router.post('/cancel', isLoggedIn, cancelEnrollment);

export default router;
