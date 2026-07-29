import { useCartContext } from "@/provider/CartProvider";

export const useCart = () => {
  return useCartContext();
};
