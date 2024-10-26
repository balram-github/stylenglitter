import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import * as XLSX from 'xlsx';
import { parseSheetDataToProductData } from './utils/xlsx-parser';
import { ProductService } from './product.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { EditProductDto } from './dtos/edit-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from '../category/category.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  /**
   * Get a product
   */
  @Get('/:slug')
  async getProduct(@Param('slug') slug: string): Promise<Product> {
    const product = await this.productService.getOne({ where: { slug } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * Create a product
   */
  @Post('/')
  async createProduct(@Body() payload: CreateProductDto): Promise<Product> {
    return this.productService.create(payload);
  }

  /**
   * Create products in bulk via xlsx
   */
  @Post('upload')
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
  async uploadDocx(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const productSheetName = workbook.SheetNames.find(
      (name) => name === 'Products',
    );

    if (!productSheetName) {
      throw new BadRequestException('Products sheet not found');
    }

    const sheet = workbook.Sheets[productSheetName];

    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]; // Array of rows

    const productsData = parseSheetDataToProductData(sheetData);

    for (const data of productsData) {
      const category = await this.categoryService.upsert(
        { where: { name: data.categoryName } },
        { name: data.categoryName, coverImgUrl: data.images[0] || '' },
      );

      await this.productService.create({
        amount: data.price,
        baseAmount: data.basePrice,
        categoryId: category.id,
        code: data.code,
        description: data.description,
        name: data.name,
        productImages: data.images,
        qty: data.qty,
      });
    }

    return { message: 'Products created successfully' };
  }

  /**
   * Edit a product
   */
  @Patch('/:productId')
  async editProduct(
    @Param('productId') productId: number,
    @Body() payload: EditProductDto,
  ) {
    return this.productService.edit(productId, payload);
  }

  /**
   * Delete a product
   */
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: number) {
    return this.productService.delete(productId);
  }
}
