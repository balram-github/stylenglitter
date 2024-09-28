import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { FindOneOptions, In, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { ProductService } from '@modules/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductService,
  ) {}

  async getCart(findOptions: FindOneOptions<Cart>) {
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

  async removeCartItems(cartId: number, productIds: number[]) {
    await this.cartItemRepository.delete({
      cart: { id: cartId },
      product: { id: In(productIds) },
    });
  }
}
