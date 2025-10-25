import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
    "path": "./.env"
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        // upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "roomezy",
            resource_type: "auto",
        })
        // file uploaded on cloudinary
        fs.unlinkSync(localFilePath); // remove file from local uploads folder

        console.log("File uploaded on cloudinary", response.url); 
        return response;
    }
    catch(err){
        try {
            fs.unlinkSync(localFilePath);
        } catch (e) {
            console.error(
                "Failed to delete local file after failed upload:",
                localFilePath,
                e
            );
        } // remove file from local uploads files as the upload failed
        console.log("Error in uploading on cloudinary", err);
        return null;
    }
}

export {uploadOnCloudinary};