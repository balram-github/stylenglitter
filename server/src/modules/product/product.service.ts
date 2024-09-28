import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductAmount } from './entities/product-amount.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { EditProductDto } from './dtos/edit-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductAmount)
    private productAmountRepository: Repository<ProductAmount>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  get(findOptions: FindManyOptions<Product>) {
    return this.productRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<Product>) {
    return this.productRepository.findOne(findOptions);
  }

  create(payload: CreateProductDto) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const product = this.productRepository.create({
        categoryId: payload.categoryId,
        description: payload.description,
        name: payload.name,
        qty: payload.qty,
        code: payload.code,
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

  edit(productId: number, payload: EditProductDto) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const product = await entityManager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const { amount, ...fields } = payload;

      Object.assign(product, fields);

      if (amount && Number(amount) !== Number(product.amount.price)) {
        await entityManager.softDelete(ProductAmount, { id: product.amountId });

        const newProductAmount = this.productAmountRepository.create({
          price: amount,
          product,
        });

        product.amount = await entityManager.save(newProductAmount);
      }

      await entityManager.save(product);
    });
  }
}
