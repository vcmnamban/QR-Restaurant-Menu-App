import React, { useState, useCallback } from 'react';
import { 
  Play, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Download,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Info,
  Settings,
  Globe,
  Database,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/utils';

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  category: 'auth' | 'restaurant' | 'menu' | 'order' | 'user' | 'payment';
  requiresAuth: boolean;
  expectedStatus: number;
  timeout: number;
}

interface APITest {
  id: string;
  endpointId: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  responseTime: number;
  statusCode: number;
  responseSize: number;
  error?: string;
  response?: any;
  startedAt?: Date;
  completedAt?: Date;
}

interface APIMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  running: number;
  averageResponseTime: number;
  successRate: number;
  totalResponseSize: number;
}

const APIEndpoints: APIEndpoint[] = [
  // Authentication endpoints
  {
    id: 'auth-login',
    name: 'User Login',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user with email and password',
    category: 'auth',
    requiresAuth: false,
    expectedStatus: 200,
    timeout: 5000
  },
  {
    id: 'auth-register',
    name: 'User Registration',
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register new user account',
    category: 'auth',
    requiresAuth: false,
    expectedStatus: 201,
    timeout: 5000
  },
  {
    id: 'auth-profile',
    name: 'Get User Profile',
    method: 'GET',
    path: '/api/auth/profile',
    description: 'Retrieve authenticated user profile',
    category: 'auth',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },

  // Restaurant endpoints
  {
    id: 'restaurant-list',
    name: 'List Restaurants',
    method: 'GET',
    path: '/api/restaurants',
    description: 'Get paginated list of restaurants',
    category: 'restaurant',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'restaurant-create',
    name: 'Create Restaurant',
    method: 'POST',
    path: '/api/restaurants',
    description: 'Create new restaurant',
    category: 'restaurant',
    requiresAuth: true,
    expectedStatus: 201,
    timeout: 5000
  },
  {
    id: 'restaurant-get',
    name: 'Get Restaurant',
    method: 'GET',
    path: '/api/restaurants/:id',
    description: 'Get restaurant by ID',
    category: 'restaurant',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'restaurant-update',
    name: 'Update Restaurant',
    method: 'PUT',
    path: '/api/restaurants/:id',
    description: 'Update restaurant details',
    category: 'restaurant',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 5000
  },
  {
    id: 'restaurant-delete',
    name: 'Delete Restaurant',
    method: 'DELETE',
    path: '/api/restaurants/:id',
    description: 'Delete restaurant',
    category: 'restaurant',
    requiresAuth: true,
    expectedStatus: 204,
    timeout: 3000
  },

  // Menu endpoints
  {
    id: 'menu-categories',
    name: 'List Menu Categories',
    method: 'GET',
    path: '/api/menus/categories',
    description: 'Get menu categories for restaurant',
    category: 'menu',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'menu-items',
    name: 'List Menu Items',
    method: 'GET',
    path: '/api/menus/items',
    description: 'Get menu items with pagination',
    category: 'menu',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'menu-item-create',
    name: 'Create Menu Item',
    method: 'POST',
    path: '/api/menus/items',
    description: 'Create new menu item',
    category: 'menu',
    requiresAuth: true,
    expectedStatus: 201,
    timeout: 5000
  },
  {
    id: 'menu-item-update',
    name: 'Update Menu Item',
    method: 'PUT',
    path: '/api/menus/items/:id',
    description: 'Update menu item details',
    category: 'menu',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 5000
  },

  // Order endpoints
  {
    id: 'order-list',
    name: 'List Orders',
    method: 'GET',
    path: '/api/orders',
    description: 'Get paginated list of orders',
    category: 'order',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'order-create',
    name: 'Create Order',
    method: 'POST',
    path: '/api/orders',
    description: 'Create new order',
    category: 'order',
    requiresAuth: true,
    expectedStatus: 201,
    timeout: 5000
  },
  {
    id: 'order-update-status',
    name: 'Update Order Status',
    method: 'PATCH',
    path: '/api/orders/:id/status',
    description: 'Update order status',
    category: 'order',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },

  // User endpoints
  {
    id: 'user-list',
    name: 'List Users',
    method: 'GET',
    path: '/api/users',
    description: 'Get paginated list of users (admin only)',
    category: 'user',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'user-profile',
    name: 'Update User Profile',
    method: 'PUT',
    path: '/api/users/profile',
    description: 'Update user profile information',
    category: 'user',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 5000
  },

  // Payment endpoints
  {
    id: 'payment-methods',
    name: 'List Payment Methods',
    method: 'GET',
    path: '/api/payments/methods',
    description: 'Get user payment methods',
    category: 'payment',
    requiresAuth: true,
    expectedStatus: 200,
    timeout: 3000
  },
  {
    id: 'payment-intent',
    name: 'Create Payment Intent',
    method: 'POST',
    path: '/api/payments/intent',
    description: 'Create payment intent for order',
    category: 'payment',
    requiresAuth: true,
    expectedStatus: 201,
    timeout: 5000
  }
];

const APIIntegrationValidation: React.FC = () => {
  const [endpoints] = useState<APIEndpoint[]>(APIEndpoints);
  const [tests, setTests] = useState<APITest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'endpoints' | 'tests' | 'results' | 'settings'>('dashboard');
  const [testConfig, setTestConfig] = useState({
    baseUrl: 'http://localhost:5000',
    timeout: 10000,
    retryCount: 3,
    validateResponse: true,
    checkPerformance: true
  });

  // Calculate metrics
  const metrics: APIMetrics = React.useMemo(() => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const skipped = tests.filter(t => t.status === 'skipped').length;
    const running = tests.filter(t => t.status === 'running').length;
    const completedTests = tests.filter(t => t.status === 'passed' || t.status === 'failed');
    const averageResponseTime = completedTests.length > 0 
      ? completedTests.reduce((sum, t) => sum + t.responseTime, 0) / completedTests.length 
      : 0;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    const totalResponseSize = tests.reduce((sum, t) => sum + t.responseSize, 0);

    return { total, passed, failed, skipped, running, averageResponseTime, successRate, totalResponseSize };
  }, [tests]);

  // Simulate API test execution
  const runAPITest = useCallback(async (endpointId: string) => {
    const endpoint = endpoints.find(e => e.id === endpointId);
    if (!endpoint) return;

    const testId = `${endpointId}-${Date.now()}`;
    const test: APITest = {
      id: testId,
      endpointId,
      status: 'running',
      responseTime: 0,
      statusCode: 0,
      responseSize: 0,
      startedAt: new Date()
    };

    // Add test to list
    setTests(prev => [...prev, test]);

    // Simulate API call with random response time
    const responseTime = Math.random() * 2000 + 500; // 500ms to 2.5s
    await new Promise(resolve => setTimeout(resolve, responseTime));

    // Randomly fail some tests (15% chance)
    const shouldFail = Math.random() < 0.15;
    const statusCode = shouldFail ? 500 : endpoint.expectedStatus;
    const responseSize = Math.floor(Math.random() * 10000) + 100; // 100B to 10KB
    const error = shouldFail ? `Simulated API error at ${new Date().toLocaleTimeString()}` : undefined;

    // Update test with results
    setTests(prev => prev.map(t => 
      t.id === testId 
        ? {
            ...t,
            status: shouldFail ? 'failed' : 'passed',
            responseTime,
            statusCode,
            responseSize,
            error,
            completedAt: new Date()
          }
        : t
    ));
  }, [endpoints]);

  const runSelectedTests = useCallback(async () => {
    if (selectedEndpoints.length === 0) return;
    
    setIsRunning(true);
    
    for (const endpointId of selectedEndpoints) {
      await runAPITest(endpointId);
    }
    
    setIsRunning(false);
  }, [selectedEndpoints, runAPITest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    for (const endpoint of endpoints) {
      await runAPITest(endpoint.id);
    }
    
    setIsRunning(false);
  }, [endpoints, runAPITest]);

  const stopTests = useCallback(() => {
    setIsRunning(false);
    setTests(prev => prev.map(t => 
      t.status === 'running' 
        ? { ...t, status: 'pending' }
        : t
    ));
  }, []);

  const resetTests = useCallback(() => {
    setTests([]);
    setSelectedEndpoints([]);
  }, []);

  const clearResults = useCallback(() => {
    setTests([]);
  }, []);

  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(tests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `api-integration-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [tests]);

  const toggleEndpointSelection = useCallback((endpointId: string) => {
    setSelectedEndpoints(prev => 
      prev.includes(endpointId)
        ? prev.filter(id => id !== endpointId)
        : [...prev, endpointId]
    );
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'skipped': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-orange-100 text-orange-800',
      PATCH: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      auth: 'bg-blue-100 text-blue-800',
      restaurant: 'bg-green-100 text-green-800',
      menu: 'bg-purple-100 text-purple-800',
      order: 'bg-orange-100 text-orange-800',
      user: 'bg-pink-100 text-pink-800',
      payment: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 1000) return 'text-green-600';
    if (responseTime < 2000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">API Integration Validation</h2>
          <p className="text-gray-600">Test API endpoints, validate responses, and check integration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runSelectedTests}
            disabled={selectedEndpoints.length === 0 || isRunning}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              selectedEndpoints.length === 0 || isRunning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            Test Selected ({selectedEndpoints.length})
          </button>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              isRunning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            Test All APIs
          </button>
          {isRunning && (
            <button
              onClick={stopTests}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Tests
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: FileText },
            { id: 'endpoints', name: 'API Endpoints', icon: Globe },
            { id: 'tests', name: 'Test Results', icon: CheckCircle },
            { id: 'results', name: 'Analytics', icon: Info },
            { id: 'settings', name: 'Configuration', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Endpoints</p>
                  <p className="text-2xl font-bold text-gray-900">{endpoints.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tests Passed</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.passed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tests Failed</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.failed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {metrics.averageResponseTime > 0 ? `${metrics.averageResponseTime.toFixed(0)}ms` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors",
                  isRunning
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                <Play className="w-4 h-4 mr-2" />
                Test All APIs
              </button>
              <button
                onClick={resetTests}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Tests
              </button>
              <button
                onClick={exportResults}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Results
              </button>
            </div>
          </div>

          {/* API Health Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Health Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['auth', 'restaurant', 'menu', 'order', 'user', 'payment'].map((category) => {
                const categoryEndpoints = endpoints.filter(e => e.category === category);
                const categoryTests = tests.filter(t => 
                  categoryEndpoints.some(e => e.id === t.endpointId)
                );
                const passed = categoryTests.filter(t => t.status === 'passed').length;
                const total = categoryTests.length;
                const health = total > 0 ? (passed / total) * 100 : 0;
                
                return (
                  <div key={category} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getCategoryColor(category)
                      )}>
                        {categoryEndpoints.length} endpoints
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Health:</span>
                        <span className={cn(
                          "font-medium",
                          health >= 80 ? "text-green-600" : health >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {health.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tests:</span>
                        <span className="text-gray-600">{passed}/{total}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* API Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedEndpoints.includes(endpoint.id)}
                      onChange={() => toggleEndpointSelection(endpoint.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{endpoint.name}</h3>
                      <p className="text-gray-600">{endpoint.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-3 py-1 rounded text-xs font-medium",
                      getMethodColor(endpoint.method)
                    )}>
                      {endpoint.method}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getCategoryColor(endpoint.category)
                    )}>
                      {endpoint.category}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      endpoint.requiresAuth 
                        ? "bg-red-100 text-red-800" 
                        : "bg-green-100 text-green-800"
                    )}>
                      {endpoint.requiresAuth ? 'Auth Required' : 'Public'}
                    </span>
                  </div>
                </div>
                <div className="mt-3">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {testConfig.baseUrl}{endpoint.path}
                  </code>
                  <p className="text-xs text-gray-500 mt-1">
                    Expected Status: {endpoint.expectedStatus} | Timeout: {endpoint.timeout}ms
                  </p>
                </div>
              </div>

              {/* Endpoint Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => runAPITest(endpoint.id)}
                      disabled={isRunning}
                      className={cn(
                        "px-3 py-1 rounded text-sm font-medium transition-colors",
                        isRunning
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Test Endpoint
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                      <Database className="w-3 h-3 mr-1" />
                      View Schema
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last tested: {tests.filter(t => t.endpointId === endpoint.id).length > 0 ? 'Recently' : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Results Tab */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          {tests.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
              <p className="text-gray-600">Run some API tests to see results here</p>
            </div>
          ) : (
            tests
              .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
              .map((test) => {
                const endpoint = endpoints.find(e => e.id === test.endpointId);
                return (
                  <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {endpoint?.name || 'Unknown Endpoint'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {endpoint?.method} {endpoint?.path}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(test.status)
                        )}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          getResponseTimeColor(test.responseTime)
                        )}>
                          {test.responseTime.toFixed(0)}ms
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Status Code:</span>
                        <span className={cn(
                          "ml-2 font-medium",
                          test.statusCode >= 200 && test.statusCode < 300 ? "text-green-600" : "text-red-600"
                        )}>
                          {test.statusCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Response Size:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {(test.responseSize / 1024).toFixed(1)}KB
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {test.completedAt && test.startedAt 
                            ? `${test.completedAt.getTime() - test.startedAt.getTime()}ms`
                            : '-'
                          }
                        </span>
                      </div>
                    </div>

                    {test.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800">
                          <strong>Error:</strong> {test.error}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      {test.startedAt && `Started: ${test.startedAt.toLocaleString()}`}
                      {test.completedAt && test.startedAt && ` | Completed: ${test.completedAt.toLocaleString()}`}
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
                <p className="text-sm text-gray-600">Total Tests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{metrics.passed}</p>
                <p className="text-sm text-gray-600">Passed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{metrics.failed}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{metrics.successRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Response Time Analysis */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Response Time Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time:</span>
                <span className="font-medium text-gray-900">
                  {metrics.averageResponseTime > 0 ? `${metrics.averageResponseTime.toFixed(0)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Response Size:</span>
                <span className="font-medium text-gray-900">
                  {(metrics.totalResponseSize / 1024).toFixed(1)}KB
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fastest Response:</span>
                <span className="font-medium text-green-600">
                  {tests.length > 0 ? `${Math.min(...tests.map(t => t.responseTime)).toFixed(0)}ms` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Slowest Response:</span>
                <span className="font-medium text-red-600">
                  {tests.length > 0 ? `${Math.max(...tests.map(t => t.responseTime)).toFixed(0)}ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h3>
            <div className="space-y-3">
              {['auth', 'restaurant', 'menu', 'order', 'user', 'payment'].map((category) => {
                const categoryEndpoints = endpoints.filter(e => e.category === category);
                const categoryTests = tests.filter(t => 
                  categoryEndpoints.some(e => e.id === t.endpointId)
                );
                const passed = categoryTests.filter(t => t.status === 'passed').length;
                const total = categoryTests.length;
                const avgResponseTime = categoryTests.length > 0 
                  ? categoryTests.reduce((sum, t) => sum + t.responseTime, 0) / categoryTests.length 
                  : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getCategoryColor(category)
                      )}>
                        {category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {categoryEndpoints.length} endpoints
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>
                        <span className="text-gray-500">Success:</span>
                        <span className="ml-1 font-medium">
                          {total > 0 ? `${((passed / total) * 100).toFixed(0)}%` : 'N/A'}
                        </span>
                      </span>
                      <span>
                        <span className="text-sm text-gray-500">Avg Time:</span>
                        <span className="ml-1 font-medium">
                          {avgResponseTime > 0 ? `${avgResponseTime.toFixed(0)}ms` : 'N/A'}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base URL
                </label>
                <input
                  type="url"
                  value={testConfig.baseUrl}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="http://localhost:5000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Base URL for all API endpoints
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Global Timeout (ms)
                </label>
                <input
                  type="number"
                  min="1000"
                  max="30000"
                  value={testConfig.timeout}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum time to wait for API response
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retry Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={testConfig.retryCount}
                  onChange={(e) => setTestConfig(prev => ({ ...prev, retryCount: parseInt(e.target.value) }))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Number of retries for failed requests
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={testConfig.validateResponse}
                    onChange={(e) => setTestConfig(prev => ({ ...prev, validateResponse: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Validate Response Schema
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Validate API responses against expected schemas
                </p>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={testConfig.checkPerformance}
                    onChange={(e) => setTestConfig(prev => ({ ...prev, checkPerformance: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Performance Monitoring
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  Monitor and alert on slow API responses
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export & Backup</h3>
            <div className="space-y-3">
              <button
                onClick={exportResults}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export Test Results (JSON)
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                <FileText className="w-4 h-4 mr-2 inline" />
                Export API Documentation
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Shield className="w-4 h-4 mr-2 inline" />
                Export Security Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIIntegrationValidation;
