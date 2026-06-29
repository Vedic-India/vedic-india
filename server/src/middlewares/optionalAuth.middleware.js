import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const optionalVerifyJWT = asyncHandler(async (req, res, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
    if(!token){
        return next()
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        return next()
    }

    const user = await User.findById(decodedToken._id)
    if(!user){
        return next()
    }

    req.user = user

    next()
})