import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getEnrolledCourses } from "../../Redux/Slices/RazorpaySlice";

function MyCourses() {
    const dispatch = useDispatch();
    const { enrolledCourses, subscriptionStatus } = useSelector((state) => state.razorpay);
    const { data: userData } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getEnrolledCourses());
    }, [dispatch]);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-4 sm:px-20 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold">
                    My Enrolled Courses
                </h1>

                {subscriptionStatus === 'active' ? (
                    <div className="mb-4 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
                        <p className="text-green-400 font-semibold">✓ Active Subscription</p>
                        <p className="text-sm text-gray-300">You have access to all courses</p>
                    </div>
                ) : (
                    <div className="mb-4 p-4 bg-yellow-600/20 border border-yellow-500 rounded-lg text-center">
                        <p className="text-yellow-400 font-semibold">No Active Subscription</p>
                        <Link to="/checkout" className="text-sm text-blue-400 hover:underline">
                            Click here to subscribe
                        </Link>
                    </div>
                )}

                {enrolledCourses && enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((enrollment) => (
                            <div
                                key={enrollment?.courseId?._id || enrollment?.courseId}
                                className="bg-zinc-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Course Thumbnail */}
                                <div className="h-40 bg-zinc-700 flex items-center justify-center">
                                    {enrollment?.courseId?.thumbnail?.secure_url ? (
                                        <img
                                            src={enrollment.courseId.thumbnail.secure_url}
                                            alt={enrollment.courseId.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl">📚</span>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="p-4">
                                    <h2 className="text-lg font-bold mb-2">
                                        {enrollment?.courseId?.title || 'Course'}
                                    </h2>
                                    <p className="text-sm text-gray-400 mb-3">
                                        {enrollment?.courseId?.category || 'Category'}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Progress</span>
                                            <span>{enrollment?.progress?.percentage || 0}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-600 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${enrollment?.progress?.percentage || 0}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {enrollment?.progress?.completedLectures?.length || 0} lectures completed
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <Link
                                        to="/course/displaylecture"
                                        state={{ ...enrollment.courseId }}
                                        className="block w-full bg-yellow-500 hover:bg-yellow-600 text-black text-center font-semibold py-2 rounded transition-all duration-300"
                                    >
                                        Continue Learning
                                    </Link>
                                </div>

                                {/* Enrolled Date */}
                                <div className="px-4 pb-3 text-xs text-gray-500">
                                    Enrolled: {new Date(enrollment?.enrolledAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <span className="text-6xl">📚</span>
                        <h2 className="text-xl font-semibold">No courses enrolled yet</h2>
                        <p className="text-gray-400">Subscribe to access all our courses</p>
                        <Link
                            to="/checkout"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default MyCourses;
