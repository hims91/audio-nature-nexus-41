
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PortfolioService } from '@/services/portfolioService';
import { PortfolioItem, CreatePortfolioItem, UpdatePortfolioItem } from '@/types/portfolio';
import { useToast } from '@/hooks/use-toast';

export const useSupabasePortfolio = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all portfolio items
  const {
    data: portfolioItems = [],
    isLoading: isLoadingPortfolio,
    error: portfolioError
  } = useQuery({
    queryKey: ['portfolio-items'],
    queryFn: PortfolioService.getPortfolioItems,
  });

  // Fetch user's portfolio items
  const {
    data: userPortfolioItems = [],
    isLoading: isLoadingUserPortfolio,
    error: userPortfolioError
  } = useQuery({
    queryKey: ['user-portfolio-items'],
    queryFn: PortfolioService.getUserPortfolioItems,
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ['portfolio-categories'],
    queryFn: PortfolioService.getPortfolioCategories,
  });

  // Create portfolio item mutation
  const createItemMutation = useMutation({
    mutationFn: (item: CreatePortfolioItem) => PortfolioService.createPortfolioItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['user-portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast({
        title: "Success",
        description: "Portfolio item created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create portfolio item",
        variant: "destructive"
      });
    }
  });

  // Update portfolio item mutation
  const updateItemMutation = useMutation({
    mutationFn: (item: UpdatePortfolioItem) => PortfolioService.updatePortfolioItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['user-portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast({
        title: "Success",
        description: "Portfolio item updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update portfolio item",
        variant: "destructive"
      });
    }
  });

  // Delete portfolio item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => PortfolioService.deletePortfolioItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['user-portfolio-items'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-categories'] });
      toast({
        title: "Success",
        description: "Portfolio item deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive"
      });
    }
  });

  return {
    // Data
    portfolioItems,
    userPortfolioItems,
    categories,
    
    // Loading states
    isLoadingPortfolio,
    isLoadingUserPortfolio,
    isLoadingCategories,
    
    // Errors
    portfolioError,
    userPortfolioError,
    
    // Mutations
    createItem: createItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    
    // Mutation states
    isCreating: createItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isDeleting: deleteItemMutation.isPending,
  };
};
