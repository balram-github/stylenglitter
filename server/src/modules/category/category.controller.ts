import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './category.entity';
import { Product } from '../product/entities/product.entity';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  async getCategories() {
    return this.categoryService.get();
  }

  @Get('/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<Category> {
    const category = await this.categoryService.getBySlug(slug);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  @Get('/:slug/products')
  async getProducts(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    products: Product[];
    hasNext: boolean;
  }> {
    const category = await this.categoryService.getBySlug(slug);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoryService.getProductsById(category.id, { page, limit });
  }

  @Post('/')
  async createCategory(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(body);
  }
}
