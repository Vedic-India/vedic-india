import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const addressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    password: {
      type: String,
      select: false,
      required: function () {
        return !this.googleId;
      }
    },
    googleId: {
      type: String,
      select: false
    },
    phone: { 
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"] 
    },
    role: { 
      type: String, 
      enum: ['customer', 'admin'], 
      default: 'customer' 
    },
    addresses: [addressSchema],
    refreshToken: {
      type: String,
      select: false
    },

    // password reset flow
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre("validate", function(next) {
    if (!this.password && !this.googleId) {
        return next(
            new Error("User must have either password or googleId")
        );
    }

    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model('User', userSchema);