import { request } from "@/lib/request";
import {
  Cart,
  CartItem,
  GetCartPurchaseChargesResponse,
  GetCartResponse,
} from "./cart.types";
import { GUEST_CART_ITEMS_KEY_NAME } from "@/modules/cart/constants";
import { getProductById } from "../products/products.service";
import { isClient } from "@/lib/utils";
import { TypeOfPayment } from "../order/order.types";

export const getUserCart = async () => {
  const {
    data: { data },
  } = await request.get<GetCartResponse>(`/cart`);

  return data;
};

export const getGuestCartItems = () => {
  if (!isClient()) {
    return [];
  }

  const cartItems = JSON.parse(
    localStorage.getItem(GUEST_CART_ITEMS_KEY_NAME) || "[]"
  ) as CartItem[];

  return cartItems;
};

export const getGuestCart = async (): Promise<Cart> => {
  const cartItems = getGuestCartItems();

  const promisesToRun = cartItems.map(async (item) => {
    try {
      const product = await getProductById(item.productId);

      if (product.qty <= 0) {
        return item;
      }

      return {
        ...item,
        product,
      };
    } catch (error) {
      console.error(error);
      return item;
    }
  });

  const cartItemsWithProducts = (await Promise.all(promisesToRun)).filter(
    (item) => !!item?.product
  );

  localStorage.setItem(
    GUEST_CART_ITEMS_KEY_NAME,
    JSON.stringify(
      cartItemsWithProducts.map((item) => ({
        id: -1,
        productId: item.productId,
        qty: item.qty,
      }))
    )
  );

  return {
    id: -1,
    userId: -1,
    cartItems: cartItemsWithProducts,
    isGuestCart: true,
  };
};

export const upsertCartItemToDB = async (
  productId: number,
  qty: number,
  isGuestCart: boolean
) => {
  if (isGuestCart) {
    let cartItems = getGuestCartItems();
    if (qty <= 0) {
      cartItems = cartItems.filter((item) => item.productId !== productId);
    } else {
      const isExistingItem = cartItems.find(
        (item) => item.productId === productId
      );

      if (isExistingItem) {
        cartItems = cartItems.map((item) =>
          item.productId === productId ? { ...item, qty } : item
        );
      } else {
        cartItems.push({
          id: -1,
          productId,
          qty,
        });
      }
    }

    localStorage.setItem(GUEST_CART_ITEMS_KEY_NAME, JSON.stringify(cartItems));
  } else {
    await request.put(`/cart/items`, { productId, qty });
  }
};

export const removeCartItemsFromDB = async (
  productIds: number[],
  isGuestCart: boolean
) => {
  if (isGuestCart) {
    let cartItems = getGuestCartItems();

    if (productIds.length === 0) {
      cartItems = [];
    } else {
      cartItems = cartItems.filter(
        (item) => !productIds.includes(item.productId)
      );
    }

    localStorage.setItem(GUEST_CART_ITEMS_KEY_NAME, JSON.stringify(cartItems));
  } else {
    await request.delete(`/cart/items`, { data: { productIds } });
  }
};

export const saveGuestCartItemsToDB = async () => {
  const cartItems = getGuestCartItems();

  if (cartItems.length === 0) {
    return;
  }

  const promisesToRun = cartItems.map(async (item) => {
    return upsertCartItemToDB(item.productId, item.qty, false);
  });

  await Promise.allSettled(promisesToRun);

  removeCartItemsFromDB([], true);
};

export const getCartPurchaseCharges = async (paymentMethod: TypeOfPayment) => {
  const {
    data: { data },
  } = await request.get<GetCartPurchaseChargesResponse>(
    `/cart/purchase-charges`,
    {
      params: { paymentMethod },
    }
  );

  return data;
};
