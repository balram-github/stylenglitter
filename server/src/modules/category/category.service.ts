import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import {
  GetCategoryProductsDto,
  ProductAvailability,
  ProductSortBy,
} from './dtos/get-category-products.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  get(findOptions?: FindManyOptions<Category>) {
    return this.categoryRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<Category>) {
    return this.categoryRepository.findOne(findOptions);
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
    options: GetCategoryProductsDto,
  ): Promise<{
    products: Product[];
    hasNext: boolean;
  }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.amount', 'amount')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.categoryId = :categoryId', { categoryId });

    // Apply availability filter
    if (options.availability) {
      switch (options.availability) {
        case ProductAvailability.IN_STOCK:
          query.andWhere('product.qty > 0');
          break;
        case ProductAvailability.OUT_OF_STOCK:
          query.andWhere('product.qty = 0');
          break;
      }
    }

    // Apply price range filter
    if (options.minPrice !== undefined) {
      query.andWhere('amount.price >= :minPrice', {
        minPrice: options.minPrice,
      });
    }

    if (options.maxPrice !== undefined) {
      query.andWhere('amount.price <= :maxPrice', {
        maxPrice: options.maxPrice,
      });
    }

    // Apply sorting
    if (options.sortBy) {
      switch (options.sortBy) {
        case ProductSortBy.PRICE_HIGH_TO_LOW:
          query.orderBy('amount.price', 'DESC');
          break;
        case ProductSortBy.PRICE_LOW_TO_HIGH:
          query.orderBy('amount.price', 'ASC');
          break;
        case ProductSortBy.DATE_ADDED_DESC:
          query.orderBy('product.createdAt', 'DESC');
          break;
        case ProductSortBy.DATE_ADDED_ASC:
          query.orderBy('product.createdAt', 'ASC');
          break;
      }
    }

    // Apply pagination
    const limit = options.limit ?? 10;
    const page = options.page ?? 1;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit + 1);

    const products = await query.getMany();
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
