import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, Mail } from 'lucide-react';

const NewRestaurantPage: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-gray-900">Add New Restaurant</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new restaurant for your QR menu system
          </p>
        </div>
      </div>

      {/* Restaurant Form */}
      <div className="card">
        <div className="card-body">
          <form className="space-y-6">
            {/* Restaurant Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Restaurant Name *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  className="input pl-10"
                  placeholder="Enter restaurant name"
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
                placeholder="Describe your restaurant..."
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="address"
                  className="input pl-10"
                  placeholder="Enter restaurant address"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    className="input pl-10"
                    placeholder="+966 50 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="input pl-10"
                    placeholder="restaurant@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Cuisine Type */}
            <div className="form-group">
              <label htmlFor="cuisine" className="form-label">
                Cuisine Type
              </label>
              <select id="cuisine" className="input">
                <option value="">Select cuisine type</option>
                <option value="arabic">Arabic</option>
                <option value="international">International</option>
                <option value="fast-food">Fast Food</option>
                <option value="seafood">Seafood</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="other">Other</option>
              </select>
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
                Create Restaurant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRestaurantPage;
