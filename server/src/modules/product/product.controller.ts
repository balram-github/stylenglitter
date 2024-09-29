import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { EditProductDto } from './dtos/edit-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

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
