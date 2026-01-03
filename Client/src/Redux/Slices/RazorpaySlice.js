import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

import axiosInstance from "../../Helpers/axiosinstance";

const initialState = {
    isSubscribed: false,
    enrolledCourses: [],
    subscriptionStatus: 'inactive'
}

export const enrollInBundle = createAsyncThunk("/enrollment/enroll", async () => {
    try {
        const response = axiosInstance.post("/enrollment/enroll");
        toast.promise(response, {
            loading: "Enrolling in courses...",
            success: (data) => {
                return data?.data?.message || "Successfully enrolled!";
            },
            error: (err) => err?.response?.data?.message || "Failed to enroll"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const getEnrolledCourses = createAsyncThunk("/enrollment/my-courses", async () => {
    try {
        const response = await axiosInstance.get("/enrollment/my-courses");
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch enrolled courses");
        throw error;
    }
});

export const updateProgress = createAsyncThunk("/enrollment/progress", async ({ courseId, lectureId }) => {
    try {
        const response = await axiosInstance.post(`/enrollment/progress/${courseId}/${lectureId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to update progress:", error);
        throw error;
    }
});

export const cancelEnrollment = createAsyncThunk("/enrollment/cancel", async () => {
    try {
        const response = axiosInstance.post("/enrollment/cancel");
        toast.promise(response, {
            loading: "Cancelling subscription...",
            success: (data) => {
                return data?.data?.message || "Subscription cancelled";
            },
            error: (err) => err?.response?.data?.message || "Failed to cancel"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

// Keep these for backward compatibility with existing code
export const getRazorPayId = createAsyncThunk("/razorpay/getId", async () => {
    return { key: "direct_enrollment" };
});

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    return { subscription_id: "direct_enrollment" };
});

export const verifyUserPayment = createAsyncThunk("/payments/verify", async () => {
    return { success: true, message: "Enrollment verified" };
});

export const getPaymentRecord = createAsyncThunk("/payments/record", async () => {
    try {
        const response = await axiosInstance.get("/enrollment/my-courses");
        return {
            allPayments: { count: response.data?.enrolledCourses?.length || 0 },
            finalMonths: {},
            monthlySalesRecord: []
        };
    } catch (error) {
        return { allPayments: { count: 0 }, finalMonths: {}, monthlySalesRecord: [] };
    }
});

export const cancelCourseBundle = createAsyncThunk("/payments/cancel", async () => {
    try {
        const response = axiosInstance.post("/enrollment/cancel");
        toast.promise(response, {
            loading: "Cancelling subscription...",
            success: (data) => {
                return data?.data?.message || "Subscription cancelled";
            },
            error: (err) => err?.response?.data?.message || "Failed to cancel"
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(enrollInBundle.fulfilled, (state, action) => {
                state.isSubscribed = true;
                state.subscriptionStatus = 'active';
                state.enrolledCourses = action?.payload?.enrolledCourses || [];
            })
            .addCase(getEnrolledCourses.fulfilled, (state, action) => {
                state.enrolledCourses = action?.payload?.enrolledCourses || [];
                state.subscriptionStatus = action?.payload?.subscriptionStatus || 'inactive';
                state.isSubscribed = action?.payload?.subscriptionStatus === 'active';
            })
            .addCase(cancelEnrollment.fulfilled, (state) => {
                state.isSubscribed = false;
                state.subscriptionStatus = 'inactive';
            })
            // Backward compatibility
            .addCase(getRazorPayId.fulfilled, (state, action) => {
                state.key = action?.payload?.key;
            })
            .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
                state.subscription_id = action?.payload?.subscription_id;
            })
            .addCase(verifyUserPayment.fulfilled, (state, action) => {
                toast.success(action?.payload?.message);
                state.isPaymentVerified = action?.payload?.success;
                state.isSubscribed = true;
            })
            .addCase(getPaymentRecord.fulfilled, (state, action) => {
                state.allPayments = action?.payload?.allPayments;
                state.finalMonths = action?.payload?.finalMonths;
                state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
            })
            .addCase(cancelCourseBundle.fulfilled, (state) => {
                state.isSubscribed = false;
                state.subscriptionStatus = 'inactive';
            })
    }
});

export default razorpaySlice.reducer;