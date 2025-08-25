import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Image as ImageIcon,
  DollarSign,
  Clock,
  Star,
  Tag,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { MenuItem, MenuCategory } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface MenuItemListProps {
  items: MenuItem[];
  categories: MenuCategory[];
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
  onViewItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleStatus: (itemId: string) => Promise<void>;
  isLoading?: boolean;
}

const MenuItemList: React.FC<MenuItemListProps> = ({
  items,
  categories,
  onAddItem,
  onEditItem,
  onViewItem,
  onDeleteItem,
  onToggleStatus,
  isLoading = false
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || item.categoryId === selectedCategory;
    const matchesStatus = !showOnlyActive || item.isActive;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getDietaryBadges = (item: MenuItem) => {
    const badges = [];
    if (item.isVegetarian) badges.push({ text: 'Vegetarian', color: 'bg-green-100 text-green-800' });
    if (item.isVegan) badges.push({ text: 'Vegan', color: 'bg-emerald-100 text-emerald-800' });
    if (item.isGlutenFree) badges.push({ text: 'Gluten Free', color: 'bg-blue-100 text-blue-800' });
    if (item.isHalal) badges.push({ text: 'Halal', color: 'bg-purple-100 text-purple-800' });
    return badges;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
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

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating your first menu item.
        </p>
        <div className="mt-6">
          <button
            onClick={onAddItem}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
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
            Menu Items ({filteredItems.length})
          </h2>
          <p className="text-sm text-gray-500">
            Manage your restaurant's menu offerings
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="btn-outline"
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4 mr-2" />
            ) : (
              <Grid className="h-4 w-4 mr-2" />
            )}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          
          <button
            onClick={onAddItem}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-full"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={showOnlyActive ? 'active' : 'all'}
              onChange={(e) => setShowOnlyActive(e.target.value === 'active')}
              className="input w-full"
            >
              <option value="active">Active Only</option>
              <option value="all">All Items</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setShowOnlyActive(true);
              }}
              className="btn-outline w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="card hover:shadow-medium transition-shadow">
              {/* Item Image */}
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 rounded-t-lg object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(item.isActive)
                  )}>
                    {getStatusText(item.isActive)}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="card-body">
                <div className="space-y-3">
                  {/* Title and Category */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    {item.nameAr && (
                      <p className="text-sm text-gray-600 font-arabic">
                        {item.nameAr}
                      </p>
                    )}
                    <p className="text-sm text-primary-600">
                      {getCategoryName(item.categoryId)}
                    </p>
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {/* Dietary Badges */}
                  <div className="flex flex-wrap gap-2">
                    {getDietaryBadges(item).map((badge, index) => (
                      <span
                        key={index}
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          badge.color
                        )}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{item.preparationTime || 15} min</span>
                    </div>
                    {item.calories > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        <span>{item.calories} cal</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onViewItem(item)}
                        className="btn-outline text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => onEditItem(item)}
                        className="btn-outline text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setSelectedItem(
                        selectedItem === item._id ? null : item._id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {selectedItem === item._id && (
                <div className="absolute right-2 top-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onToggleStatus(item._id);
                        setSelectedItem(null);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => {
                        onDeleteItem(item._id);
                        setSelectedItem(null);
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
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item._id} className="card hover:shadow-medium transition-shadow">
              <div className="card-body">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        {item.nameAr && (
                          <p className="text-sm text-gray-600 font-arabic">
                            {item.nameAr}
                          </p>
                        )}
                        <p className="text-sm text-primary-600">
                          {getCategoryName(item.categoryId)}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      
                      {/* Price and Status */}
                      <div className="flex-shrink-0 ml-4 text-right">
                        <div className="text-lg font-medium text-gray-900">
                          {formatCurrency(item.price)}
                        </div>
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1',
                          getStatusColor(item.isActive)
                        )}>
                          {getStatusText(item.isActive)}
                        </span>
                      </div>
                    </div>

                    {/* Dietary Badges and Info */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {getDietaryBadges(item).map((badge, index) => (
                          <span
                            key={index}
                            className={cn(
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              badge.color
                            )}
                          >
                            {badge.text}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{item.preparationTime || 15} min</span>
                        </div>
                        {item.calories > 0 && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            <span>{item.calories} cal</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewItem(item)}
                        className="btn-outline text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => onEditItem(item)}
                        className="btn-outline text-sm"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => setSelectedItem(
                          selectedItem === item._id ? null : item._id
                        )}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {selectedItem === item._id && (
                  <div className="absolute right-2 top-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onToggleStatus(item._id);
                          setSelectedItem(null);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => {
                          onDeleteItem(item._id);
                          setSelectedItem(null);
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemList;
