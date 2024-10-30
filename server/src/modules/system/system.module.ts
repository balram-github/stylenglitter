import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { ProductThemeModule } from '../product-theme/product-theme.module';

@Module({
  imports: [ProductModule, CategoryModule, ProductThemeModule],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
