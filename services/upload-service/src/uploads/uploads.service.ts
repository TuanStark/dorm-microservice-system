import { HttpException, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'booking-app' },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed, no result returned'));
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteImage(publicId: string): Promise<{ message: string }> {
        try {
            await cloudinary.uploader.destroy(publicId);
            return { message: `Image ${publicId} deleted successfully` };
        } catch (error) {
            throw new HttpException(`Failed to delete image: ${error.message}`, 500);
        }
    }
}
