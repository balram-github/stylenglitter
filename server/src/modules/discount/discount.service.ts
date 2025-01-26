import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dtos/create-discount.dto';
import { EntityManager, In, Repository } from 'typeorm';
import { Discount } from './entities/discount.entity';
import { Product } from '../product/entities/product.entity';
import { DiscountEntityType } from './types/discount-entity-type';
import { DiscountType } from './types/discount-type';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { ProductTheme } from '../product-theme/entities/product-theme.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(dto: CreateDiscountDto) {
    const discount = this.discountRepository.create(dto);

    return this.discountRepository.save(discount);
  }

  async getList() {
    const discounts = await this.discountRepository.find({
      select: ['name', 'slug', 'entityType', 'entityId'],
    });

    const populatedDiscounts = await Promise.all(
      discounts.map(async (discount) => {
        let entity;

        if (discount.entityType === DiscountEntityType.CATEGORY) {
          entity = await this.entityManager.findOne(Category, {
            where: { id: discount.entityId },
            select: ['name', 'slug'],
          });
        } else if (discount.entityType === DiscountEntityType.PRODUCT_THEME) {
          entity = await this.entityManager.findOne(ProductTheme, {
            where: { id: discount.entityId },
            select: ['name', 'slug'],
          });
        }

        return {
          ...discount,
          entity,
        };
      }),
    );

    return populatedDiscounts;
  }

  isDiscountApplicable(discount: Discount, products: Product[]) {
    const eligibleProducts: Product[] = [];

    for (const product of products) {
      let isEligible = false;

      switch (discount.entityType) {
        case DiscountEntityType.CATEGORY: {
          isEligible = product.category.id === discount.entityId;
          break;
        }
        case DiscountEntityType.PRODUCT_THEME: {
          isEligible = product.productTheme.id === discount.entityId;
          break;
        }
      }

      if (isEligible) {
        eligibleProducts.push(product);
      }
    }

    const isApplicable = eligibleProducts.length >= discount.minQty;

    return {
      isApplicable,
      eligibleProducts: eligibleProducts.slice(0, discount.minQty),
    };
  }

  private getDiscountEligibleProductsMap(
    sortedProducts: Product[],
    discounts: Discount[],
  ) {
    const discountEligibleProductsMap = new Map<Discount, Product[]>();

    const productsToCheckForDiscount = [...sortedProducts];

    for (const discount of discounts) {
      const { isApplicable, eligibleProducts } = this.isDiscountApplicable(
        discount,
        productsToCheckForDiscount,
      );

      if (isApplicable) {
        discountEligibleProductsMap.set(discount, eligibleProducts);

        eligibleProducts.forEach((p) => {
          const index = productsToCheckForDiscount.findIndex(
            (product) => product.id === p.id,
          );
          if (index !== -1) {
            productsToCheckForDiscount.splice(index, 1);
          }
        });
      }
    }

    return discountEligibleProductsMap;
  }

  async getApplicableDiscounts(
    productsWithQty: { product: Product; qty: number }[],
    entityManager?: EntityManager,
  ) {
    try {
      const categoryIds = productsWithQty.map(
        (product) => product.product.category.id,
      );
      const productThemeIds = productsWithQty.map(
        (product) => product.product.productTheme.id,
      );

      let discounts: Discount[] = [];

      const entityIds = [...categoryIds, ...productThemeIds];

      if (entityManager) {
        discounts = await entityManager.find(Discount, {
          where: {
            entityId: In(entityIds),
            isActive: true,
          },
        });
      } else {
        discounts = await this.discountRepository.find({
          where: {
            entityId: In(entityIds),
            isActive: true,
          },
        });
      }

      const productsToCheckForDiscount = productsWithQty
        .reduce((acc: Product[], { product, qty }) => {
          for (let i = 0; i < qty; i++) {
            acc.push(product);
          }
          return acc;
        }, [])
        .sort((a, b) => a.amount.price - b.amount.price);

      const discountEligibleProductsMap = this.getDiscountEligibleProductsMap(
        productsToCheckForDiscount,
        discounts,
      );

      const applicableDiscounts: Discount[] = [];

      for (const [
        discount,
        products,
      ] of discountEligibleProductsMap.entries()) {
        if (products.length > 0) {
          applicableDiscounts.push(discount);
        }
      }

      return applicableDiscounts;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async applyDiscounts(
    discounts: Discount[],
    productsWithQty: { product: Product; qty: number }[],
  ) {
    const productsToCheckForDiscount = productsWithQty
      .reduce((acc: Product[], { product, qty }) => {
        for (let i = 0; i < qty; i++) {
          acc.push(product);
        }
        return acc;
      }, [])
      .sort((a, b) => a.amount.price - b.amount.price);

    const discountEligibleProductsMap = this.getDiscountEligibleProductsMap(
      productsToCheckForDiscount,
      discounts,
    );

    const productsNotEligibleForDiscount = [...productsToCheckForDiscount];

    for (const [, products] of discountEligibleProductsMap.entries()) {
      products.forEach((p) => {
        const index = productsNotEligibleForDiscount.findIndex(
          (product) => product.id === p.id,
        );
        if (index !== -1) {
          productsNotEligibleForDiscount.splice(index, 1);
        }
      });
    }

    let totalValue = productsNotEligibleForDiscount.reduce(
      (acc, item) => acc + item.amount.price,
      0,
    );

    for (const [discount, eligibleProducts] of discountEligibleProductsMap) {
      switch (discount.type) {
        case DiscountType.PERCENTAGE: {
          const eligibleProductsValue = eligibleProducts.reduce((acc, item) => {
            const discountedPrice =
              item.amount.price * (1 - discount.percentage / 100);
            return acc + discountedPrice;
          }, 0);

          totalValue += eligibleProductsValue;
          break;
        }
        case DiscountType.FLAT_PRICE: {
          const eligibleProductsTotalValue = eligibleProducts.reduce(
            (acc, item) => acc + item.amount.price,
            0,
          );
          totalValue += Math.min(
            eligibleProductsTotalValue,
            discount.flatPrice,
          );
          break;
        }
        case DiscountType.BOGO: {
          const productsToBePaid = eligibleProducts.slice(
            discount.freeQty,
            eligibleProducts.length,
          );

          totalValue += productsToBePaid.reduce(
            (acc, item) => acc + item.amount.price,
            0,
          );
          break;
        }
      }
    }

    return Math.max(totalValue, 0);
  }
}
