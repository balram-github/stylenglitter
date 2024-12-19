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

  get(findOptions: FindManyOptions<Product>, entityManager?: EntityManager) {
    if (entityManager) return entityManager.find(Product, findOptions);

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
        product: savedProductEntity,
      });

      return entityManager.save(image);
    });

    const productAmount = this.productAmountRepository.create({
      price: payload.amount,
      basePrice: payload.baseAmount,
      productId: savedProductEntity.id,
      product: savedProductEntity,
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
      const existing = await entityManager.findOne(Product, {
        where: { code: payload.code },
      });

      if (existing) {
        // Update existing product first
        Object.assign(existing, {
          name: payload.name,
          code: payload.code,
          description: payload.description,
          qty: payload.qty,
          categoryId: payload.categoryId,
          productThemeId: payload.productThemeId,
        });

        // Save the updated product
        const savedProduct = await entityManager.save(existing);

        // Update amount
        const productAmount = await entityManager.findOne(ProductAmount, {
          where: { productId: savedProduct.id },
        });

        if (productAmount) {
          Object.assign(productAmount, {
            price: payload.amount,
            basePrice: payload.baseAmount,
          });
          await entityManager.save(productAmount);
        }

        // Delete existing images
        await entityManager.delete(ProductImage, {
          productId: savedProduct.id,
        });

        // Create new images after product is saved
        const imagePromises = payload.productImages.map((imageUrl) => {
          const image = this.productImageRepository.create({
            url: imageUrl,
            productId: savedProduct.id,
            product: savedProduct,
          });
          return entityManager.save(image);
        });

        await Promise.all(imagePromises);

        return savedProduct;
      }

      // Create new product using existing create method
      return this.create(payload, entityManager);
    });
  }
}
