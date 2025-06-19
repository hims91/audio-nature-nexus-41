import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Copy, Tag } from 'lucide-react';
import { useAdminDiscountCodes, useDiscountCodeMutations } from '@/hooks/useDiscountCodes';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DiscountCode } from '@/types/ecommerce';
import { toast } from 'sonner';

const AdminDiscountCodes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);

  const { data: discountCodes = [], isLoading } = useAdminDiscountCodes({
    search: search || undefined,
  });

  const { createDiscountCode, updateDiscountCode, deleteDiscountCode } = useDiscountCodeMutations();

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: 0,
    minimum_order_cents: 0,
    maximum_discount_cents: undefined as number | undefined,
    usage_limit: undefined as number | undefined,
    is_active: true,
    starts_at: '',
    expires_at: '',
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      minimum_order_cents: 0,
      maximum_discount_cents: undefined,
      usage_limit: undefined,
      is_active: true,
      starts_at: '',
      expires_at: '',
    });
    setEditingCode(null);
  };

  const handleCreateCode = async () => {
    try {
      await createDiscountCode.mutateAsync({
        ...formData,
        starts_at: formData.starts_at || undefined,
        expires_at: formData.expires_at || undefined,
      });
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating discount code:', error);
    }
  };

  const handleUpdateCode = async () => {
    if (!editingCode) return;

    try {
      await updateDiscountCode.mutateAsync({
        id: editingCode.id,
        updates: {
          ...formData,
          starts_at: formData.starts_at || undefined,
          expires_at: formData.expires_at || undefined,
        },
      });
      setEditingCode(null);
      resetForm();
    } catch (error) {
      console.error('Error updating discount code:', error);
    }
  };

  const handleEditCode = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || '',
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      minimum_order_cents: code.minimum_order_cents,
      maximum_discount_cents: code.maximum_discount_cents || undefined,
      usage_limit: code.usage_limit || undefined,
      is_active: code.is_active,
      starts_at: code.starts_at ? new Date(code.starts_at).toISOString().slice(0, 16) : '',
      expires_at: code.expires_at ? new Date(code.expires_at).toISOString().slice(0, 16) : '',
    });
  };

  const handleDeleteCode = async (id: string) => {
    if (confirm('Are you sure you want to delete this discount code?')) {
      try {
        await deleteDiscountCode.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting discount code:', error);
      }
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Discount code copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Discount Codes
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-2">
              Create and manage promotional discount codes
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Discount Code</DialogTitle>
                <DialogDescription>
                  Set up a new promotional discount code for customers
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: 'percentage' | 'fixed_amount') =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    {formData.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                    min="0"
                    max={formData.discount_type === 'percentage' ? 100 : undefined}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_order">Minimum Order ($)</Label>
                  <Input
                    id="minimum_order"
                    type="number"
                    value={formData.minimum_order_cents / 100}
                    onChange={(e) => setFormData({ ...formData, minimum_order_cents: Number(e.target.value) * 100 })}
                    min="0"
                    step="0.01"
                  />
                </div>

                {formData.discount_type === 'percentage' && (
                  <div className="space-y-2">
                    <Label htmlFor="max_discount">Maximum Discount ($)</Label>
                    <Input
                      id="max_discount"
                      type="number"
                      value={formData.maximum_discount_cents ? formData.maximum_discount_cents / 100 : ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        maximum_discount_cents: e.target.value ? Number(e.target.value) * 100 : undefined 
                      })}
                      min="0"
                      step="0.01"
                      placeholder="No limit"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      usage_limit: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    min="1"
                    placeholder="Unlimited"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="starts_at">Start Date</Label>
                  <Input
                    id="starts_at"
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires_at">Expiry Date</Label>
                  <Input
                    id="expires_at"
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Summer sale discount"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCode}>Create Code</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </FadeInView>

      {/* Search */}
      <FadeInView direction="up" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Search Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search discount codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Discount Codes Table */}
      <FadeInView direction="up" delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle>Discount Codes</CardTitle>
            <CardDescription>
              {discountCodes.length} discount codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : discountCodes.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discount codes found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your first discount code to start offering promotions
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountCodes.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{code.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(code.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {code.description && (
                          <p className="text-sm text-gray-600">{code.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {code.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {code.discount_type === 'percentage'
                          ? `${code.discount_value}%`
                          : formatPrice(code.discount_value)
                        }
                        {code.maximum_discount_cents && (
                          <div className="text-sm text-gray-500">
                            Max: {formatPrice(code.maximum_discount_cents)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{code.usage_count} used</div>
                          {code.usage_limit && (
                            <div className="text-sm text-gray-500">
                              Limit: {code.usage_limit}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            code.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }
                        >
                          {code.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {code.expires_at ? formatDate(code.expires_at) : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCode(code)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCode(code.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </FadeInView>

      {/* Edit Dialog */}
      <Dialog open={!!editingCode} onOpenChange={(open) => !open && setEditingCode(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Discount Code</DialogTitle>
            <DialogDescription>
              Update the discount code settings
            </DialogDescription>
          </DialogHeader>
          
          {/* Same form fields as create dialog */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER2024"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value: 'percentage' | 'fixed_amount') =>
                  setFormData({ ...formData, discount_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                {formData.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                min="0"
                max={formData.discount_type === 'percentage' ? 100 : undefined}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimum_order">Minimum Order ($)</Label>
              <Input
                id="minimum_order"
                type="number"
                value={formData.minimum_order_cents / 100}
                onChange={(e) => setFormData({ ...formData, minimum_order_cents: Number(e.target.value) * 100 })}
                min="0"
                step="0.01"
              />
            </div>

            {formData.discount_type === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="max_discount">Maximum Discount ($)</Label>
                <Input
                  id="max_discount"
                  type="number"
                  value={formData.maximum_discount_cents ? formData.maximum_discount_cents / 100 : ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    maximum_discount_cents: e.target.value ? Number(e.target.value) * 100 : undefined 
                  })}
                  min="0"
                  step="0.01"
                  placeholder="No limit"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="usage_limit">Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                value={formData.usage_limit || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  usage_limit: e.target.value ? Number(e.target.value) : undefined 
                })}
                min="1"
                placeholder="Unlimited"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="starts_at">Start Date</Label>
              <Input
                id="starts_at"
                type="datetime-local"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Summer sale discount"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCode(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCode}>Update Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDiscountCodes;
