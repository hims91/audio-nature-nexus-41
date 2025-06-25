
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CartItem, Product, ProductVariant } from '@/types/ecommerce';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Generate session ID for guest users
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [sessionId] = useState(() => getSessionId());

  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id || sessionId],
    queryFn: async (): Promise<CartItem[]> => {
      let query = supabase
        .from('shopping_cart')
        .select(`
          *,
          product:products(*,
            images:product_images(*),
            category:product_categories(*)
          ),
          variant:product_variants(*)
        `);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!(user || sessionId),
  });

  // Add item to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      variantId, 
      quantity = 1 
    }: { 
      productId: string; 
      variantId?: string; 
      quantity?: number; 
    }) => {
      console.log('Adding to cart:', { productId, variantId, quantity, userId: user?.id, sessionId });

      const cartData = {
        product_id: productId,
        variant_id: variantId,
        quantity,
        ...(user ? { user_id: user.id } : { session_id: sessionId })
      };

      // Check if item already exists in cart
      let existingQuery = supabase
        .from('shopping_cart')
        .select('*')
        .eq('product_id', productId);

      if (variantId) {
        existingQuery = existingQuery.eq('variant_id', variantId);
      } else {
        existingQuery = existingQuery.is('variant_id', null);
      }

      if (user) {
        existingQuery = existingQuery.eq('user_id', user.id);
      } else {
        existingQuery = existingQuery.eq('session_id', sessionId);
      }

      const { data: existing } = await existingQuery.single();

      if (existing) {
        // Update existing item
        const { error } = await supabase
          .from('shopping_cart')
          .update({ 
            quantity: existing.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
        
        if (error) {
          console.error('Error updating cart item:', error);
          throw error;
        }
      } else {
        // Insert new item
        const { error } = await supabase
          .from('shopping_cart')
          .insert({
            ...cartData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error('Error inserting cart item:', error);
          throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item added to cart');
    },
    onError: (error) => {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    },
  });

  // Update cart item quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('shopping_cart')
          .delete()
          .eq('id', itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('shopping_cart')
          .update({ 
            quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    },
  });

  // Remove item from cart
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: (error) => {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
    },
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      console.log('Clearing cart for:', { userId: user?.id, sessionId });
      
      // Clear both user and session carts to be thorough
      const promises = [];
      
      if (user) {
        promises.push(
          supabase.from('shopping_cart').delete().eq('user_id', user.id)
        );
      }
      
      if (sessionId) {
        promises.push(
          supabase.from('shopping_cart').delete().eq('session_id', sessionId)
        );
      }
      
      const results = await Promise.allSettled(promises);
      
      // Log any errors but don't throw
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Error clearing cart ${index}:`, result.reason);
        }
      });
      
      // Clear session ID from localStorage
      localStorage.removeItem('cart_session_id');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log('Cart cleared successfully');
    },
    onError: (error) => {
      console.error('Error clearing cart:', error);
      // Don't show toast error for cart clearing as it's usually called during checkout
    },
  });

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.variant?.price_cents || item.product?.price_cents || 0;
    return total + (price * item.quantity);
  }, 0);

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    isLoading,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};
