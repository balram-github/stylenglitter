import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@guards/auth.guard';
import { Auth } from '@decorators/auth';
import { UpsertCartItemsDto } from './dtos/upsert-cart-items.dto';
import { RemoveCartItemsDto } from './dtos/remove-cart-items.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetCartPurchaseChargesDto } from './dtos/get-cart-purchase-charges.dto';
import { ProductService } from '../product/product.service';
import { In } from 'typeorm';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  /**
   * Get cart with all the products
   */
  @UseGuards(AuthGuard)
  @Get('/')
  async getCartItems(@Auth() auth) {
    const cartId = auth.cartId;

    const cart = await this.cartService.getCart({
      where: { id: cartId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Remove items with quantity 0 or less
    const itemsToRemove = cart.cartItems
      .filter((item) => item.product.qty <= 0)
      .map((item) => item.product.id);

    if (itemsToRemove.length > 0) {
      await this.cartService.removeCartItems(cartId, itemsToRemove);

      // Fetch updated cart after removing items
      const updatedCart = await this.cartService.getCart({
        where: { id: cartId },
        relations: ['cartItems', 'cartItems.product'],
      });

      if (!updatedCart) {
        throw new NotFoundException('Cart not found');
      }

      return updatedCart;
    }

    return cart;
  }

  /**
   * Add a product in cart
   */
  @UseGuards(AuthGuard)
  @Put('/items')
  async upsertCartItems(@Body() payload: UpsertCartItemsDto, @Auth() auth) {
    const cartId = auth.cartId;

    await this.cartService.upsertCartItem(
      cartId,
      payload.productId,
      payload.qty,
    );
  }

  /**
   * Remove products from cart
   */
  @UseGuards(AuthGuard)
  @Delete('/items')
  async removeCartItems(@Body() payload: RemoveCartItemsDto, @Auth() auth) {
    const cartId = auth.cartId;

    await this.cartService.removeCartItems(cartId, payload.productIds);
  }

  /**
   * Get cart purchase charges
   */
  @Get('/purchase-charges')
  async getCartPurchaseAmount(@Body() payload: GetCartPurchaseChargesDto) {
    const { paymentMethod, products } = payload;

    const populatedProducts = await this.productService.get({
      where: {
        id: In(products.map((product) => product.productId)),
      },
    });

    const response = await this.cartService.getCartPurchaseCharges({
      products: populatedProducts.map((product) => ({
        product,
        qty: products.find((p) => p.productId === product.id)?.qty || 0,
      })),
      paymentMethod,
    });

    return response;
  }
}
