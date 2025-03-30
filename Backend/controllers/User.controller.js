import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { errorhandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, age, password, role, familyHead } = req.body;

    if (!name || !email || !age || !password || !role) {
        return res.status(400).json(new errorhandler(400, "All fields are required"));
    }

    if (role === "family member" && !familyHead) {
        return res.status(400).json(new errorhandler(400, "Family member must have a family head email"));
    }

    if (role === "individual") {
        req.body.familyHead = undefined;
    }
    const options = {
        httpOnly: true,
        secure: true, // Only secure in production
        sameSite: "None", // Required for cross-origin cookies
    };
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json(new errorhandler(400, "User already exists"));
    }
    const user = await User.create(req.body);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    return res.status(201).cookie("accessToken", accessToken , options).cookie("refreshToken", refreshToken , options).json(new ApiResponse(201,{accessToken, refreshToken, user}, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json(new errorhandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
        return res.status(401).json(new errorhandler(401, "Invalid credentials"));
    }
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).cookie("accessToken", accessToken , options).cookie("refreshToken", refreshToken , options).json(new ApiResponse(200, { accessToken, refreshToken, user }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        return res.status(401).json(new errorhandler(401, "Unauthorized request"));
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decodedToken.id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json(new errorhandler(401, "Invalid refresh token"));
        }
        const accessToken = user.generateAccessToken();
        return res.status(200).cookie("accessToken", accessToken).json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
    } catch (error) {
        return res.status(401).json(new errorhandler(401, "Invalid refresh token"));
    }
});
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        return res.status(404).json(new errorhandler(404, "User not found"));
    }
    return res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !(await user.isPasswordCorrect(oldPassword))) {
        return res.status(400).json(new errorhandler(400, "Invalid old password"));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json(new errorhandler(400, "All fields are required"));
    }
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { name, email } }, { new: true }).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

export { registerUser, loginUser,getUserProfile, logoutUser, refreshAccessToken, changeCurrentPassword, updateAccountDetails };
