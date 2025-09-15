import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Plus, X } from 'lucide-react';

const NewMenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-outline p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Menu</h1>
          <p className="mt-1 text-sm text-gray-500">
            Design your restaurant's digital menu
          </p>
        </div>
      </div>

      {/* Menu Form */}
      <div className="card">
        <div className="card-body">
          <form className="space-y-6">
            {/* Menu Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Menu Name *
              </label>
              <div className="relative">
                <Menu className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  className="input pl-10"
                  placeholder="e.g., Main Menu, Breakfast Menu"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="input"
                placeholder="Describe your menu..."
              />
            </div>

            {/* Menu Categories */}
            <div className="form-group">
              <label className="form-label">Menu Categories</label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Category name (e.g., Appetizers, Main Course, Desserts)"
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    className="btn-outline p-2"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Add categories to organize your menu items
                </div>
              </div>
            </div>

            {/* Sample Menu Items */}
            <div className="form-group">
              <label className="form-label">Menu Items</label>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Grilled Chicken"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (SAR)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input"
                        placeholder="25.00"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      className="input"
                      placeholder="Describe this menu item..."
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      className="btn-outline text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove Item
                    </button>
                  </div>
                </div>
                
                <button
                  type="button"
                  className="btn-outline w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-outline"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Menu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMenuPage;

