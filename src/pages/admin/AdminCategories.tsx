
import React from 'react';
import CategoryManager from '@/components/admin/CategoryManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeInView from '@/components/animations/FadeInView';

const AdminCategories: React.FC = () => {
  return (
    <div className="space-y-6">
      <FadeInView direction="up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link to="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-nature-forest dark:text-white">
                Category Management
              </h1>
              <p className="text-nature-bark dark:text-gray-300 mt-2">
                Organize your products with categories
              </p>
            </div>
          </div>
        </div>
      </FadeInView>

      <CategoryManager />
    </div>
  );
};

export default AdminCategories;
