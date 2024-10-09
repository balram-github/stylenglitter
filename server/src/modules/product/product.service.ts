import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductAmount } from './entities/product-amount.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { EditProductDto } from './dtos/edit-product.dto';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductAmount)
    private productAmountRepository: Repository<ProductAmount>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  get(findOptions: FindManyOptions<Product>) {
    return this.productRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<Product>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.findOne(Product, findOptions);

    return this.productRepository.findOne(findOptions);
  }

  create(payload: CreateProductDto) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      // Create ProductImage entities for each URL
      const images = payload.productImages.map((imageUrl) => {
        return this.productImageRepository.create({
          url: imageUrl,
        });
      });

      const product = this.productRepository.create({
        categoryId: payload.categoryId,
        description: payload.description,
        name: payload.name,
        qty: payload.qty,
        code: payload.code,
        images,
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

  private async editProduct(
    productId: number,
    payload: EditProductDto,
    entityManager: EntityManager,
  ) {
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
  }

  edit(
    productId: number,
    payload: EditProductDto,
    entityManager?: EntityManager,
  ) {
    if (entityManager) {
      return this.editProduct(productId, payload, entityManager);
    }

    return this.dataSource.manager.transaction(async (entityManager) => {
      return this.editProduct(productId, payload, entityManager);
    });
  }

  delete(productId: number) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const product = await entityManager.findOne(Product, {
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      await entityManager.softDelete(Product, { id: productId });
    });
  }
}
