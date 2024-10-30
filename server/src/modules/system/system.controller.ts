import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { SystemService } from './system.service';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  /**
   * Create products in bulk via xlsx
   */
  @Post('products/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a .xlsx file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProducts(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.systemService.uploadProducts(file);
  }

  /**
   * Create categories in bulk via xlsx
   */
  @Post('categories/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a .xlsx file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCategories(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.systemService.uploadCategories(file);
  }

  /**
   * Create product themes in bulk via xlsx
   */
  @Post('product-themes/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a .xlsx file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductThemes(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.systemService.uploadProductThemes(file);
  }
}
