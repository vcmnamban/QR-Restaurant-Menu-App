import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  CheckCircle, 
  ArrowRight,
  Star,
  X,
  HelpCircle
} from 'lucide-react';

const PricingPage: React.FC = () => {
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
                <Link to="/features" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </Link>
                <Link to="/pricing" className="text-green-600 px-3 py-2 rounded-md text-sm font-medium">
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
              Simple, Transparent
              <span className="text-green-600 block">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose the plan that fits your restaurant size. All plans include 14-day free trial.
            </p>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className="text-sm text-gray-600">Monthly</span>
              <div className="relative">
                <div className="w-12 h-6 bg-green-600 rounded-full"></div>
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600">Annual <span className="text-green-600 font-semibold">(Save 20%)</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <p className="text-gray-600 mb-4">Perfect for small cafes and restaurants</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">SAR 199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">or SAR 1,590/year (save 20%)</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Up to 20 tables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Unlimited menu items</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">QR code generation</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Basic branding (logo + colors)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Social media links</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Takeout ordering</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Arabic & English support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">VAT compliance</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Email support</span>
                </li>
              </ul>
              
              <Link 
                to="/register" 
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Standard Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-green-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
                <p className="text-gray-600 mb-4">Best for growing restaurants</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">SAR 499</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">or SAR 3,990/year (save 20%)</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Up to 50 tables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">All Basic features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Product periods (Breakfast/Lunch/Dinner)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Waiting list management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Featured items display</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">In-house ordering</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">WhatsApp order sharing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Customer reviews & Google Maps QR</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Sales reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Priority support</span>
                </li>
              </ul>
              
              <Link 
                to="/register" 
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-gray-600 mb-4">For large restaurants and chains</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">SAR 749</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">or SAR 5,990/year (save 20%)</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Unlimited tables</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">All Standard features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Advanced table reservations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Home delivery ordering with zone-based pricing</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Private domain option</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Advertising bar for special offers</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Full payment methods (Apple Pay, Mada)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Advanced analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">Dedicated account manager</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-600">24/7 phone support</span>
                </li>
              </ul>
              
              <Link 
                to="/register" 
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-xl text-gray-600">
              Compare all features across our pricing plans
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Basic</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Standard</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Tables</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 20</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Up to 50</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Menu Items</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">QR Code Generation</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Arabic & English Support</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">VAT Compliance</td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">In-house Ordering</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">WhatsApp Integration</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Sales Reports</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Home Delivery System</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Advanced Analytics</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Dedicated Support</td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckCircle className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-xl text-gray-600">
              See how much you can save by going digital
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Monthly Savings with QR Menu Pro</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <span className="font-medium text-gray-900">Printing Costs</span>
                    <span className="text-green-600 font-semibold">-SAR 800</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <span className="font-medium text-gray-900">Menu Update Time</span>
                    <span className="text-green-600 font-semibold">-SAR 400</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <span className="font-medium text-gray-900">Order Accuracy</span>
                    <span className="text-green-600 font-semibold">+SAR 300</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg border-2 border-green-500">
                    <span className="font-bold text-gray-900">Total Monthly Savings</span>
                    <span className="text-green-600 font-bold text-xl">SAR 1,500</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ROI Calculator</h3>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-4xl font-bold text-green-600 mb-2">300%</div>
                  <p className="text-gray-600 mb-4">Return on Investment</p>
                  <p className="text-sm text-gray-500">
                    Most restaurants see 300% ROI within the first 3 months
                  </p>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-2">Payback Period</p>
                  <div className="text-2xl font-bold text-gray-900">2.5 months</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All plans include a 14-day free trial with no credit card required. You can test all features before committing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, Mada cards, and bank transfers. All payments are processed securely through our payment partners.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600">
                No setup fees! We believe in transparent pricing. You only pay the monthly subscription fee, and we'll help you get started for free.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my table limit?</h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limit. You can upgrade your plan anytime, or we can work out a custom solution for your needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer discounts for annual payments?</h3>
              <p className="text-gray-600">
                Yes! Save 20% when you pay annually. This applies to all plans and is automatically applied at checkout.
              </p>
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
            Join 500+ restaurants already using QR Menu Pro. Start your free trial today.
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
          <p className="text-green-100 text-sm mt-4">
            No credit card required • Setup in 5 minutes • Cancel anytime
          </p>
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

export default PricingPage;
