import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('Product')
@Controller('product')
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
}
