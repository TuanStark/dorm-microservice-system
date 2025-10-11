import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './uploads.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Upload 1 ảnh
  @Post()
  @UseInterceptors(FilesInterceptor('file'))
  async uploadSingle(@UploadedFiles() files: Express.Multer.File[]) {
    const result = await this.uploadService.uploadImage(files[0]);
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  // Upload nhiều ảnh
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await Promise.all(
      files.map((file) => this.uploadService.uploadImage(file)),
    );

    return results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));
  }

  @Delete()
  async deleteImage(@Body('publicId') publicId: string) {
    return this.uploadService.deleteImage(publicId);
  }
}
