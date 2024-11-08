import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import {
  DataSource,
  EntityManager,
  FindOneOptions,
  In,
  Repository,
} from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductService } from '@modules/product/product.service';
import { LockedCartItem } from './types/locked-cart-item';
import {
  COD_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_DELIVERY_CHARGE,
} from '../order/constants';
import { TypeOfPayment } from '../order/types/payment-method';
import { PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY } from '../order/constants';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    @InjectDataSource() private readonly dataSource: DataSource,
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

  async getCartPurchaseCharges(
    lockedCartItems: LockedCartItem[],
    paymentMethod: TypeOfPayment,
  ) {
    const totalValue = lockedCartItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0,
    );

    const charges = {
      subTotal: totalValue,
      deliveryCharge: 0,
      payNow: 0,
      payLater: 0,
    };

    switch (paymentMethod) {
      case TypeOfPayment.PREPAID: {
        if (totalValue >= PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY) {
          charges.deliveryCharge = 0;
        } else {
          charges.deliveryCharge = PREPAID_ORDER_DELIVERY_CHARGE;
        }

        charges.payNow = totalValue + charges.deliveryCharge;

        return charges;
      }
      case TypeOfPayment.COD: {
        charges.deliveryCharge = COD_ORDER_DELIVERY_CHARGE;
        charges.payNow = charges.deliveryCharge;
        charges.payLater = totalValue;

        return charges;
      }
    }
  }

  async getAllCartPurchaseCharges(
    cartId: number,
    paymentMethod: TypeOfPayment,
  ) {
    return this.dataSource.manager.transaction(async (entityManager) => {
      const cart = await this.getCart({ where: { id: cartId } }, entityManager);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const lockedCartItems = await this.getLockedCartItems(
        cartId,
        entityManager,
      );

      const purchaseCharges = await this.getCartPurchaseCharges(
        lockedCartItems,
        paymentMethod,
      );

      return purchaseCharges;
    });
  }
}
