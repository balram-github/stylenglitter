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

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  /**
   * Get cart with all the products
   */
  @UseGuards(AuthGuard)
  @Get('/items')
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
      .filter((item) => item.qty <= 0)
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

      return updatedCart.cartItems;
    }

    return cart.cartItems;
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
}
