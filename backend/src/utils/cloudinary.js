import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import "../config.js";

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

const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;

    
    const urlParts = fileUrl.split("/upload/")[1];
    if (!urlParts) throw new Error("Invalid Cloudinary URL");

   
    const cleaned = urlParts.replace(/v\d+\//, ""); 

   
    const publicId = cleaned.substring(0, cleaned.lastIndexOf(".")); 

    // Call Cloudinary API to delete
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      console.warn(`Cloudinary file not found for public_id: ${publicId}`);
    }
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
    return null;
  }
};

export {uploadOnCloudinary, deleteFromCloudinary};