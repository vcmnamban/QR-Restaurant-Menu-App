import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Smartphone, 
  Globe, 
  CreditCard, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Zap,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  Settings,
  FileText,
  Smartphone as Phone
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <QrCode className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">QR Menu Pro</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/features" className="text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link to="/pricing" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Contact
                </Link>
                <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="text-green-600 block">Modern Restaurants</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Everything you need to digitize your restaurant operations, from QR code menus to advanced analytics.
            </p>
            <Link 
              to="/register" 
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600">
              Essential features every restaurant needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">QR Code Menu System</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Single QR Code</h4>
                    <p className="text-gray-600">One QR code for all tables. Easy to print and place on tables.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Access</h4>
                    <p className="text-gray-600">Customers scan and access your menu instantly on their phones.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">No App Required</h4>
                    <p className="text-gray-600">Works in any web browser. No need to download apps.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-32 h-32 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-16 w-16 text-green-600" />
                </div>
                <p className="text-center text-gray-600">Scan QR Code</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bilingual Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Arabic & English Support</h3>
                <p className="text-gray-600">Perfect for Saudi's diverse customer base</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Menu Item Name</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">English</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">العربية</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Description</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">English</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">العربية</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Allergen Info</span>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">English</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">العربية</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Full RTL Support</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Right-to-Left Layout</h4>
                    <p className="text-gray-600">Proper Arabic text direction and layout support.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Language Switching</h4>
                    <p className="text-gray-600">Customers can switch between Arabic and English instantly.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Cultural Adaptation</h4>
                    <p className="text-gray-600">Designed specifically for Saudi market preferences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ordering System */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Ordering System
            </h2>
            <p className="text-xl text-gray-600">
              Handle all types of orders with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dine-in Orders</h3>
              <p className="text-gray-600 mb-4">
                Customers order directly from their table. Orders appear instantly in your kitchen.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Table number tracking</li>
                <li>• Real-time order updates</li>
                <li>• Kitchen display system</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Takeout Orders</h3>
              <p className="text-gray-600 mb-4">
                Customers order for pickup. Get notified when they arrive.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pickup time estimation</li>
                <li>• Order ready notifications</li>
                <li>• Customer contact system</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Orders</h3>
              <p className="text-gray-600 mb-4">
                Zone-based delivery with distance pricing and driver tracking.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Delivery zone management</li>
                <li>• Distance-based pricing</li>
                <li>• Driver assignment system</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Integration */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Saudi Payment Integration
            </h2>
            <p className="text-xl text-gray-600">
              All local payment methods supported
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Mada Cards</h4>
                    <p className="text-gray-600">Saudi's national payment system</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Apple Pay</h4>
                    <p className="text-gray-600">Quick and secure mobile payments</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Credit/Debit Cards</h4>
                    <p className="text-gray-600">Visa, Mastercard, and more</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Cash on Delivery</h4>
                    <p className="text-gray-600">Traditional payment option</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">VAT Compliance</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">15% VAT Integration</h4>
                    <p className="text-gray-600">Automatic Saudi VAT calculation and reporting.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tax Reports</h4>
                    <p className="text-gray-600">Generate VAT reports for tax authorities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Receipt Generation</h4>
                    <p className="text-gray-600">Compliant receipts with VAT breakdown.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Intelligence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Business Intelligence
            </h2>
            <p className="text-xl text-gray-600">
              Make data-driven decisions with comprehensive analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sales Analytics</h3>
              <p className="text-gray-600">
                Track daily, weekly, and monthly sales performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Popular Items</h3>
              <p className="text-gray-600">
                Identify your best-selling menu items and trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Insights</h3>
              <p className="text-gray-600">
                Understand customer behavior and preferences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Peak Hours</h3>
              <p className="text-gray-600">
                Optimize staffing based on busy periods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Integration */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">WhatsApp Integration</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Order Sharing</h4>
                    <p className="text-gray-600">Customers can share their orders via WhatsApp with friends and family.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Order Notifications</h4>
                    <p className="text-gray-600">Send order confirmations and updates via WhatsApp.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Customer Support</h4>
                    <p className="text-gray-600">Provide customer support through WhatsApp integration.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center mb-6">
                <MessageCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900">WhatsApp Business</h4>
                <p className="text-gray-600">Seamless integration with WhatsApp Business API</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Experience all these features with our 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <QrCode className="h-8 w-8 text-green-400" />
                <span className="ml-2 text-xl font-bold">QR Menu Pro</span>
              </div>
              <p className="text-gray-400">
                The complete digital menu solution for Saudi restaurants.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/demo" className="text-gray-400 hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>+966 XX XXX XXXX</li>
                <li>support@qrmenupro.com</li>
                <li>Riyadh, Saudi Arabia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QR Menu Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
