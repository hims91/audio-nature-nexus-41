
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeInView from '@/components/animations/FadeInView';

const AdminProductsHeader: React.FC = () => {
  return (
    <FadeInView direction="up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
            Product Management
          </h1>
          <p className="text-nature-bark dark:text-gray-300 mt-2">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        <Button asChild className="bg-nature-forest hover:bg-nature-leaf">
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>
    </FadeInView>
  );
};

export default AdminProductsHeader;
