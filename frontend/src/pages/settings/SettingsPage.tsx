import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { RestaurantService } from '@/services/restaurant';
import { toast } from 'react-hot-toast';
import { 
  Settings, 
  User, 
  Building2, 
  Palette, 
  Bell, 
  Globe, 
  Shield, 
  CreditCard,
  MapPin,
  Clock,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RestaurantSettings {
  businessHours: {
    [key: string]: {
      isOpen: boolean;
      openTime: string;
      closeTime: string;
    };
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  deliverySettings: {
    isDeliveryEnabled: boolean;
    deliveryRadius: number;
    deliveryFee: number;
    minimumOrder: number;
    deliveryZones: Array<{
      name: string;
      radius: number;
      fee: number;
    }>;
  };
  paymentMethods: {
    cash: boolean;
    card: boolean;
    mada: boolean;
    applePay: boolean;
    stcPay: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    marketing: boolean;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
    favicon?: string;
    customCSS?: string;
  };
}

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: 'en' | 'ar';
    timezone: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    emailUpdates: boolean;
    smsUpdates: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordExpiryDays: number;
  };
}

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('restaurant');
  const [isLoading, setIsLoading] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    businessHours: {
      monday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      tuesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      wednesday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      thursday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      friday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
      sunday: { isOpen: true, openTime: '09:00', closeTime: '22:00' },
    },
    contactInfo: {
      phone: '',
      email: '',
      website: '',
    },
    deliverySettings: {
      isDeliveryEnabled: true,
      deliveryRadius: 10,
      deliveryFee: 15,
      minimumOrder: 50,
      deliveryZones: [
        { name: 'Near Zone', radius: 5, fee: 10 },
        { name: 'Medium Zone', radius: 10, fee: 15 },
        { name: 'Far Zone', radius: 15, fee: 25 },
      ],
    },
    paymentMethods: {
      cash: true,
      card: true,
      mada: true,
      applePay: false,
      stcPay: false,
    },
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderUpdates: true,
      marketing: false,
    },
    branding: {
      primaryColor: '#FF6B35',
      secondaryColor: '#F7931E',
      logo: '',
      favicon: '',
      customCSS: '',
    },
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    profile: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: 'en',
      timezone: 'Asia/Riyadh',
    },
    preferences: {
      theme: 'light',
      notifications: true,
      emailUpdates: true,
      smsUpdates: false,
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiryDays: 90,
    },
  });

  const tabs = [
    { id: 'restaurant', name: 'Restaurant', icon: Building2 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'branding', name: 'Branding', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!user?.restaurantId) return;
    
    setIsLoading(true);
    try {
      const restaurant = await RestaurantService.getRestaurant(user.restaurantId);
      if (restaurant) {
        // Update restaurant settings with actual data
        setRestaurantSettings(prev => ({
          ...prev,
          contactInfo: {
            phone: restaurant.phone || '',
            email: restaurant.email || '',
            website: restaurant.website || '',
          },
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSettingsSave = async () => {
    if (!user?.restaurantId) return;
    
    setIsLoading(true);
    try {
      // Update restaurant with new settings
      await RestaurantService.updateRestaurant(user.restaurantId, {
        phone: restaurantSettings.contactInfo.phone,
        email: restaurantSettings.contactInfo.email,
        website: restaurantSettings.contactInfo.website,
        // Add other settings as needed
      });
      
      toast.success('Restaurant settings saved successfully');
    } catch (error) {
      toast.error('Failed to save restaurant settings');
      console.error('Error saving restaurant settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSettingsSave = async () => {
    setIsLoading(true);
    try {
      // Update user profile
      // This would typically call an API to update user settings
      toast.success('User settings saved successfully');
    } catch (error) {
      toast.error('Failed to save user settings');
      console.error('Error saving user settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRestaurantSettings = () => (
    <div className="space-y-6">
      {/* Business Hours */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Business Hours
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(restaurantSettings.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-3 p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={hours.isOpen}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  businessHours: {
                    ...prev.businessHours,
                    [day]: { ...hours, isOpen: e.target.checked }
                  }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span className="w-20 capitalize">{day}</span>
              <input
                type="time"
                value={hours.openTime}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  businessHours: {
                    ...prev.businessHours,
                    [day]: { ...hours, openTime: e.target.value }
                  }
                }))}
                className="border rounded px-2 py-1"
                disabled={!hours.isOpen}
              />
              <span>to</span>
              <input
                type="time"
                value={hours.closeTime}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  businessHours: {
                    ...prev.businessHours,
                    [day]: { ...hours, closeTime: e.target.value }
                  }
                }))}
                className="border rounded px-2 py-1"
                disabled={!hours.isOpen}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={restaurantSettings.contactInfo.phone}
              onChange={(e) => setRestaurantSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, phone: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={restaurantSettings.contactInfo.email}
              onChange={(e) => setRestaurantSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, email: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={restaurantSettings.contactInfo.website}
              onChange={(e) => setRestaurantSettings(prev => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, website: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Delivery Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Delivery Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={restaurantSettings.deliverySettings.isDeliveryEnabled}
              onChange={(e) => setRestaurantSettings(prev => ({
                ...prev,
                deliverySettings: { ...prev.deliverySettings, isDeliveryEnabled: e.target.checked }
              }))}
              className="w-4 h-4 text-orange-600"
            />
            <span>Enable delivery service</span>
          </div>
          
          {restaurantSettings.deliverySettings.isDeliveryEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Radius (km)
                </label>
                <input
                  type="number"
                  value={restaurantSettings.deliverySettings.deliveryRadius}
                  onChange={(e) => setRestaurantSettings(prev => ({
                    ...prev,
                    deliverySettings: { ...prev.deliverySettings, deliveryRadius: Number(e.target.value) }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Fee (SAR)
                </label>
                <input
                  type="number"
                  value={restaurantSettings.deliverySettings.deliveryFee}
                  onChange={(e) => setRestaurantSettings(prev => ({
                    ...prev,
                    deliverySettings: { ...prev.deliverySettings, deliveryFee: Number(e.target.value) }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Order (SAR)
                </label>
                <input
                  type="number"
                  value={restaurantSettings.deliverySettings.minimumOrder}
                  onChange={(e) => setRestaurantSettings(prev => ({
                    ...prev,
                    deliverySettings: { ...prev.deliverySettings, minimumOrder: Number(e.target.value) }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Methods
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(restaurantSettings.paymentMethods).map(([method, enabled]) => (
            <div key={method} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  paymentMethods: { ...prev.paymentMethods, [method]: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span className="capitalize">{method.replace(/([A-Z])/g, ' $1')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRestaurantSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Restaurant Settings
        </button>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={userSettings.profile.firstName}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, firstName: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={userSettings.profile.lastName}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, lastName: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userSettings.profile.email}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={userSettings.profile.phone}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, phone: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={userSettings.profile.language}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, language: e.target.value as 'en' | 'ar' }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={userSettings.profile.timezone}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, timezone: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
              <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={userSettings.preferences.theme}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' | 'auto' }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={userSettings.preferences.notifications}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, notifications: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Enable push notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={userSettings.preferences.emailUpdates}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, emailUpdates: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Email updates and newsletters</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={userSettings.preferences.smsUpdates}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, smsUpdates: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>SMS updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUserSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Profile Settings
        </button>
      </div>
    </div>
  );

  const renderBrandingSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Branding & Customization
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={restaurantSettings.branding.primaryColor}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value }
                }))}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={restaurantSettings.branding.primaryColor}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  branding: { ...prev.branding, primaryColor: e.target.value }
                }))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={restaurantSettings.branding.secondaryColor}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  branding: { ...prev.branding, secondaryColor: e.target.value }
                }))}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={restaurantSettings.branding.secondaryColor}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  branding: { ...prev.branding, secondaryColor: e.target.value }
                }))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Upload
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-orange-600 hover:text-orange-500">
                      Click to upload
                    </span> or drag and drop
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom CSS
            </label>
            <textarea
              value={restaurantSettings.branding.customCSS}
              onChange={(e) => setRestaurantSettings(prev => ({
                ...prev,
                branding: { ...prev.branding, customCSS: e.target.value }
              }))}
              rows={6}
              placeholder="/* Add custom CSS styles here */"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Custom CSS will be applied to your menu pages
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRestaurantSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Branding Settings
        </button>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={restaurantSettings.notifications.email}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Email notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={restaurantSettings.notifications.sms}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, sms: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>SMS notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={restaurantSettings.notifications.push}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Push notifications</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={restaurantSettings.notifications.orderUpdates}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, orderUpdates: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Order updates</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={restaurantSettings.notifications.marketing}
                onChange={(e) => setRestaurantSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, marketing: e.target.checked }
                }))}
                className="w-4 h-4 text-orange-600"
              />
              <span>Marketing communications</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRestaurantSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Notification Settings
        </button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={userSettings.security.twoFactorEnabled}
              onChange={(e) => setUserSettings(prev => ({
                ...prev,
                security: { ...prev.security, twoFactorEnabled: e.target.checked }
              }))}
              className="w-4 h-4 text-orange-600"
            />
            <span>Enable two-factor authentication</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={userSettings.security.sessionTimeout}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, sessionTimeout: Number(e.target.value) }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={userSettings.security.passwordExpiryDays}
                onChange={(e) => setUserSettings(prev => ({
                  ...prev,
                  security: { ...prev.security, passwordExpiryDays: Number(e.target.value) }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUserSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Security Settings
        </button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Configuration
        </h3>
        <div className="space-y-4">
          <p className="text-gray-600">
            Configure your payment methods and settings. These settings control how customers can pay for orders.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(restaurantSettings.paymentMethods).map(([method, enabled]) => (
              <div key={method} className="flex items-center gap-3 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setRestaurantSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, [method]: e.target.checked }
                  }))}
                  className="w-4 h-4 text-orange-600"
                />
                <span className="capitalize">{method.replace(/([A-Z])/g, ' $1')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleRestaurantSettingsSave}
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
          Save Payment Settings
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'restaurant':
        return renderRestaurantSettings();
      case 'profile':
        return renderProfileSettings();
      case 'branding':
        return renderBrandingSettings();
      case 'notifications':
        return renderNotificationsSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      default:
        return renderRestaurantSettings();
    }
  };

  if (isLoading && !restaurantSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-orange-600" />
            Settings & Configuration
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your restaurant settings, profile preferences, and system configuration
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

