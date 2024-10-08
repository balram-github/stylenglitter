import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { ProductService } from '@modules/product/product.service';
import { Pagination } from '@/types/pagination.type';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  get(findOptions?: FindManyOptions<Category>) {
    return this.categoryRepository.find(findOptions);
  }

  async upsert(
    findOptions: FindOneOptions<Category>,
    payload: CreateCategoryDto,
  ) {
    const existing = await this.categoryRepository.findOne(findOptions);

    if (existing) {
      return existing;
    }

    return this.create(payload);
  }

  getBySlug(slug: string) {
    return this.categoryRepository.findOne({ where: { slug } });
  }

  async getProductsById(
    categoryId: number,
    { page, limit }: Pagination = { page: 1, limit: 10 },
  ) {
    const products = await this.productService.get({
      where: { category: { id: categoryId } },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit + 1,
    });

    const hasNext = products.length > limit;

    return {
      products: products.slice(0, limit),
      hasNext,
    };
  }

  create(payload: CreateCategoryDto) {
    const category = this.categoryRepository.create(payload);

    return this.categoryRepository.save(category);
  }
}
