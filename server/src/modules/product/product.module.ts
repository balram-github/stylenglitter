import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductAmount } from './entities/product-amount.entity';
import { ProductImage } from './entities/product-image.entity';
import { CategoryModule } from '../category/category.module';
import { ProductThemeModule } from '../product-theme/product-theme.module';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductThemeModule),
    TypeOrmModule.forFeature([Product, ProductAmount, ProductImage]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
