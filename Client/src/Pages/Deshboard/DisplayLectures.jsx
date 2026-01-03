
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdAutoDelete, MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourseLecture, getCourseLectures } from "../../Redux/Slices/LectureSlice";
import { updateProgress, getEnrolledCourses } from "../../Redux/Slices/RazorpaySlice";

function Displaylectures() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const { lectures } = useSelector((state) => state.lecture);
    const { role } = useSelector((state) => state.auth);
    const { enrolledCourses } = useSelector((state) => state.razorpay);

    const [currentLecture, setCurrentLecture] = useState(0);
    const [completedLectures, setCompletedLectures] = useState([]);

    // Get completed lectures for this course
    useEffect(() => {
        if (enrolledCourses && state?._id) {
            const enrollment = enrolledCourses.find(
                ec => ec?.courseId?._id === state._id || ec?.courseId === state._id
            );
            if (enrollment?.progress?.completedLectures) {
                setCompletedLectures(enrollment.progress.completedLectures);
            }
        }
    }, [enrolledCourses, state]);

    async function handleMarkComplete(lectureId) {
        if (!state?._id || !lectureId) return;

        const result = await dispatch(updateProgress({
            courseId: state._id,
            lectureId: lectureId
        }));

        if (result?.payload?.success) {
            toast.success("Marked as complete! 🎉");
            setCompletedLectures(prev => [...prev, lectureId]);
            // Refresh enrolled courses to update progress
            dispatch(getEnrolledCourses());
        } else {
            toast.error("Failed to update progress");
        }
    }

    function isLectureCompleted(lectureId) {
        return completedLectures.includes(lectureId);
    }

    async function onLectureDelete(courseId, lectureId) {
        if (window.confirm("Are you Sure Want to delete the Lecture ?")) {
            await dispatch(deleteCourseLecture({ courseId: courseId, lectureId: lectureId }));
            await dispatch(getCourseLectures(courseId));
        }
    }

    useEffect(() => {
        if (!state) navigate("/course")
        dispatch(getCourseLectures(state._id));
        dispatch(getEnrolledCourses());
    }, [])

    // Calculate progress
    const progressPercentage = lectures?.length > 0
        ? Math.round((completedLectures.length / lectures.length) * 100)
        : 0;

    return (
        <HomeLayout>
            <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
                <div className="text-center text-2xl font-semibold text-yellow-500">
                    Course: {state?.title}
                </div>

                {/* Progress Bar */}
                {lectures && lectures.length > 0 && (
                    <div className="w-full max-w-2xl">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Your Progress</span>
                            <span>{completedLectures.length}/{lectures.length} completed ({progressPercentage}%)</span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {(lectures && lectures.length > 0) ?
                    (<div className="flex flex-col md:flex-row justify-center gap-10 w-full">
                        {/* Content Display Section */}
                        <div className="space-y-5 md:w-[32rem] p-4 rounded-lg shadow-[0_0_10px_black]">
                            {/* Check if it's a video or document */}
                            {lectures[currentLecture]?.contentType === 'video' ||
                                lectures[currentLecture]?.lecture?.secure_url?.includes('.mp4') ? (
                                <video
                                    src={lectures[currentLecture]?.lecture?.secure_url}
                                    className="object-fill rounded-lg w-full max-h-96"
                                    controls
                                    disablePictureInPicture
                                    controlsList="nodownload"
                                />
                            ) : (
                                <div className="bg-zinc-800 rounded-lg p-6 text-center">
                                    <span className="text-6xl block mb-4">📄</span>
                                    <h3 className="text-xl font-semibold mb-4">Document Content</h3>
                                    <a
                                        href={lectures[currentLecture]?.lecture?.secure_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                                    >
                                        📥 Open Document
                                    </a>
                                    <p className="text-sm text-gray-400 mt-4">
                                        Click to open/download the document
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <h1 className="text-xl font-semibold">
                                    <span className="text-yellow-500">Title: </span>
                                    {lectures[currentLecture]?.title}
                                </h1>
                                <p>
                                    <span className="text-yellow-500">Description: </span>
                                    {lectures[currentLecture]?.description}
                                </p>
                            </div>

                            {/* Mark as Complete Button */}
                            {role !== "ADMIN" && (
                                <button
                                    onClick={() => handleMarkComplete(lectures[currentLecture]?._id)}
                                    disabled={isLectureCompleted(lectures[currentLecture]?._id)}
                                    className={`w-full py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${isLectureCompleted(lectures[currentLecture]?._id)
                                            ? 'bg-green-600 cursor-default'
                                            : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                        }`}
                                >
                                    {isLectureCompleted(lectures[currentLecture]?._id) ? (
                                        <>
                                            <MdCheckCircle className="text-2xl" />
                                            Completed ✓
                                        </>
                                    ) : (
                                        <>
                                            <MdCheckCircleOutline className="text-2xl" />
                                            Mark as Complete
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Lectures List Section */}
                        <div className="md:w-[24rem] p-4 rounded-lg shadow-[0_0_10px_black] space-y-4">
                            <div className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                                <p>Content List</p>

                                {role === "ADMIN" && (
                                    <button
                                        onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                        className="btn btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                                    >
                                        Add Content
                                    </button>
                                )}
                            </div>
                            <ul className="space-y-3 md:overflow-y-auto max-h-[400px]">

                                {lectures.map((lecture, idx) => (
                                    <li
                                        key={lecture._id}
                                        className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center ${currentLecture === idx
                                                ? 'bg-yellow-500/20 border border-yellow-500'
                                                : 'bg-zinc-800 hover:bg-zinc-700'
                                            }`}
                                        onClick={() => setCurrentLecture(idx)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isLectureCompleted(lecture._id) ? (
                                                <MdCheckCircle className="text-green-500 text-xl" />
                                            ) : (
                                                <span className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center text-sm">
                                                    {idx + 1}
                                                </span>
                                            )}
                                            <div>
                                                <p className="font-medium">{lecture?.title}</p>
                                                <p className="text-xs text-gray-400">
                                                    {lecture?.contentType === 'video' ? '🎥 Video' : '📄 Document'}
                                                </p>
                                            </div>
                                        </div>
                                        {role === "ADMIN" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onLectureDelete(state?._id, lecture?._id);
                                                }}
                                                className="text-red-500 text-xl hover:text-red-400"
                                            >
                                                <MdAutoDelete />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>) : (
                        <div className="text-center space-y-4">
                            <p className="text-gray-400">No content added yet</p>
                            {role === "ADMIN" && (
                                <button
                                    onClick={() => navigate("/course/addlecture", { state: { ...state } })}
                                    className="btn btn-active btn-primary px-4 py-2 rounded-md font-semibold text-lg"
                                >
                                    Add Content
                                </button>
                            )}
                        </div>
                    )}
            </div>
        </HomeLayout>
    )
}
export default Displaylectures;