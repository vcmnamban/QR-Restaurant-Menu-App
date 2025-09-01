import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Save, 
  X, 
  Image as ImageIcon, 
  Plus, 
  Trash2,
  DollarSign,
  Clock,
  Star,
  Tag,
  Info
} from 'lucide-react';
import { MenuItem, MenuCategory, NutritionalInfo, CustomizationOption } from '@/types';
import { cn, formatCurrency } from '@/utils';

interface MenuItemFormProps {
  item?: Partial<MenuItem>;
  categories: MenuCategory[];
  onSubmit: (data: Partial<MenuItem>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  categories,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [customizations, setCustomizations] = useState<CustomizationOption[]>(
    item?.customizationOptions || []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue
  } = useForm<Partial<MenuItem>>({
    defaultValues: {
      name: item?.name || '',
      nameAr: item?.nameAr || '',
      description: item?.description || '',
      descriptionAr: item?.descriptionAr || '',
      price: item?.price || 0,
      comparePrice: item?.comparePrice || 0,
      categoryId: item?.categoryId || '',
      isActive: item?.isActive ?? true,
      isVegetarian: item?.isVegetarian ?? false,
      isVegan: item?.isVegan ?? false,
      isGlutenFree: item?.isGlutenFree ?? false,
      isHalal: item?.isHalal ?? true,
      preparationTime: item?.preparationTime || 15,
      calories: item?.calories || 0,
      allergens: item?.allergens || [],
      tags: item?.tags || [],
      customizationOptions: item?.customizationOptions || [],
      nutritionalInfo: item?.nutritionalInfo || {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      }
    }
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Info },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'nutrition', label: 'Nutrition', icon: Star },
    { id: 'customization', label: 'Customization', icon: Tag },
    { id: 'timing', label: 'Timing', icon: Clock }
  ];

  const allergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts',
    'Wheat', 'Soybeans', 'Sesame', 'Mustard', 'Celery', 'Lupin',
    'Sulfites', 'Molluscs'
  ];

  const commonTags = [
    'Popular', 'Chef Special', 'New', 'Spicy', 'Mild', 'Fresh',
    'Organic', 'Local', 'Seasonal', 'Healthy', 'Comfort Food',
    'Quick', 'Gourmet', 'Traditional', 'Fusion'
  ];

  const handleFormSubmit = async (data: Partial<MenuItem>) => {
    try {
      // Add customizations to the data
      data.customizationOptions = customizations;
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const addCustomization = () => {
    const newCustomization: CustomizationOption = {
      name: '',
      nameAr: '',
      options: [],
      required: false,
      isRequired: false,
      multiple: false,
      maxSelections: 1,
      minSelections: 0
    };
    setCustomizations([...customizations, newCustomization]);
  };

  const removeCustomization = (index: number) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  const updateCustomization = (index: number, field: keyof CustomizationOption, value: any) => {
    const updated = [...customizations];
    updated[index] = { ...updated[index], [field]: value };
    setCustomizations(updated);
  };

  const addCustomizationOption = (customizationIndex: number) => {
    const updated = [...customizations];
    updated[customizationIndex].options.push({
      name: '',
      nameAr: '',
      price: 0
    });
    setCustomizations(updated);
  };

  const removeCustomizationOption = (customizationIndex: number, optionIndex: number) => {
    const updated = [...customizations];
    updated[customizationIndex].options.splice(optionIndex, 1);
    setCustomizations(updated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {item ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        <p className="text-gray-600">
          {item ? 'Update' : 'Create'} a menu item with all the details your customers need
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Item Name (English) *
                </label>
                <input
                  id="name"
                  type="text"
                  className={cn('input', errors.name ? 'input-error' : '')}
                  placeholder="e.g., Grilled Chicken Breast"
                  {...register('name', { required: 'Item name is required' })}
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="nameAr" className="form-label">
                  Item Name (Arabic)
                </label>
                <input
                  id="nameAr"
                  type="text"
                  className="input"
                  placeholder="صدر دجاج مشوي"
                  {...register('nameAr')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (English) *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={cn('input', errors.description ? 'input-error' : '')}
                  placeholder="Describe the item, ingredients, cooking method..."
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && (
                  <p className="form-error">{errors.description.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="descriptionAr" className="form-label">
                  Description (Arabic)
                </label>
                <textarea
                  id="descriptionAr"
                  rows={3}
                  className="input"
                  placeholder="وصف العنصر، المكونات، طريقة الطهي..."
                  {...register('descriptionAr')}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId" className="form-label">
                Category *
              </label>
              <select
                id="categoryId"
                className={cn('input', errors.categoryId ? 'input-error' : '')}
                {...register('categoryId', { required: 'Category is required' })}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="form-error">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isVegetarian')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Vegetarian</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isVegan')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Vegan</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isGlutenFree')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Gluten Free</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isHalal')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Halal</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                {commonTags.map((tag) => (
                  <label key={tag} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={tag}
                      {...register('tags')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Allergens</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {allergens.map((allergen) => (
                  <label key={allergen} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={allergen}
                      {...register('allergens')}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{allergen}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price (SAR) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    className={cn('input pl-10', errors.price ? 'input-error' : '')}
                    placeholder="0.00"
                    {...register('price', { 
                      required: 'Price is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />
                </div>
                {errors.price && (
                  <p className="form-error">{errors.price.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="comparePrice" className="form-label">
                  Compare Price (SAR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className="input pl-10"
                    placeholder="0.00"
                    {...register('comparePrice', { valueAsNumber: true })}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Original price to show discount
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
                  Item is available for ordering
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Inactive items won't be visible to customers
              </p>
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="calories" className="form-label">
                  Calories
                </label>
                <input
                  id="calories"
                  type="number"
                  min="0"
                  className="input"
                  placeholder="0"
                  {...register('calories', { valueAsNumber: true })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="preparationTime" className="form-label">
                  Preparation Time (minutes)
                </label>
                <input
                  id="preparationTime"
                  type="number"
                  min="0"
                  className="input"
                  placeholder="15"
                  {...register('preparationTime', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Nutritional Information (per serving)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-group">
                  <label className="form-label text-sm">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.protein', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label text-sm">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.carbohydrates', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label text-sm">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.fat', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label text-sm">Fiber (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.fiber', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label text-sm">Sugar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.sugar', { valueAsNumber: true })}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label text-sm">Sodium (mg)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="input"
                    {...register('nutritionalInfo.sodium', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customization Tab */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Customization Options</h4>
              <button
                type="button"
                onClick={addCustomization}
                className="btn-outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </button>
            </div>

            {customizations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Tag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No customization options added yet.</p>
                <p className="text-sm">Add options like "Size", "Toppings", "Sauce", etc.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customizations.map((customization, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h5 className="font-medium text-gray-900">
                        Customization Option {index + 1}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeCustomization(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label className="form-label">Name (English)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Size, Toppings"
                          value={customization.name}
                          onChange={(e) => updateCustomization(index, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Name (Arabic)</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="مثل الحجم، الإضافات"
                          value={customization.nameAr}
                          onChange={(e) => updateCustomization(index, 'nameAr', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="form-group">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={customization.isRequired}
                            onChange={(e) => updateCustomization(index, 'isRequired', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label text-sm">Min Selections</label>
                        <input
                          type="number"
                          min="0"
                          className="input"
                          value={customization.minSelections}
                          onChange={(e) => updateCustomization(index, 'minSelections', parseInt(e.target.value))}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label text-sm">Max Selections</label>
                        <input
                          type="number"
                          min="1"
                          className="input"
                          value={customization.maxSelections}
                          onChange={(e) => updateCustomization(index, 'maxSelections', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    {/* Customization Options */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h6 className="font-medium text-gray-700">Options</h6>
                        <button
                          type="button"
                          onClick={() => addCustomizationOption(index)}
                          className="btn-outline text-sm"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </button>
                      </div>

                      <div className="space-y-3">
                        {customization.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                className="input text-sm"
                                placeholder="Option name"
                                value={option.name}
                                onChange={(e) => {
                                  const updated = [...customization.options];
                                  updated[optionIndex].name = e.target.value;
                                  updateCustomization(index, 'options', updated);
                                }}
                              />
                              <input
                                type="text"
                                className="input text-sm"
                                placeholder="اسم الخيار"
                                value={option.nameAr}
                                onChange={(e) => {
                                  const updated = [...customization.options];
                                  updated[optionIndex].nameAr = e.target.value;
                                  updateCustomization(index, 'options', updated);
                                }}
                              />
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="input text-sm"
                                placeholder="Price"
                                value={option.price}
                                onChange={(e) => {
                                  const updated = [...customization.options];
                                  updated[optionIndex].price = parseFloat(e.target.value) || 0;
                                  updateCustomization(index, 'options', updated);
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCustomizationOption(index, optionIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Timing Tab */}
        {activeTab === 'timing' && (
          <div className="space-y-6">
            <div className="form-group">
              <label htmlFor="preparationTime" className="form-label">
                Preparation Time (minutes)
              </label>
              <input
                id="preparationTime"
                type="number"
                min="0"
                className="input"
                placeholder="15"
                {...register('preparationTime', { valueAsNumber: true })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Estimated time to prepare this item
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Availability Schedule</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={true}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Times
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        className="input text-sm"
                        defaultValue="06:00"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        className="input text-sm"
                        defaultValue="23:00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                {item ? 'Update Item' : 'Create Item'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
