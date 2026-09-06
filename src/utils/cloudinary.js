import { v2 as cloudinary } from "cloudinary";
import { cloudName, apiKey, apiSecret } from "../config/loadEnv.js";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
