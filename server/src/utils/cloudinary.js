import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath)return null
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "image",
        });
        if(fs.existsSync(localFilePath)){
            await fs.promises.unlink(localFilePath)
        }
        return {
            url: response.secure_url,
            publicId: response.public_id,
        };
    } catch (error) {
        if(fs.existsSync(localFilePath)){
            await fs.promises.unlink(localFilePath)
        }
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try{
        if (!publicId) return null

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        })

        return result
    }
    catch(error){
        console.error("Cloudinary delete failed:", error)
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}