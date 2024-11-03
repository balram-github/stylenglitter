import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { EntityManager, FindOneOptions, In, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductService } from '@modules/product/product.service';
import { LockedCartItem } from './types/locked-cart-item';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
  ) {}

  async getCart(
    findOptions: FindOneOptions<Cart>,
    entityManager?: EntityManager,
  ) {
    if (entityManager) return entityManager.findOne(Cart, findOptions);

    return this.cartRepository.findOne(findOptions);
  }

  async upsertCartItem(
    cartId: number,
    productId: number,
    requestedQty: number,
  ) {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = await this.productService.getOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not available');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: { product: { id: productId }, cart: { id: cartId } },
    });

    const newRequestedQty = cartItem
      ? cartItem.qty + requestedQty
      : requestedQty;

    if (newRequestedQty <= 0) {
      return this.removeCartItems(cartId, [productId]);
    }

    if (product.qty < newRequestedQty) {
      throw new BadRequestException('Not enough quantity available');
    }

    if (cartItem) {
      cartItem.qty = newRequestedQty;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        qty: newRequestedQty,
      });
    }

    await this.cartItemRepository.save(cartItem);
  }

  async getLockedCartItems(
    cartId: number,
    entityManager: EntityManager,
  ): Promise<LockedCartItem[]> {
    const cartItems = await entityManager.find(CartItem, {
      where: { cart: { id: cartId } },
      lock: { mode: 'pessimistic_write' },
    });

    const promisesToRun = cartItems.map(async (cartItem) => {
      const product = await this.productService.getOne(
        {
          where: { id: cartItem.productId },
          lock: { mode: 'pessimistic_write' },
        },
        entityManager,
      );

      if (!product) {
        throw new BadRequestException(
          'One of the products in your cart do not exist',
        );
      }

      if (cartItem.qty > product.qty) {
        throw new BadRequestException(
          `Product "${product.name}" does not have enough required quantity available`,
        );
      }

      return {
        ...cartItem,
        product,
        totalPrice: cartItem.qty * product.amount.price,
      };
    });

    return Promise.all(promisesToRun);
  }

  async removeCartItems(
    cartId: number,
    productIds: number[],
    entityManager?: EntityManager,
  ) {
    const criteria: Record<string, unknown> = {
      cart: { id: cartId },
    };

    if (productIds.length > 0) {
      criteria.product = { id: In(productIds) };
    }

    if (entityManager) {
      return entityManager.delete(CartItem, criteria);
    }

    await this.cartItemRepository.delete(criteria);
  }
}
