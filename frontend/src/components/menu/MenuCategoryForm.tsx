import React from 'react';
import { useForm } from 'react-hook-form';
import { Save, X, Image as ImageIcon } from 'lucide-react';
import { MenuCategory } from '@/types';
import { cn } from '@/utils';

interface MenuCategoryFormProps {
  category?: Partial<MenuCategory>;
  onSubmit: (data: Partial<MenuCategory>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MenuCategoryForm: React.FC<MenuCategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<Partial<MenuCategory>>({
    defaultValues: {
      name: category?.name || '',
      nameAr: category?.nameAr || '',
      description: category?.description || '',
      descriptionAr: category?.descriptionAr || '',
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 0,
      image: category?.image || '',
      color: category?.color || '#3B82F6'
    }
  });

  const handleFormSubmit = async (data: Partial<MenuCategory>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <p className="text-gray-600">
          {category ? 'Update' : 'Create'} a menu category to organize your menu items
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Category Name (English) *
              </label>
              <input
                id="name"
                type="text"
                className={cn('input', errors.name ? 'input-error' : '')}
                placeholder="e.g., Appetizers, Main Course"
                {...register('name', { required: 'Category name is required' })}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="nameAr" className="form-label">
                Category Name (Arabic)
              </label>
              <input
                id="nameAr"
                type="text"
                className="input"
                placeholder="مقبلات، الطبق الرئيسي"
                {...register('nameAr')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description (English)
              </label>
              <textarea
                id="description"
                rows={3}
                className="input"
                placeholder="Describe this category"
                {...register('description')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descriptionAr" className="form-label">
                Description (Arabic)
              </label>
              <textarea
                id="descriptionAr"
                rows={3}
                className="input"
                placeholder="وصف هذه الفئة"
                {...register('descriptionAr')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="sortOrder" className="form-label">
                Sort Order
              </label>
              <input
                id="sortOrder"
                type="number"
                min="0"
                className="input"
                placeholder="0"
                {...register('sortOrder', { valueAsNumber: true })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first in the menu
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="color" className="form-label">
                Category Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="color"
                  type="color"
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  {...register('color')}
                />
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="#3B82F6"
                  {...register('color')}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Used for category badges and visual organization
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Category is active
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Inactive categories won't be visible to customers
            </p>
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label className="form-label">Category Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              {watch('image') ? (
                <div className="flex flex-col items-center">
                  <img
                    src={watch('image')}
                    alt="Category preview"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: Implement image upload
                      console.log('Image upload clicked');
                    }}
                    className="btn-outline text-sm"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => {
                        // TODO: Implement image upload
                        console.log('Image upload clicked');
                      }}
                      className="relative bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload an image</span>
                    </button>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline"
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="spinner w-4 h-4 mr-2" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {category ? 'Update Category' : 'Create Category'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuCategoryForm;

