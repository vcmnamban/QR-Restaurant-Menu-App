import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Image as ImageIcon,
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { MenuCategory } from '@/types';
import { cn } from '@/utils';

interface MenuCategoryListProps {
  categories: MenuCategory[];
  onAddCategory: () => void;
  onEditCategory: (category: MenuCategory) => void;
  onViewCategory: (category: MenuCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategories: (categoryIds: string[]) => Promise<void>;
  isLoading?: boolean;
}

const MenuCategoryList: React.FC<MenuCategoryListProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onViewCategory,
  onDeleteCategory,
  onReorderCategories,
  isLoading = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isReordering, setIsReordering] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => {
    if (sortOrder === 'asc') {
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    } else {
      return (b.sortOrder || 0) - (a.sortOrder || 0);
    }
  });

  const handleReorder = async () => {
    if (isReordering) return;
    
    setIsReordering(true);
    try {
      const newOrder = sortedCategories.map(cat => cat._id);
      await onReorderCategories(newOrder);
    } catch (error) {
      console.error('Failed to reorder categories:', error);
    } finally {
      setIsReordering(false);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first menu category.
        </p>
        <div className="mt-6">
          <button
            onClick={onAddCategory}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Menu Categories ({categories.length})
          </h2>
          <p className="text-sm text-gray-500">
            Organize your menu items into categories
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReorder}
            disabled={isReordering}
            className={cn(
              'btn-outline',
              isReordering && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isReordering ? (
              <div className="spinner w-4 h-4 mr-2" />
            ) : sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            {isReordering ? 'Saving...' : 'Save Order'}
          </button>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn-outline"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
          
          <button
            onClick={onAddCategory}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 gap-4">
        {sortedCategories.map((category, index) => (
          <div key={category._id} className="card hover:shadow-medium transition-shadow">
            <div className="card-body">
              <div className="flex items-start space-x-4">
                {/* Category Image/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-primary-600" />
                    )}
                  </div>
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <span 
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        ></span>
                      </div>
                      {category.nameAr && (
                        <p className="text-sm text-gray-600 font-arabic">
                          {category.nameAr}
                        </p>
                      )}
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0 ml-4">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(category.isActive)
                      )}>
                        {getStatusText(category.isActive)}
                      </span>
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      <span>Sort Order: {category.sortOrder || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Position: {index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Menu */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <button
                      onClick={() => setSelectedCategory(
                        selectedCategory === category._id ? null : category._id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {selectedCategory === category._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              onViewCategory(category);
                              setSelectedCategory(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              onEditCategory(category);
                              setSelectedCategory(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDeleteCategory(category._id);
                              setSelectedCategory(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategoryList;

