
import React, { createContext, useContext, ReactNode } from 'react';
import { useCart } from '@/hooks/useCart';

interface CartContextType {
  cartItems: any[];
  cartTotal: number;
  cartItemCount: number;
  addToCart: (data: any) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isAddingToCart: boolean;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cartHook = useCart();

  // Wrap the functions to match the expected signatures
  const wrappedUpdateQuantity = (itemId: string, quantity: number) => {
    cartHook.updateQuantity({ itemId, quantity });
  };

  const wrappedRemoveFromCart = (itemId: string) => {
    cartHook.removeFromCart(itemId);
  };

  const wrappedClearCart = () => {
    cartHook.clearCart();
  };

  const contextValue: CartContextType = {
    cartItems: cartHook.cartItems,
    cartTotal: cartHook.cartTotal,
    cartItemCount: cartHook.cartItemCount,
    addToCart: cartHook.addToCart,
    updateQuantity: wrappedUpdateQuantity,
    removeFromCart: wrappedRemoveFromCart,
    clearCart: wrappedClearCart,
    isAddingToCart: cartHook.isAddingToCart,
    isLoading: cartHook.isLoading,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
