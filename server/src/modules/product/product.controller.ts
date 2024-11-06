import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';
import { EditProductDto } from './dtos/edit-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  /**
   * Get a product by slug
   */
  @Get('/slug/:slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<Product> {
    const product = await this.productService.getOne({ where: { slug } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * Get a product by id
   */
  @Get('/:id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    const product = await this.productService.getOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * Create a product
   */
  @Put('/')
  async createProduct(@Body() payload: CreateProductDto): Promise<Product> {
    return this.productService.upsert(payload);
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
