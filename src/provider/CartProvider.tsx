"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Произошла ошибка, попробуйте снова", e);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Произошла ошибка, попробуйте снова", e);
    }
  }, [cartItems, isMounted]);

  const updateQuantity = (
    product: Omit<CartItem, "quantity">,
    newQuantity: number,
  ) => {
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
  };

  const getItemQuantity = (id: string): number => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = isMounted
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const totalPrice = isMounted
    ? cartItems.reduce((sum, item) => {
        const numPrice =
          typeof item.price === "number"
            ? item.price
            : parseFloat(item.price) || 0;
        return sum + numPrice * item.quantity;
      }, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        totalPrice,
        updateQuantity,
        getItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Произошла ошибка, попробуйте снова");
  }
  return context;
};
