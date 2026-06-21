import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

//TODO: handle 401 errors apart from auth middleware
//DELETE USER

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        throw new ApiError(400, "Google token missing");
    }

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.email_verified) {
        throw new ApiError(401, "Invalid Google account");
    }

    const { email, sub } = payload;

    let user = await User.findOne({
        $or: [
            { email: email.trim().toLowerCase() },
            { googleId: sub }
        ]
    }).select("+googleId");

    if (!user) {
        user = await User.create({
            name: payload.name || email.split("@")[0],
            email,
            googleId: sub
        });
    }
    else if (user.googleId && user.googleId !== sub) {
        throw new ApiError(401, "Invalid Google account");
    }
    else if (!user.googleId) {
        throw new ApiError(409, "A user with the same email already exists. Please login using email and password.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave: false});

    const loggedInUser = await User.findById(user._id);

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000  // 10 days
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in with Google successfully")
    );
});

const registerUser = asyncHandler(async (req,res)=>{

    const {name, email, password, phone = null} = req.body

    if(!name?.trim() || !email?.trim() || !password?.trim()){
        throw new ApiError(400, "All fields are required")
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    const existedUser = await User.findOne({
        email: email.trim().toLowerCase()
    })

    if(existedUser){
        throw new ApiError(409,"User with same email already exists")
    }

    const user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone?.trim() || null
    })

    if(!user){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id)

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000  // 10 days
    }

    return res
    .status(201)
    .cookie("accessToken",accessToken,accessTokenOptions)
    .cookie("refreshToken",refreshToken,refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "user created and logged in successfully")
    )
})

const loginUser = asyncHandler(async (req,res)=>{

    const {email, password} = req.body

    if(!email?.trim()){
        throw new ApiError(400,"Email is required")
    }
    if(!password?.trim()){
        throw new ApiError(400,"Password is required")
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select("+password +googleId")
    if(!user){
        throw new ApiError(404, "No user found")
    }
    if(user.googleId){
        throw new ApiError(400, "This email is registered with Google. Please login using Google Sign-In.")
    }
    
    const passwordCorrect = await user.isPasswordCorrect(password) 
    if(!passwordCorrect){
        throw new ApiError(401, "Password is incorrect")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({validateBeforeSave: false})

    const loggedInUser = await User.findById(user._id)

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000  // 10 days
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,accessTokenOptions)
    .cookie("refreshToken",refreshToken,refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "user logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorised request")
    }

    let decodedToken;
    try{
        decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    }catch(error){
        throw new ApiError(401,"Invalid refresh token")
    }
    
    const user = await User.findById(decodedToken._id)
    if(!user){
        throw new ApiError(401,"Invalid refresh token")
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "refresh token is expired or used")
    }

    const accessToken = user.generateAccessToken()
    const newRefreshToken = user.generateRefreshToken()

    user.refreshToken = newRefreshToken
    await user.save({validateBeforeSave: false})

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000  // 1 day
    }

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 10 * 24 * 60 * 60 * 1000  // 10 days
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,accessTokenOptions)
    .cookie("refreshToken",newRefreshToken,refreshTokenOptions)
    .json( new ApiResponse(200, {}, "Access token refreshed"))

})

const changeCurrentPassword = asyncHandler(async (req,res)=>{
    if(req.user.googleId){
        throw new ApiError(400, "Password change is not allowed for Google authenticated accounts.")
    }

    const { oldPassword, newPassword} = req.body

    if(!oldPassword?.trim()) throw new ApiError(400, "Current Password is required");
    if(!newPassword?.trim()) throw new ApiError(400, "New Password is required");

    const user = await User.findById(req.user._id).select("+password")

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Password is incorrect")
    }

    if(oldPassword === newPassword){
        throw new ApiError(400, "New password cannot be same as old password")
    }

    user.password = newPassword

    await user.save()

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse( 200, req.user, "Current user fetched successfully"))
})

const updateName = asyncHandler(async (req,res)=>{
    const {name} = req.body
    if(!name?.trim()){
        throw new ApiError(400, "Name is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                name: name.trim()
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Name updated successfully"))
})

const updatePhone = asyncHandler(async (req,res)=>{
    const {phone} = req.body
    if(!phone?.trim()){
        throw new ApiError(400, "Phone number is required")
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                phone: phone.trim()
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Phone number updated successfully"))
})


const addAddress = asyncHandler(async (req,res) => {

    const { fullName, phone, addressLine1, addressLine2 = null, city, state, pincode, isDefault = false} = req.body
    if(!fullName?.trim() || !phone?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()){
        throw new ApiError(400, "All fields except addressLine2 are required")
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    const user = await User.findById(req.user._id);

    if (isDefault) {
        user.addresses.forEach(addr => {
            addr.isDefault = false;
        });
    }

    user.addresses.push({
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault
    });

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Address added successfully"));
});

const deleteAddress = asyncHandler(async (req,res) => {
    const { addressId } = req.params
    if(!addressId?.trim() || !mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid address ID")
    }

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Address deleted successfully"));
});


const makeAddressDefault = asyncHandler(async (req,res) => {
    const { addressId } = req.params

    if(!addressId?.trim() || !mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid address ID")
    }

    const user = await User.findById(req.user._id);

    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    user.addresses.forEach(addr => {
        addr.isDefault =
            addr._id.toString() === addressId;
    });

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Default address updated successfully"));
});

const editAddress = asyncHandler(async (req,res) => {
    const { addressId } = req.params
    const { fullName, phone, addressLine1, addressLine2 = null, city, state, pincode} = req.body

    if(!addressId?.trim() || !mongoose.Types.ObjectId.isValid(addressId)){
        throw new ApiError(400, "Invalid address ID")
    }

    if(!fullName?.trim() || !phone?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()){
        throw new ApiError(400, "All fields except addressLine2 are required")
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    user.addresses = user.addresses.map(addr => {
        if(addr._id.toString() === addressId){
            return {
                ...addr,
                fullName,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                pincode
            };
        }
        return addr;
    });

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Address updated successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateName,
    updatePhone,
    makeAddressDefault,
    addAddress,
    deleteAddress,
    editAddress
}