"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (
    item: CartItem
  ) => void;

  removeFromCart: (
    id: string
  ) => void;

  increaseQty: (
    id: string
  ) => void;

  decreaseQty: (
    id: string
  ) => void;

  clearCart: () => void;

  totalItems: number;

  totalPrice: number;
};

const CartContext =
  createContext<CartContextType>(
    {} as CartContextType
  );

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<
    CartItem[]
  >([]);

  /* LOAD */
  useEffect(() => {
    const stored =
      localStorage.getItem("cart");

    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  /* SAVE */
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /* ADD */
  function addToCart(
    item: CartItem
  ) {
    setCart((prev) => {
      const existing =
        prev.find(
          (i) => i.id === item.id
        );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity:
                  i.quantity + 1,
              }
            : i
        );
      }

      return [...prev, item];
    });
  }

  /* REMOVE */
  function removeFromCart(
    id: string
  ) {
    setCart((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  }

  /* INCREASE */
  function increaseQty(
    id: string
  ) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  /* DECREASE */
  function decreaseQty(
    id: string
  ) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems =
    Object.values(cart).reduce(
      (acc, item) =>
        acc + item.quantity,
      0
    );

  const totalPrice =
    Object.values(cart).reduce(
      (acc, item) =>
        acc +
        item.price *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(
    CartContext
  );
}