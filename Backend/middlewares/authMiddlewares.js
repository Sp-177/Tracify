import { errorhandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/User.js";
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res
            .status(500)
            .json( new errorhandler(401, "Unauthorized request"))
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new errorhandler(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new errorhandler(401, error?.message || "Invalid access token")
    }
    
})  

export const isAdmin = async ( req,res,next)=>{
    try {
        const user = await User.findById(req.user._id);
        if(!user.role !== 1){
            return res.status(401).send({
                success: false,
                message: "UnAuthorizes Access",
            });
        }
        else{
            next();
        }
    } 
    catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in Admin middleware",
        });
    }
};