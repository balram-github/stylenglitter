import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductThemeService } from './product-theme.service';
import { ProductTheme } from './entities/product-theme.entity';
import { Product } from '../product/entities/product.entity';
import { CreateProductThemeDto } from './dtos/create-product-theme.dto';
import { GetThemeProductsDto } from './dtos/get-theme-products.dto';

@ApiTags('Product Themes')
@Controller('product-themes')
export class ProductThemeController {
  constructor(private productThemeService: ProductThemeService) {}

  @Get('/')
  async getProductThemes() {
    return this.productThemeService.get();
  }

  @Get('/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<ProductTheme> {
    const productTheme = await this.productThemeService.getBySlug(slug);

    if (!productTheme) {
      throw new NotFoundException('Product theme not found');
    }

    return productTheme;
  }

  @Get('/:slug/products')
  async getProducts(
    @Param('slug') slug: string,
    @Query() query: GetThemeProductsDto,
  ): Promise<{
    products: Product[];
    hasNext: boolean;
  }> {
    const productTheme = await this.productThemeService.getBySlug(slug);

    if (!productTheme) {
      throw new NotFoundException('Product theme not found');
    }

    return this.productThemeService.getProductsById(productTheme.id, query);
  }

  @Post('/')
  async createProductTheme(
    @Body() body: CreateProductThemeDto,
  ): Promise<ProductTheme> {
    return this.productThemeService.create(body);
  }
}
