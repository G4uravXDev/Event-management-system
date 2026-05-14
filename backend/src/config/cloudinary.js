import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "eventone/posters",
        });

        console.log("File uploaded on Cloudinary!");
        unlink(localFilePath); // clean up after successful upload
        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        try { unlink(localFilePath); } catch {} // clean up on failure too
        return null;
    }
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
    try {
        if (!cloudinaryUrl) return null;

        // Extract public_id from URL
        const parts = cloudinaryUrl.split("/");
        const fileWithExt = parts[parts.length - 1]; 
        const publicId = fileWithExt.split(".")[0];  

        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Old file deleted from Cloudinary:", result);
        return result;
    } catch (error) {
        console.error("Cloudinary deletion failed:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
