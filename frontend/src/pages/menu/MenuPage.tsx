import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Tag, 
  Utensils, 
  BarChart3,
  Settings,
  Eye
} from 'lucide-react';

// Import components
import MenuCategoryList from '@/components/menu/MenuCategoryList';
import MenuCategoryForm from '@/components/menu/MenuCategoryForm';
import MenuItemList from '@/components/menu/MenuItemList';
import MenuItemForm from '@/components/menu/MenuItemForm';
import RoleGuard from '@/components/auth/RoleGuard';

// Import services
import MenuService from '@/services/menu';
import RestaurantService from '@/services/restaurant';

// Import types
import { MenuItem, MenuCategory, Restaurant } from '@/types';
import { cn } from '@/utils';

type ViewMode = 'categories' | 'items' | 'add-category' | 'edit-category' | 'view-category' | 'add-item' | 'edit-item' | 'view-item';
type ActiveTab = 'categories' | 'items' | 'analytics' | 'settings';

const MenuPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('categories');
  
  // Data states
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchCategories();
      fetchItems();
    }
  }, [selectedRestaurant]);

  const fetchRestaurants = async () => {
    try {
      const data = await RestaurantService.getMyRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching restaurants:', error);
      
      // Extract proper error message
      let errorMessage = 'Failed to fetch restaurants';
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast.error(errorMessage);
      setRestaurants([]);
    }
  };

  const fetchCategories = async () => {
    if (!selectedRestaurant) return;
    
    setIsLoading(true);
    try {
      const data = await MenuService.getCategories(selectedRestaurant._id);
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchItems = async () => {
    if (!selectedRestaurant) return;
    
    try {
      const data = await MenuService.getMenuItems(selectedRestaurant._id);
      setItems(data.items);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch menu items');
    }
  };

  // Category handlers
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setViewMode('add-category');
  };

  const handleEditCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setViewMode('edit-category');
  };

  const handleViewCategory = (category: MenuCategory) => {
    setSelectedCategory(category);
    setViewMode('view-category');
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also remove all items in this category.')) {
      return;
    }

    try {
      await MenuService.deleteCategory(categoryId);
      toast.success('Category deleted successfully');
      fetchCategories();
      fetchItems(); // Refresh items as some might have been deleted
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleSubmitCategory = async (data: Partial<MenuCategory>) => {
    if (!selectedRestaurant) return;
    
    setIsSubmitting(true);
    try {
      if (viewMode === 'add-category') {
        await MenuService.createCategory(selectedRestaurant._id, data);
        toast.success('Category created successfully');
      } else if (viewMode === 'edit-category' && selectedCategory) {
        await MenuService.updateCategory(selectedCategory._id, data);
        toast.success('Category updated successfully');
      }
      setViewMode('categories');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReorderCategories = async (categoryIds: string[]) => {
    if (!selectedRestaurant) return;
    
    try {
      await MenuService.reorderCategories(selectedRestaurant._id, categoryIds);
      toast.success('Category order updated successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder categories');
    }
  };

  // Item handlers
  const handleAddItem = () => {
    setSelectedItem(null);
    setViewMode('add-item');
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setViewMode('edit-item');
  };

  const handleViewItem = (item: MenuItem) => {
    setSelectedItem(item);
    setViewMode('view-item');
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      return;
    }

    try {
      await MenuService.deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete menu item');
    }
  };

  const handleToggleItemStatus = async (itemId: string) => {
    try {
      await MenuService.toggleItemStatus(itemId);
      toast.success('Item status updated successfully');
      fetchItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update item status');
    }
  };

  const handleSubmitItem = async (data: Partial<MenuItem>) => {
    if (!selectedRestaurant) return;
    
    setIsSubmitting(true);
    try {
      if (viewMode === 'add-item') {
        await MenuService.createMenuItem(selectedRestaurant._id, data);
        toast.success('Menu item created successfully');
      } else if (viewMode === 'edit-item' && selectedItem) {
        await MenuService.updateMenuItem(selectedItem._id, data);
        toast.success('Menu item updated successfully');
      }
      setViewMode('items');
      // Force refresh both items and categories
      await Promise.all([fetchItems(), fetchCategories()]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (viewMode.includes('category')) {
      setViewMode('categories');
    } else if (viewMode.includes('item')) {
      setViewMode('items');
    }
    setSelectedCategory(null);
    setSelectedItem(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'add-category':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </button>
            </div>
            <MenuCategoryForm
              onSubmit={handleSubmitCategory}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'edit-category':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </button>
            </div>
            <MenuCategoryForm
              category={selectedCategory || undefined}
              onSubmit={handleSubmitCategory}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'view-category':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </button>
            </div>
            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Category Details
                </h2>
                {selectedCategory && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Name</h3>
                      <p className="text-gray-600">{selectedCategory.name}</p>
                      {selectedCategory.nameAr && (
                        <p className="text-gray-600 font-arabic">{selectedCategory.nameAr}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600">{selectedCategory.description || 'No description'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Status</h3>
                      <p className="text-gray-600">
                        {selectedCategory.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Sort Order</h3>
                      <p className="text-gray-600">{selectedCategory.sortOrder || 0}</p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => handleEditCategory(selectedCategory)}
                        className="btn-primary"
                      >
                        Edit Category
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'add-item':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu Items
              </button>
            </div>
            <MenuItemForm
              categories={categories}
              onSubmit={handleSubmitItem}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'edit-item':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu Items
              </button>
            </div>
            <MenuItemForm
              item={selectedItem || undefined}
              categories={categories}
              onSubmit={handleSubmitItem}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        );

      case 'view-item':
        return (
          <div>
            <div className="mb-6">
              <button
                onClick={handleCancel}
                className="btn-outline mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Menu Items
              </button>
            </div>
            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Menu Item Details
                </h2>
                {selectedItem && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Name</h3>
                      <p className="text-gray-600">{selectedItem.name}</p>
                      {selectedItem.nameAr && (
                        <p className="text-gray-600 font-arabic">{selectedItem.nameAr}</p>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-600">{selectedItem.description}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Category</h3>
                      <p className="text-gray-600">
                        {getCategoryName(selectedItem.categoryId || '')}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Price</h3>
                      <p className="text-gray-600">SAR {selectedItem.price}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Status</h3>
                      <p className="text-gray-600">
                        {selectedItem.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => handleEditItem(selectedItem)}
                        className="btn-primary"
                      >
                        Edit Item
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'categories'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Tag className="h-4 w-4" />
                  <span>Categories</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('items')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'items'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Utensils className="h-4 w-4" />
                  <span>Menu Items</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'analytics'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                    activeTab === 'settings'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'categories' && (
              <MenuCategoryList
                categories={categories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onViewCategory={handleViewCategory}
                onDeleteCategory={handleDeleteCategory}
                onReorderCategories={handleReorderCategories}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'items' && (
              <MenuItemList
                items={items}
                categories={categories}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onViewItem={handleViewItem}
                onDeleteItem={handleDeleteItem}
                onToggleStatus={handleToggleItemStatus}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Menu Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Analytics and insights will be available here.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Menu Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Menu configuration and settings will be available here.
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  if (!selectedRestaurant) {
    return (
      <div className="text-center py-12">
        <Tag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Restaurant Selected</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please select a restaurant to manage its menu.
        </p>
      </div>
    );
  }

  // Show error boundary state
  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="mt-1 text-sm text-gray-500">Organize your menu into categories</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>An unexpected error occurred. Please refresh the page.</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['restaurant_owner', 'admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          {viewMode === 'categories' 
            ? 'Organize your menu into categories'
            : viewMode === 'items'
            ? 'Manage your menu items and offerings'
            : viewMode.includes('category')
            ? 'Category management'
            : 'Menu item management'
          }
        </p>
        
        {/* Restaurant Selector */}
        <div className="mt-4">
          <label htmlFor="restaurant-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Restaurant
          </label>
          <select
            id="restaurant-select"
            value={selectedRestaurant._id}
            onChange={(e) => {
              const restaurant = restaurants.find(r => r._id === e.target.value);
              if (restaurant) {
                setSelectedRestaurant(restaurant);
                setViewMode('categories');
                setActiveTab('categories');
              }
            }}
            className="input max-w-xs"
          >
            {Array.isArray(restaurants) && restaurants.map((restaurant) => (
              <option key={restaurant._id} value={restaurant._id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

        {/* Content */}
        {renderContent()}
      </div>
    </RoleGuard>
  );
};

export default MenuPage;
