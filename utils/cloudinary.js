import { v2 as cloudinary } from "cloudinary";  // ← must be at top, outside the function
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload_OnCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    fs.unlinkSync(file);
    return result;
  } catch (error) {
    fs.unlinkSync(file);
    console.log(error);
    return null;
  }
};

export default upload_OnCloudinary;