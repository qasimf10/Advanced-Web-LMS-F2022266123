import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import User from '../models/usermodel.js';
import Course from '../models/course.model.js';
import AppError from '../utils/error.util.js';

/**
 * @ENROLL_IN_BUNDLE
 * Enrolls the user in all available courses (subscription bundle)
 */
export const enrollInBundle = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if already subscribed
    if (user.subscriptionStatus === 'active') {
        return next(new AppError('You are already subscribed', 400));
    }

    // Get all courses
    const courses = await Course.find({});

    // Enroll user in all courses
    const enrolledCourses = courses.map(course => ({
        courseId: course._id,
        enrolledAt: new Date(),
        progress: {
            completedLectures: [],
            percentage: 0
        }
    }));

    user.enrolledCourses = enrolledCourses;
    user.subscriptionStatus = 'active';
    user.subscription = {
        id: `SUB_${Date.now()}`,
        status: 'active'
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Successfully enrolled in all courses!',
        enrolledCourses: user.enrolledCourses
    });
});

/**
 * @GET_ENROLLED_COURSES
 * Gets all courses the user is enrolled in with progress
 */
export const getEnrolledCourses = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('enrolledCourses.courseId');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Enrolled courses fetched successfully',
        enrolledCourses: user.enrolledCourses,
        subscriptionStatus: user.subscriptionStatus
    });
});

/**
 * @UPDATE_PROGRESS
 * Marks a lecture as completed and updates progress percentage
 */
export const updateProgress = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { courseId, lectureId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Find the enrolled course
    const enrolledCourse = user.enrolledCourses.find(
        ec => ec.courseId.toString() === courseId
    );

    if (!enrolledCourse) {
        return next(new AppError('You are not enrolled in this course', 403));
    }

    // Add lecture to completed if not already
    if (!enrolledCourse.progress.completedLectures.includes(lectureId)) {
        enrolledCourse.progress.completedLectures.push(lectureId);
    }

    // Get total lectures count from course
    const course = await Course.findById(courseId);
    if (course && course.numberOfLectures > 0) {
        enrolledCourse.progress.percentage = Math.round(
            (enrolledCourse.progress.completedLectures.length / course.numberOfLectures) * 100
        );
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Progress updated successfully',
        progress: enrolledCourse.progress
    });
});

/**
 * @CANCEL_ENROLLMENT
 * Cancels the user's subscription/enrollment
 */
export const cancelEnrollment = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.subscriptionStatus !== 'active') {
        return next(new AppError('You do not have an active subscription', 400));
    }

    user.subscriptionStatus = 'inactive';
    user.subscription = {
        id: undefined,
        status: 'inactive'
    };
    // Keep the enrolledCourses for history but mark as inactive

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Subscription cancelled successfully'
    });
});
