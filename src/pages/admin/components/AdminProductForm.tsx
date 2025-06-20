
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/useProducts';
import { useProductMutations, useAdminProduct } from '@/hooks/useAdminProducts';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import FadeInView from '@/components/animations/FadeInView';
import ProductImageUpload from '@/components/admin/ProductImageUpload';
import { supabase } from '@/integrations/supabase/client';

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price_cents: number;
  compare_at_price_cents?: number;
  sku?: string;
  category_id?: string;
  inventory_quantity: number;
  track_inventory: boolean;
  allow_backorders: boolean;
  weight_grams?: number;
  requires_shipping: boolean;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
}

interface ProductImage {
  id?: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

const AdminProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  
  const { data: categories = [] } = useCategories();
  const { data: product, isLoading: isLoadingProduct } = useAdminProduct(id || '');
  const { createProduct, updateProduct } = useProductMutations();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ProductFormData>({
    defaultValues: {
      track_inventory: true,
      allow_backorders: false,
      requires_shipping: true,
      is_active: true,
      is_featured: false,
      inventory_quantity: 0,
      price_cents: 0
    }
  });

  const watchTrackInventory = watch('track_inventory');

  useEffect(() => {
    if (product && isEditing) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price_cents: product.price_cents / 100, // Convert to dollars for display
        compare_at_price_cents: product.compare_at_price_cents ? product.compare_at_price_cents / 100 : undefined,
        sku: product.sku || '',
        category_id: product.category_id || 'none',
        inventory_quantity: product.inventory_quantity,
        track_inventory: product.track_inventory,
        allow_backorders: product.allow_backorders,
        weight_grams: product.weight_grams || undefined,
        requires_shipping: product.requires_shipping,
        is_active: product.is_active,
        is_featured: product.is_featured,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || ''
      });

      // Set product images
      if (product.images) {
        setProductImages(product.images);
      }
    }
  }, [product, isEditing, reset]);

  const saveProductImages = async (productId: string, images: ProductImage[]) => {
    // Delete existing images if updating
    if (isEditing && id) {
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);
    }

    // Insert new images
    if (images.length > 0) {
      const imageRecords = images.map((img, index) => ({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        sort_order: index
      }));

      const { error } = await supabase
        .from('product_images')
        .insert(imageRecords);

      if (error) {
        console.error('Error saving product images:', error);
        throw error;
      }
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formattedData = {
        ...data,
        category_id: data.category_id === 'none' ? null : data.category_id,
        price_cents: Math.round(data.price_cents * 100),
        compare_at_price_cents: data.compare_at_price_cents ? Math.round(data.compare_at_price_cents * 100) : null,
      };

      let productId: string;

      if (isEditing && id) {
        const result = await updateProduct.mutateAsync({ id, updates: formattedData });
        productId = id;
      } else {
        const result = await createProduct.mutateAsync(formattedData);
        productId = result.id;
      }

      // Save product images
      await saveProductImages(productId, productImages);

      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} product`);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (isEditing && isLoadingProduct) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-forest"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-nature-bark dark:text-gray-300 mt-2">
                {isEditing ? 'Update product information' : 'Create a new product for your catalog'}
              </p>
            </div>
          </div>
        </div>
      </FadeInView>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Images */}
        <FadeInView direction="up" delay={0.1}>
          <ProductImageUpload
            images={productImages}
            onImagesChange={setProductImages}
          />
        </FadeInView>

        {/* Basic Information */}
        <FadeInView direction="up" delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    {...register('name', { required: 'Product name is required' })}
                    placeholder="Enter product name"
                    onChange={(e) => {
                      register('name').onChange(e);
                      if (!isEditing) {
                        setValue('slug', generateSlug(e.target.value));
                      }
                    }}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    {...register('slug', { required: 'URL slug is required' })}
                    placeholder="product-url-slug"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  {...register('short_description')}
                  placeholder="Brief product summary"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Detailed product description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* Pricing & Category */}
        <FadeInView direction="up" delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price_cents">Price ($)</Label>
                  <Input
                    id="price_cents"
                    type="number"
                    step="0.01"
                    {...register('price_cents', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    placeholder="0.00"
                  />
                  {errors.price_cents && (
                    <p className="text-sm text-red-600 mt-1">{errors.price_cents.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="compare_at_price_cents">Compare at Price ($)</Label>
                  <Input
                    id="compare_at_price_cents"
                    type="number"
                    step="0.01"
                    {...register('compare_at_price_cents')}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <Select onValueChange={(value) => setValue('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="Product SKU"
                  />
                </div>

                <div>
                  <Label htmlFor="weight_grams">Weight (grams)</Label>
                  <Input
                    id="weight_grams"
                    type="number"
                    {...register('weight_grams')}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* Inventory & Shipping */}
        <FadeInView direction="up" delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Inventory & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="track_inventory"
                  {...register('track_inventory')}
                />
                <Label htmlFor="track_inventory">Track inventory</Label>
              </div>

              {watchTrackInventory && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="inventory_quantity">Inventory Quantity</Label>
                    <Input
                      id="inventory_quantity"
                      type="number"
                      {...register('inventory_quantity', { min: 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allow_backorders"
                      {...register('allow_backorders')}
                    />
                    <Label htmlFor="allow_backorders">Allow backorders</Label>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_shipping"
                  {...register('requires_shipping')}
                />
                <Label htmlFor="requires_shipping">Requires shipping</Label>
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* SEO & Status */}
        <FadeInView direction="up" delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>SEO & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    {...register('meta_title')}
                    placeholder="SEO title"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    {...register('meta_description')}
                    placeholder="SEO description"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    {...register('is_active')}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    {...register('is_featured')}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInView>

        {/* Submit */}
        <FadeInView direction="up" delay={0.6}>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-nature-forest hover:bg-nature-leaf"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </FadeInView>
      </form>
    </div>
  );
};

export default AdminProductForm;
