import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
