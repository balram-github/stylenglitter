import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ProductService } from '@modules/product/product.service';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private productService: ProductService,
  ) {}
}
