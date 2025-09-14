import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser, useAuthActions } from '@/store/auth';
import { 
  Home, 
  Building2, 
  Menu, 
  User, 
  LogOut, 
  Menu as MenuIcon,
  X,
  Settings,
  QrCode,
  TestTube
} from 'lucide-react';
import { cn } from '@/utils';
import { Restaurant } from '@/types';
import RestaurantService from '@/services/restaurant';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const user = useUser();
  const { logout } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch restaurant data on component mount
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurants = await RestaurantService.getMyRestaurants();
        if (restaurants && restaurants.length > 0) {
          setRestaurant(restaurants[0]); // Use the first restaurant
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        // Set fallback restaurant name
        setRestaurant({
          _id: 'fallback',
          name: 'QR Restaurant',
          description: 'Restaurant Management System',
          address: { street: '', city: '', state: '', zipCode: '', country: '' },
          contact: { phone: '', email: '' },
          rating: 0,
          totalReviews: 0,
          category: [],
          cuisine: [],
          features: [],
          paymentMethods: [],
          deliveryOptions: { delivery: false, pickup: false, dineIn: false, deliveryFee: 0, minimumOrder: 0, deliveryRadius: 0 },
          hours: {} as any,
          isActive: true,
          isVerified: false,
          subscription: { plan: 'free', status: 'active', startDate: new Date(), endDate: new Date() },
          createdAt: new Date(),
          updatedAt: new Date(),
          images: [],
          owner: ''
        } as Restaurant);
      }
    };

    fetchRestaurant();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Restaurant', href: '/restaurant', icon: Building2 },
    { name: 'Menu', href: '/menu', icon: Menu },
    { name: 'QR Codes', href: '/qr', icon: QrCode },
    { name: 'Testing', href: '/testing', icon: TestTube },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const handleNavigation = (href: string) => {
    console.log('Navigating to:', href);
    console.log('Current location:', location.pathname);
    console.log('Is authenticated:', user ? 'Yes' : 'No');
    console.log('User:', user);
    navigate(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              {restaurant?.name || 'QR Restaurant'}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavigation(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left',
                    isActiveRoute(item.href)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              {restaurant?.name || 'QR Restaurant'}
            </h1>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left',
                    isActiveRoute(item.href)
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              );
            })}
          </nav>
          
          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <button
                onClick={() => handleNavigation('/settings')}
                className="flex w-full items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Add notifications, language switcher, etc. here */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
