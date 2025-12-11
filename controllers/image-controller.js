import Image from '../models/Image.js';
import { uploadMediaToCloudinary } from '../helpers/cloudinaryHelper.js';
import cloudinary from '../configurations/cloudinary.js';

import fs from 'fs/promises';

export const uploadImageController = async (req, res) => {

    try {

        //check if the file is missing in the request object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. please upload an image'
            })
        }

        //upload to cloudinary
        const { url, publicId } = await uploadMediaToCloudinary(req.file.path);

        //store image url and public Id along with the uploaded user in db
        const newUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        })

        await newUploadedImage.save();

        //delete the file from local storage
        try {
            await fs.unlink(req.file.path);

        } catch (error) {
            console.log('Failed to delete local file:', error.message);
        }

        if (newUploadedImage) {

            return res.status(201).json({
                success: true,
                message: 'Image uploaded successfully',
                data: newUploadedImage
            });

        } else {
            return res.status(201).json({
                success: false,
                message: 'unable to upload image successfully',
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        })
    }
}


export const getAllImagesConttroller = async (req, res) => {
    try {

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 3, 50);
        const skip = ( page -1 ) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const allowedSort = ['createdAt', 'uploadedBy', 'url', 'publicId'];
        
        if(!allowedSort.includes(sortBy))  {
            sortBy = 'createdAt'
        }

        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil( totalImages / limit);

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit).populate('uploadedBy', 'username email');

        if (images) {
            return res.status(200).json({
                success: true,
                message: 'Images retrieved successfully',
                currentPage: page,
                totalImages: totalImages,
                totalPages: totalPages,
                data: images
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        })
    }
}

export const deleteImageController = async (req, res) => {

    try {

        const imageToBeDeletedId = req.params.id;

        const userId = req.userInfo.userId;

        // check if image exist

        const image = await Image.findById(imageToBeDeletedId);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            })
        }

        //check user who uploaded and the one to delete 

        if (image.uploadedBy.toString() !== userId) {
            return res.status().json({
                success: false,
                message: 'User Denied to delete the image'
            })
        }

        // delete image from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // delete from database

        const deletedImage = await Image.findByIdAndDelete(imageToBeDeletedId);

        if (!deletedImage) {
            return res.status(400).json({
                success: false,
                message: 'Unable to delete Image',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Image successfully deleted',
            data: deletedImage
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again.'
        })
    }
}





