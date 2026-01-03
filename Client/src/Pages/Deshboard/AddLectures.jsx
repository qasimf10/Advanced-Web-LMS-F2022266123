import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";

function AddCourseLectures() {

    const courseDetails = useLocation().state;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        id: courseDetails?._id,
        lecture: undefined,
        title: "",
        description: "",
        previewSrc: "",
        fileType: "" // 'video' or 'document'
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(fileExtension);
        const isDocument = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt'].includes(fileExtension);

        if (!isVideo && !isDocument) {
            toast.error("Please upload a video or document file (PDF, DOC, PPT)");
            return;
        }

        const source = isVideo ? window.URL.createObjectURL(file) : null;

        setUserInput({
            ...userInput,
            lecture: file,
            previewSrc: source,
            fileType: isVideo ? 'video' : 'document'
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userInput.lecture || !userInput.title || !userInput.description) {
            toast.error("All fields are mandatory")
            return;
        }
        const response = await dispatch(addCourseLectures(userInput));
        if (response?.payload?.success) {
            navigate(-1);
            setUserInput({
                id: courseDetails?._id,
                lecture: undefined,
                title: "",
                description: "",
                previewSrc: "",
                fileType: ""
            })
        }
    }

    useEffect(() => {
        if (!courseDetails) navigate("/courses");
    }, [])

    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-5 sm:mx-16 md:mx-20">
                <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-[80vw] md:w-96  rounded-lg">
                    <header className="flex items-center justify-center relative">
                        <button
                            className="absolute left-2 text-2xl text-green-500"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className="text-xl text-yellow-500 font-semibold">
                            Add New Content
                        </h1>
                    </header>
                    <form
                        onSubmit={onFormSubmit} className="flex flex-col gap-3"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Enter the title of the lecture"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border"
                            value={userInput.title}
                        />
                        <textarea
                            type="text"
                            name="description"
                            placeholder="Enter the description of the lecture"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                            value={userInput.description}
                        />

                        {/* Preview Section */}
                        {userInput.lecture ? (
                            <div className="border rounded-lg p-4 text-center">
                                {userInput.fileType === 'video' ? (
                                    <video
                                        muted
                                        src={userInput.previewSrc}
                                        controls
                                        controlsList="nodownload nofullscreen"
                                        disablePictureInPicture
                                        className="object-fill rounded-lg w-full max-h-48"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-4">
                                        <span className="text-5xl">📄</span>
                                        <p className="text-sm text-gray-300">{userInput.lecture.name}</p>
                                        <p className="text-xs text-green-400">Document ready to upload</p>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    className="mt-2 text-red-400 text-sm hover:underline"
                                    onClick={() => setUserInput({ ...userInput, lecture: undefined, previewSrc: "", fileType: "" })}
                                >
                                    Remove file
                                </button>
                            </div>
                        ) : (
                            <div className="h-48 border flex flex-col items-center justify-center cursor-pointer rounded-lg hover:border-yellow-500 transition-all">
                                <label className="font-semibold cursor-pointer text-center" htmlFor="lecture">
                                    <span className="text-4xl block mb-2">📄 🎥</span>
                                    <span className="text-yellow-500">Choose PDF or Video</span>
                                    <p className="text-xs text-gray-400 mt-2">Supports: PDF, DOC, PPT, MP4, etc.</p>
                                </label>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="lecture"
                                    name="lecture"
                                    onChange={handleFile}
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,video/mp4,video/*"
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add Content
                        </button>
                    </form>
                </div>
            </div>
        </HomeLayout>
    )
}
export default AddCourseLectures;