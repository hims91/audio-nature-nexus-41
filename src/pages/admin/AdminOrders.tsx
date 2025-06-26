import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaginationAdvanced } from '@/components/ui/pagination-advanced';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminOrders, useOrderStats, useOrderMutations } from '@/hooks/useAdminOrders';
import { formatPrice } from '@/utils/currency';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import FadeInView from '@/components/animations/FadeInView';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: XCircle },
};

const paymentStatusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
};

const AdminOrders: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data: orderStats, isLoading: isLoadingStats } = useOrderStats();
  
  const filters = {
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
    page: currentPage,
    pageSize,
  };

  const { data: ordersData, isLoading: isLoadingOrders } = useAdminOrders(filters);
  const { updateOrderStatus } = useOrderMutations();

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;
  const totalPages = ordersData?.totalPages || 1;

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ id: orderId, status: newStatus });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const filteredOrders = orders.filter(order => {
    if (currentTab === 'pending') return order.status === 'pending';
    if (currentTab === 'processing') return order.status === 'processing';
    if (currentTab === 'shipped') return order.status === 'shipped';
    if (currentTab === 'completed') return order.status === 'delivered';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
              Order Management
            </h1>
            <p className="text-nature-bark dark:text-gray-300 mt-2">
              Manage customer orders, fulfillment, and tracking
            </p>
          </div>
        </div>
      </FadeInView>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FadeInView direction="up" delay={0.1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-nature-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-forest dark:text-white">
                {isLoadingStats ? '...' : orderStats?.totalOrders || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All time orders
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-nature-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-forest dark:text-white">
                {isLoadingStats ? '...' : formatPrice(orderStats?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                From paid orders
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.3}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {isLoadingStats ? '...' : orderStats?.pendingOrders || 0}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Require attention
              </p>
            </CardContent>
          </Card>
        </FadeInView>

        <FadeInView direction="up" delay={0.4}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-nature-forest" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-nature-forest dark:text-white">
                {isLoadingStats ? '...' : 
                  orderStats?.totalOrders && orderStats?.totalRevenue 
                    ? formatPrice(Math.round(orderStats.totalRevenue / orderStats.totalOrders))
                    : '$0.00'
                }
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Average order size
              </p>
            </CardContent>
          </Card>
        </FadeInView>
      </div>

      {/* Filters */}
      <FadeInView direction="up" delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={(value) => {
                setPaymentFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  {Object.entries(paymentStatusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </FadeInView>

      {/* Orders Table */}
      <FadeInView direction="up" delay={0.6}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  {totalOrders} total orders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={(value) => {
              setCurrentTab(value);
              setCurrentPage(1);
            }}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={currentTab} className="space-y-4">
                {isLoadingOrders ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {search || statusFilter !== 'all' || paymentFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Orders will appear here once customers start purchasing'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => {
                          const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
                          const paymentInfo = paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig];
                          const StatusIcon = statusInfo?.icon || Package;

                          return (
                            <TableRow key={order.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{order.order_number}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.items?.length || 0} items
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {order.shipping_first_name || order.billing_first_name || 'Guest'} {order.shipping_last_name || order.billing_last_name || ''}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.email}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusInfo?.color || 'bg-gray-100 text-gray-800'}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo?.label || order.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={paymentInfo?.color || 'bg-gray-100 text-gray-800'}>
                                  {paymentInfo?.label || order.payment_status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <p className="font-medium">{formatPrice(order.total_cents)}</p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">{formatDate(order.created_at)}</p>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/admin/orders/${order.id}`}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                      </Link>
                                    </DropdownMenuItem>
                                    {order.status === 'pending' && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(order.id, 'processing')}
                                      >
                                        Mark as Processing
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === 'processing' && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(order.id, 'shipped')}
                                      >
                                        Mark as Shipped
                                      </DropdownMenuItem>
                                    )}
                                    {order.status === 'shipped' && (
                                      <DropdownMenuItem
                                        onClick={() => handleStatusChange(order.id, 'delivered')}
                                      >
                                        Mark as Delivered
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <PaginationAdvanced
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalOrders}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                      pageSizeOptions={[10, 15, 25, 50]}
                      showPageSizeSelector={true}
                      showItemCount={true}
                    />
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </FadeInView>
    </div>
  );
};

export default AdminOrders;
