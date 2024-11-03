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
    @InjectRepository(ProductAmount)
    private productAmountRepository: Repository<ProductAmount>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  get(findOptions: FindManyOptions<Product>) {
    return this.productRepository.find(findOptions);
  }

  getOne(findOptions: FindOneOptions<Product>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.findOne(Product, findOptions);

    return this.productRepository.findOne(findOptions);
  }

  async create(
    payload: CreateProductDto,
    entityManager: EntityManager,
  ): Promise<Product> {
    const product = this.productRepository.create({
      categoryId: payload.categoryId,
      productThemeId: payload.productThemeId,
      description: payload.description,
      name: payload.name,
      qty: payload.qty,
      code: payload.code,
    });

    const savedProductEntity = await entityManager.save(product);

    // Create ProductImage entities for each URL
    const promisesToRun = payload.productImages.map((imageUrl) => {
      const image = this.productImageRepository.create({
        url: imageUrl,
        productId: savedProductEntity.id,
      });

      return entityManager.save(image);
    });

    const productAmount = this.productAmountRepository.create({
      price: payload.amount,
      basePrice: payload.baseAmount,
      productId: savedProductEntity.id,
    });

    const savedProductAmountEntity = await entityManager.save(productAmount);

    savedProductEntity.amountId = savedProductAmountEntity.id;

    await Promise.all(promisesToRun);

    return entityManager.save(savedProductEntity);
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

  async upsert(payload: CreateProductDto) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const existing = await this.productRepository.findOne({
        where: { code: payload.code },
      });

      if (existing) {
        // Update existing product
        const productAmount = await this.productAmountRepository.findOne({
          where: { productId: existing.id },
        });

        if (productAmount) {
          // Update amount
          Object.assign(productAmount, {
            price: payload.amount,
            basePrice: payload.baseAmount,
          });
          await entityManager.save(productAmount);
        }

        // Soft delete existing product images
        await entityManager.softDelete(ProductImage, {
          productId: existing.id,
        });

        // Create new product images
        const newImages = payload.productImages.map((url) =>
          this.productImageRepository.create({
            url,
            productId: existing.id,
          }),
        );
        await entityManager.save(newImages);

        // Update product
        Object.assign(existing, {
          name: payload.name,
          code: payload.code,
          description: payload.description,
          qty: payload.qty,
          categoryId: payload.categoryId,
          productThemeId: payload.productThemeId,
        });

        return entityManager.save(existing);
      }

      // Create new product using existing create method
      return this.create(payload, entityManager);
    });
  }
}
