import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTheme } from './entities/product-theme.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateProductThemeDto } from './dtos/create-product-theme.dto';
import { Pagination } from '@/types/pagination.type';

@Injectable()
export class ProductThemeService {
  constructor(
    @InjectRepository(ProductTheme)
    private productThemeRepository: Repository<ProductTheme>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  get(findOptions?: FindManyOptions<ProductTheme>) {
    return this.productThemeRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<ProductTheme>) {
    return this.productThemeRepository.findOne(findOptions);
  }

  async upsert(
    findOptions: FindOneOptions<ProductTheme>,
    payload: CreateProductThemeDto,
  ) {
    const existing = await this.productThemeRepository.findOne(findOptions);

    if (existing) {
      return existing;
    }

    return this.create(payload);
  }

  getBySlug(slug: string) {
    return this.productThemeRepository.findOne({ where: { slug } });
  }

  async getProductsById(
    productThemeId: number,
    { page, limit }: Pagination = { page: 1, limit: 10 },
  ) {
    const products = await this.productService.get({
      where: { productThemeId },
      skip: (page - 1) * limit,
      take: limit + 1,
      order: { createdAt: 'DESC' },
    });

    const hasNext = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNext,
    };
  }

  create(payload: CreateProductThemeDto) {
    const category = this.productThemeRepository.create(payload);

    return this.productThemeRepository.save(category);
  }
}
