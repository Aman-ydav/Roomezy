import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type } from "os";


const userSchema = new Schema({
    userName: {
        type: String, 
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String, 
        required: true, 
        unique: true 
    },
    age: {
        type: Number,
        required: true
    },
    avatar: {
        type: String, // cloudinary url
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    preferred_locations: {
        type: String,
        index: true
    },
    budget: { 
        type: Number 
    },
    roommate_preferences: {
        type: String 
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: { 
        type: String
    },
    resetPasswordExpire: {
        type: Date
    }

},{timestamps: true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
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
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
