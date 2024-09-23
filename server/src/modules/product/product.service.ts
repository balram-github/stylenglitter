import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductAmount } from './entities/product-amount.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductAmount)
    private productAmountRepository: Repository<ProductAmount>,
  ) {}

  get(findOptions: FindManyOptions<Product>) {
    return this.productRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<Product>) {
    return this.productRepository.findOne(findOptions);
  }

  create(payload: CreateProductDto) {
    return this.productRepository.manager.transaction(async (entityManager) => {
      const product = this.productRepository.create({
        categoryId: payload.categoryId,
        description: payload.description,
        name: payload.name,
        qty: payload.qty,
      });

      const savedProductEntity = await entityManager.save(product);

      const productAmount = this.productAmountRepository.create({
        price: payload.amount,
        product: savedProductEntity,
      });

      const savedProductAmountEntity = await entityManager.save(productAmount);

      savedProductEntity.amountId = savedProductAmountEntity.id;

      return entityManager.save(savedProductEntity);
    });
  }
}
