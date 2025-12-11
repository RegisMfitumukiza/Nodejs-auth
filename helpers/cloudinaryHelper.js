import cloudinary from "../configurations/cloudinary.js";

export const uploadMediaToCloudinary = async (filepath) => {

    try {

        // const base64 = file.buffer.toString('base64');
        // const dataURI = `data:${file.mimetype};base64,${base64}`;

        const result = await cloudinary.uploader.upload(filepath, {
            folder: 'User_Images',
            resource_type: 'auto'
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
        
    } catch (error) {
        console.error('Error while uploading to cloudinary', error.message);
        throw new Error('Error while uploading to cloudinary');
    }
}
