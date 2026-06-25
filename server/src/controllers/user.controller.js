import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

//TODO: handle 401 errors apart from auth middleware
//DELETE USER
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

const validatePhoneNumber = (phone) => {
    if (!phone?.trim()) {
        throw new ApiError(400, "Phone number is required");
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        throw new ApiError(400, "Invalid phone number");
    }
}

const validatePassword = (password) => {
    if (!password?.trim()) {
        throw new ApiError(400, "Password is required");
    }

    if (password.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one uppercase and one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
        throw new ApiError(400, "Password must contain at least one number");
    }
}

const mergeGuestCartToUserCart = async (guestId, userId) => {
    if (!guestId) return;

    const guestCart = await Cart.findOne({
        guestId
    });

    if (!guestCart) return;

    let userCart = await Cart.findOne({
        user: userId
    });

    if (!userCart) {
        guestCart.user = userId;
        guestCart.guestId = undefined;

        await guestCart.save();
        return;
    }

    for (const guestItem of guestCart.items) {
        const existingItem = userCart.items.find(
            item =>
                item.product.toString() ===
                guestItem.product.toString()
        );

        if (existingItem) {
            existingItem.quantity = Math.min( existingItem.quantity + guestItem.quantity, 10 );
        } else {
            userCart.items.push(guestItem);
        }
    }

    await userCart.save();

    await Cart.findByIdAndDelete(
        guestCart._id
    );
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = asyncHandler(async (req, res) => {
    const { credential, guestId } = req.body;

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

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    user.googleId = sub;

    await user.save({validateBeforeSave: false});

    await mergeGuestCartToUserCart(guestId, user._id);

    const loggedInUser = await User.findById(user._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenOptions)
    .cookie("refreshToken", refreshToken, refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in with Google successfully")
    );
});

const registerUser = asyncHandler(async (req,res)=>{

    const {name, email, password, phone = null, guestId} = req.body

    if(!name?.trim() || !email?.trim()){
        throw new ApiError(400, "All fields are required")
    }

    if(phone) validatePhoneNumber(phone); 

    validatePassword(password);

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

    await mergeGuestCartToUserCart(guestId, user._id);

    const loggedInUser = await User.findById(user._id)

    return res
    .status(201)
    .cookie("accessToken",accessToken,accessTokenOptions)
    .cookie("refreshToken",refreshToken,refreshTokenOptions)
    .json(
        new ApiResponse(200, loggedInUser, "user created and logged in successfully")
    )
})

const loginUser = asyncHandler(async (req,res)=>{

    const {email, password, guestId} = req.body

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
        throw new ApiError(401, "Invalid email or password")
    }
    if(!user.password){
        throw new ApiError(401, "This email is registered with Google. Please login using Google Sign-In.")
    }
    
    const passwordCorrect = await user.isPasswordCorrect(password) 
    if(!passwordCorrect){
        throw new ApiError(401, "Invalid email or password")
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({validateBeforeSave: false})

    await mergeGuestCartToUserCart(guestId, user._id);

    const loggedInUser = await User.findById(user._id)

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

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");

    // Don't reveal whether user exists
    if (!user) {
        return res
            .status(200)
            .json(
            new ApiResponse(
                200,{},"If an account with that email exists, a reset link has been sent."
            )
        );
    }

    if (!user.password) {
        throw new ApiError(400,"Password reset is not available for Google accounts.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try{
        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Reset Password</h2>

                    <p>
                        We received a request to reset your password.
                    </p>

                    <p>
                        Click the button below:
                    </p>

                    <a
                        href="${resetUrl}"
                        style="
                            display:inline-block;
                            padding:12px 20px;
                            background:#000;
                            color:white;
                            text-decoration:none;
                            border-radius:6px;
                        "
                    >
                        Reset Password
                    </a>

                    <p>
                        This link expires in 15 minutes.
                    </p>

                    <p>
                        If you didn't request this, ignore this email.
                    </p>
                </div>
            `
        });
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
        throw new ApiError(500, "Failed to send reset password email");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {},"If an account with that email exists, a reset link has been sent.")
    );
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    validatePassword(password);

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    }).select("+password +refreshToken +resetPasswordToken +resetPasswordExpires");

    if (!user) {
        throw new ApiError(400, "Reset token is invalid or expired");
    }

    user.password = password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.refreshToken = undefined; // Invalidate existing refresh tokens

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password reset successfully")
    );
});

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

    return res
    .status(200)
    .cookie("accessToken",accessToken,accessTokenOptions)
    .cookie("refreshToken",newRefreshToken,refreshTokenOptions)
    .json( new ApiResponse(200, {}, "Access token refreshed"))

})

const changeCurrentPassword = asyncHandler(async (req,res)=>{
    const { oldPassword, newPassword} = req.body

    if(!oldPassword?.trim()) throw new ApiError(400, "Current Password is required");

    validatePassword(newPassword);

    if(oldPassword === newPassword){
        throw new ApiError(400, "New password cannot be same as old password")
    }

    const user = await User.findById(req.user._id).select("+password +refreshToken")

    if(!user.password) {
        throw new ApiError(400, "Password change is not available for Google accounts.");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Password is incorrect")
    }

    user.password = newPassword

    user.refreshToken = undefined;

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
    validatePhoneNumber(phone);

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
    if(!fullName?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()){
        throw new ApiError(400, "All fields except addressLine2 are required")
    }

    validatePhoneNumber(phone);

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

    user.addresses.pull(addressId);

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

    if(!fullName?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()){
        throw new ApiError(400, "All fields except addressLine2 are required")
    }

    validatePhoneNumber(phone);

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    address.fullName = fullName;
    address.phone = phone;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.pincode = pincode;

    await user.save({validateBeforeSave: false});

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Address updated successfully"));
});

export {
    googleLogin,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
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