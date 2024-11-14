import { Module } from '@nestjs/common';
import { ProductThemeController } from './product-theme.controller';
import { ProductThemeService } from './product-theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTheme } from './entities/product-theme.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTheme, Product])],
  controllers: [ProductThemeController],
  providers: [ProductThemeService],
  exports: [ProductThemeService],
})
export class ProductThemeModule {}
