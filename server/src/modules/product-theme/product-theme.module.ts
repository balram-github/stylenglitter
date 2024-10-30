import { forwardRef, Module } from '@nestjs/common';
import { ProductThemeController } from './product-theme.controller';
import { ProductThemeService } from './product-theme.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTheme } from './entities/product-theme.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductTheme]),
    forwardRef(() => ProductModule),
  ],
  controllers: [ProductThemeController],
  providers: [ProductThemeService],
  exports: [ProductThemeService],
})
export class ProductThemeModule {}
