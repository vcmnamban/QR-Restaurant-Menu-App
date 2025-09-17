import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield,
  Heart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const AboutPage: React.FC = () => {
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
                <Link to="/pricing" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/about" className="text-green-600 px-3 py-2 rounded-md text-sm font-medium">
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
              About
              <span className="text-green-600 block">QR Menu Pro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to digitize Saudi Arabia's restaurant industry, 
              one QR code at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  QR Menu Pro was born from a simple observation: Saudi restaurants were spending 
                  thousands of riyals monthly on printing menus, only to throw them away when 
                  prices changed or items were sold out.
                </p>
                <p>
                  As technology enthusiasts and restaurant industry veterans, we saw an opportunity 
                  to create a solution that would not only save money but also enhance the 
                  customer experience and streamline operations.
                </p>
                <p>
                  Today, we're proud to serve over 500 restaurants across Saudi Arabia, helping 
                  them embrace digital transformation while maintaining the warmth and hospitality 
                  that makes Saudi dining special.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="text-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Founded in 2024</h3>
                <p className="text-gray-600">Born in Saudi Arabia, for Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower Saudi restaurants with cutting-edge digital solutions that reduce costs, 
                enhance customer experience, and drive business growth while respecting local culture 
                and business practices.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To become the leading digital transformation partner for restaurants across the 
                Middle East, making technology accessible, affordable, and culturally appropriate 
                for every dining establishment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for our customers and their success.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliability</h3>
              <p className="text-gray-600">
                We build robust, dependable solutions that restaurants can count on every day.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in everything we do, from product design to customer service.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cultural Respect</h3>
              <p className="text-gray-600">
                We deeply respect Saudi culture and traditions in all our solutions and interactions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We believe in building a strong community of restaurant owners supporting each other.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to bring the latest technology to Saudi restaurants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind QR Menu Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">V</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vaseem</h3>
              <p className="text-green-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Technology entrepreneur with 10+ years in restaurant industry. 
                Passionate about digital transformation in Saudi Arabia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">A</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ahmed Al-Rashid</h3>
              <p className="text-blue-600 font-medium mb-2">CTO</p>
              <p className="text-gray-600 text-sm">
                Full-stack developer specializing in scalable web applications. 
                Expert in Arabic localization and RTL support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">S</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Mohammed</h3>
              <p className="text-purple-600 font-medium mb-2">Head of Customer Success</p>
              <p className="text-gray-600 text-sm">
                Customer experience expert with deep understanding of Saudi restaurant 
                operations and cultural nuances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Saudi Arabia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why We Chose Saudi Arabia
            </h2>
            <p className="text-xl text-gray-600">
              Our deep connection to the Saudi market drives our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Local Expertise</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Cultural Understanding</h4>
                    <p className="text-gray-600">We understand Saudi dining culture, family traditions, and business practices.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Language Support</h4>
                    <p className="text-gray-600">Native Arabic speakers ensuring perfect localization and RTL support.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Regulatory Compliance</h4>
                    <p className="text-gray-600">Full compliance with Saudi VAT, data protection, and business regulations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Market Opportunity</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Digital Transformation</h4>
                    <p className="text-gray-600">Saudi Vision 2030 is driving rapid digital adoption across all industries.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Growing Restaurant Scene</h4>
                    <p className="text-gray-600">Thriving food culture with increasing demand for modern dining experiences.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Technology Adoption</h4>
                    <p className="text-gray-600">High smartphone penetration and tech-savvy population ready for digital solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-green-100">
              Numbers that speak to our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <p className="text-green-100">Restaurants Served</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <p className="text-green-100">Orders Processed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">SAR 2M+</div>
              <p className="text-green-100">Cost Savings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <p className="text-green-100">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Success Story
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the digital transformation revolution in Saudi Arabia's restaurant industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact" 
              className="border border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center"
            >
              Get in Touch
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

export default AboutPage;
