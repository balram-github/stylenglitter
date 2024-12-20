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
import {
  COD_ORDER_DELIVERY_CHARGE,
  PREPAID_ORDER_DELIVERY_CHARGE,
} from '../order/constants';
import { TypeOfPayment } from '../order/types/payment-method';
import { PREPAID_ORDER_THRESHOLD_FOR_FREE_DELIVERY } from '../order/constants';
import { GetCartPurchaseChargesPayload } from './types/get-cart-purchase-charges-payload';
import { DiscountService } from '../discount/discount.service';
import { GetCartPurchaseChargesResponseDto } from './dtos/get-cart-purchase-charges-response.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
    private discountService: DiscountService,
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

    if (requestedQty <= 0) {
      return this.removeCartItems(cartId, [productId]);
    }

    if (product.qty < requestedQty) {
      throw new BadRequestException('Not enough quantity available');
    }

    if (cartItem) {
      cartItem.qty = requestedQty;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        qty: requestedQty,
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

  async getCartPurchaseCharges({
    products,
    paymentMethod,
    autoApplyApplicableDiscounts = true,
  }: GetCartPurchaseChargesPayload) {
    let totalValue = products.reduce(
      (acc, item) => acc + item.product.amount.price * item.qty,
      0,
    );

    const charges: GetCartPurchaseChargesResponseDto = {
      subTotal: totalValue,
      deliveryCharge: 0,
      payNow: 0,
      payLater: 0,
      appliedDiscounts: [],
    };

    if (autoApplyApplicableDiscounts) {
      const applicableDiscounts =
        await this.discountService.getApplicableDiscounts(products);

      const discountedTotal = await this.discountService.applyDiscounts(
        applicableDiscounts,
        products,
      );

      charges.appliedDiscounts = applicableDiscounts;
      totalValue = discountedTotal;
    }

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
}
