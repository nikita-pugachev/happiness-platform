"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number | string;
  imageSrc: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  totalCount: number;
  totalPrice: number;
  updateQuantity: (
    item: Omit<CartItem, "quantity">,
    newQuantity: number,
  ) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "happiness_cart_items";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error("Ошибка при чтении корзины из localStorage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Ошибка при сохранении корзины в localStorage", e);
    }
  }, [cartItems]);

  const updateQuantity = useCallback(
    (product: Omit<CartItem, "quantity">, newQuantity: number) => {
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => item.id === product.id,
        );

        if (newQuantity <= 0) {
          return prevItems.filter((item) => item.id !== product.id);
        }

        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQuantity,
          };
          return updated;
        } else {
          return [
            ...prevItems,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              imageSrc: product.imageSrc,
              quantity: newQuantity,
            },
          ];
        }
      });
    },
    [],
  );

  const getItemQuantity = useCallback(
    (id: string): number => {
      const item = cartItems.find((i) => i.id === id);
      return item ? item.quantity : 0;
    },
    [cartItems],
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const numPrice =
        typeof item.price === "number"
          ? item.price
          : parseFloat(item.price) || 0;
      return sum + numPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      totalCount,
      totalPrice,
      updateQuantity,
      getItemQuantity,
      clearCart,
    }),
    [
      cartItems,
      totalCount,
      totalPrice,
      updateQuantity,
      getItemQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Произошла ошибка, попробуйте снова");
  }
  return context;
};
