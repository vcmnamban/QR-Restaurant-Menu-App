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
  Settings
} from 'lucide-react';
import { cn } from '@/utils';

interface E2ETest {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'restaurant' | 'menu' | 'order' | 'payment' | 'customer';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  steps: E2ETestStep[];
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

interface E2ETestStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  details: string;
}

interface E2ETestMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  running: number;
  averageDuration: number;
  successRate: number;
}

const E2ETestSuites: E2ETest[] = [
  {
    id: 'auth-flow',
    name: 'Authentication Flow',
    description: 'Complete user authentication workflow including login, logout, and session management',
    category: 'authentication',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'login', name: 'User Login', status: 'pending', duration: 0, details: 'User enters credentials and logs in successfully' },
      { id: 'session', name: 'Session Validation', status: 'pending', duration: 0, details: 'Verify user session is maintained across page refreshes' },
      { id: 'logout', name: 'User Logout', status: 'pending', duration: 0, details: 'User logs out and session is cleared' }
    ]
  },
  {
    id: 'restaurant-management',
    name: 'Restaurant Management',
    description: 'Complete restaurant CRUD operations workflow',
    category: 'restaurant',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'create', name: 'Create Restaurant', status: 'pending', duration: 0, details: 'Create a new restaurant with all required fields' },
      { id: 'edit', name: 'Edit Restaurant', status: 'pending', duration: 0, details: 'Modify restaurant details and save changes' },
      { id: 'view', name: 'View Restaurant', status: 'pending', duration: 0, details: 'Display restaurant information correctly' },
      { id: 'delete', name: 'Delete Restaurant', status: 'pending', duration: 0, details: 'Remove restaurant and verify cleanup' }
    ]
  },
  {
    id: 'menu-workflow',
    name: 'Menu Management Workflow',
    description: 'Complete menu creation and management process',
    category: 'menu',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'category', name: 'Create Category', status: 'pending', duration: 0, details: 'Create menu category with proper validation' },
      { id: 'item', name: 'Add Menu Item', status: 'pending', duration: 0, details: 'Add item to category with all details' },
      { id: 'reorder', name: 'Reorder Items', status: 'pending', duration: 0, details: 'Change item order and verify persistence' },
      { id: 'publish', name: 'Publish Menu', status: 'pending', duration: 0, details: 'Make menu public and verify customer access' }
    ]
  },
  {
    id: 'order-process',
    name: 'Order Processing Workflow',
    description: 'Complete order lifecycle from creation to delivery',
    category: 'order',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'create', name: 'Create Order', status: 'pending', duration: 0, details: 'Customer creates order with items and delivery info' },
      { id: 'accept', name: 'Accept Order', status: 'pending', duration: 0, details: 'Restaurant accepts and confirms order' },
      { id: 'prepare', name: 'Prepare Order', status: 'pending', duration: 0, details: 'Mark order as being prepared' },
      { id: 'ready', name: 'Mark Ready', status: 'pending', duration: 0, details: 'Mark order as ready for delivery' },
      { id: 'deliver', name: 'Deliver Order', status: 'pending', duration: 0, details: 'Mark order as delivered and complete' }
    ]
  },
  {
    id: 'payment-flow',
    name: 'Payment Processing Flow',
    description: 'Complete payment workflow including validation and confirmation',
    category: 'payment',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'method', name: 'Add Payment Method', status: 'pending', duration: 0, details: 'Add new payment method with validation' },
      { id: 'intent', name: 'Create Payment Intent', status: 'pending', duration: 0, details: 'Initialize payment with amount and currency' },
      { id: 'process', name: 'Process Payment', status: 'pending', duration: 0, details: 'Complete payment transaction' },
      { id: 'confirmation', name: 'Payment Confirmation', status: 'pending', duration: 0, details: 'Verify payment confirmation and receipt' }
    ]
  },
  {
    id: 'customer-experience',
    name: 'Customer Experience Flow',
    description: 'End-to-end customer journey from menu browsing to order completion',
    category: 'customer',
    status: 'pending',
    duration: 0,
    steps: [
      { id: 'browse', name: 'Browse Menu', status: 'pending', duration: 0, details: 'Customer views restaurant menu with categories' },
      { id: 'search', name: 'Search Items', status: 'pending', duration: 0, details: 'Search for specific menu items' },
      { id: 'cart', name: 'Add to Cart', status: 'pending', duration: 0, details: 'Add items to cart and manage quantities' },
      { id: 'checkout', name: 'Checkout Process', status: 'pending', duration: 0, details: 'Complete checkout with payment and delivery' }
    ]
  }
];

const EndToEndTesting: React.FC = () => {
  const [tests, setTests] = useState<E2ETest[]>(E2ETestSuites);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<E2ETest[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tests' | 'results' | 'settings'>('dashboard');

  // Calculate metrics
  const metrics: E2ETestMetrics = React.useMemo(() => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const skipped = tests.filter(t => t.status === 'skipped').length;
    const running = tests.filter(t => t.status === 'running').length;
    const completedTests = tests.filter(t => t.status === 'passed' || t.status === 'failed');
    const averageDuration = completedTests.length > 0 
      ? completedTests.reduce((sum, t) => sum + t.duration, 0) / completedTests.length 
      : 0;
    const successRate = total > 0 ? (passed / total) * 100 : 0;

    return { total, passed, failed, skipped, running, averageDuration, successRate };
  }, [tests]);

  // Simulate test execution
  const runTest = useCallback(async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    // Update test status to running
    setTests(prev => prev.map(t => 
      t.id === testId 
        ? { ...t, status: 'running', startedAt: new Date() }
        : t
    ));

    // Simulate test execution with delays
    for (let i = 0; i < test.steps.length; i++) {
      const step = test.steps[i];
      
      // Update step status to running
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? {
              ...t,
              steps: t.steps.map((s, idx) => 
                idx === i ? { ...s, status: 'running' } : s
              )
            }
          : t
      ));

      // Simulate step execution time (1-3 seconds)
      const stepDuration = Math.random() * 2000 + 1000;
      await new Promise(resolve => setTimeout(resolve, stepDuration));

      // Randomly fail some steps (10% chance)
      const shouldFail = Math.random() < 0.1;
      const stepStatus = shouldFail ? 'failed' : 'passed';
      const stepError = shouldFail ? `Step failed due to simulated error at ${new Date().toLocaleTimeString()}` : undefined;

      // Update step status
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? {
              ...t,
              steps: t.steps.map((s, idx) => 
                idx === i 
                  ? { 
                      ...s, 
                      status: stepStatus, 
                      duration: stepDuration,
                      error: stepError
                    } 
                  : s
              )
            }
          : t
      ));

      // If step failed, fail the entire test
      if (shouldFail) {
        setTests(prev => prev.map(t => 
          t.id === testId 
            ? { 
                ...t, 
                status: 'failed', 
                completedAt: new Date(),
                error: `Test failed at step: ${step.name}`,
                duration: t.steps.reduce((sum, s) => sum + s.duration, 0)
              }
            : t
        ));
        return;
      }
    }

    // All steps passed
    const totalDuration = test.steps.reduce((sum, s) => sum + s.duration, 0);
    setTests(prev => prev.map(t => 
      t.id === testId 
        ? { 
            ...t, 
            status: 'passed', 
            completedAt: new Date(),
            duration: totalDuration
          }
        : t
    ));
  }, [tests]);

  const runSelectedTests = useCallback(async () => {
    if (selectedTests.length === 0) return;
    
    setIsRunning(true);
    
    for (const testId of selectedTests) {
      await runTest(testId);
    }
    
    setIsRunning(false);
  }, [selectedTests, runTest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    for (const test of tests) {
      await runTest(test.id);
    }
    
    setIsRunning(false);
  }, [tests, runTest]);

  const stopTests = useCallback(() => {
    setIsRunning(false);
    setTests(prev => prev.map(t => 
      t.status === 'running' 
        ? { ...t, status: 'pending' }
        : t
    ));
  }, []);

  const resetTests = useCallback(() => {
    setTests(E2ETestSuites);
    setTestResults([]);
    setSelectedTests([]);
  }, []);

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  const exportResults = useCallback(() => {
    const dataStr = JSON.stringify(tests, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `e2e-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [tests]);

  const toggleTestSelection = useCallback((testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      authentication: 'bg-blue-100 text-blue-800',
      restaurant: 'bg-green-100 text-green-800',
      menu: 'bg-purple-100 text-purple-800',
      order: 'bg-orange-100 text-orange-800',
      payment: 'bg-indigo-100 text-indigo-800',
      customer: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">End-to-End Testing</h2>
          <p className="text-gray-600">Simulate complete user workflows and business processes</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runSelectedTests}
            disabled={selectedTests.length === 0 || isRunning}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              selectedTests.length === 0 || isRunning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            Run Selected ({selectedTests.length})
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
            Run All Tests
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
            { id: 'tests', name: 'Test Suites', icon: CheckCircle },
            { id: 'results', name: 'Results', icon: Info },
            { id: 'settings', name: 'Settings', icon: Settings }
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
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Passed</p>
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
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.failed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.successRate.toFixed(1)}%</p>
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
                Run All Tests
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

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {tests
                .filter(t => t.status !== 'pending')
                .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                .slice(0, 5)
                .map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <p className="font-medium text-gray-900">{test.name}</p>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {test.duration > 0 ? `${(test.duration / 1000).toFixed(1)}s` : '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {test.completedAt?.toLocaleTimeString() || test.startedAt?.toLocaleTimeString() || '-'}
                      </p>
                    </div>
                  </div>
                ))}
              {tests.filter(t => t.status !== 'pending').length === 0 && (
                <p className="text-gray-500 text-center py-4">No tests have been run yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Suites Tab */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={() => toggleTestSelection(test.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                      <p className="text-gray-600">{test.description}</p>
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
                      "px-2 py-1 rounded text-xs font-medium",
                      getCategoryColor(test.category)
                    )}>
                      {test.category}
                    </span>
                    {test.duration > 0 && (
                      <span className="text-sm text-gray-500">
                        {(test.duration / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Test Steps */}
              <div className="p-4">
                <div className="space-y-3">
                  {test.steps.map((step, stepIndex) => (
                    <div key={step.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(step.status)}
                        <div>
                          <p className="font-medium text-gray-900">{step.name}</p>
                          <p className="text-sm text-gray-600">{step.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {step.duration > 0 && (
                          <p className="text-sm text-gray-500">
                            {(step.duration / 1000).toFixed(1)}s
                          </p>
                        )}
                        {step.error && (
                          <p className="text-xs text-red-600 max-w-xs truncate" title={step.error}>
                            {step.error}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Test Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => runTest(test.id)}
                      disabled={isRunning || test.status === 'running'}
                      className={cn(
                        "px-3 py-1 rounded text-sm font-medium transition-colors",
                        isRunning || test.status === 'running'
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Run Test
                    </button>
                    {test.status !== 'pending' && (
                      <button
                        onClick={() => {
                          setTests(prev => prev.map(t => 
                            t.id === test.id 
                              ? { ...t, status: 'pending', duration: 0, error: undefined, startedAt: undefined, completedAt: undefined }
                              : t
                          ));
                        }}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset
                      </button>
                    )}
                  </div>
                  {test.error && (
                    <p className="text-sm text-red-600 max-w-md">{test.error}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Detailed Results */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detailed Results</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {tests
                .filter(t => t.status !== 'pending')
                .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
                .map((test) => (
                  <div key={test.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(test.status)
                        )}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </span>
                        {test.duration > 0 && (
                          <span className="text-sm text-gray-500">
                            Duration: {(test.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Step Results */}
                    <div className="space-y-2">
                      {test.steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(step.status)}
                            <span className="text-sm font-medium text-gray-900">{step.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {step.duration > 0 && (
                              <span className="text-xs text-gray-500">
                                {(step.duration / 1000).toFixed(1)}s
                              </span>
                            )}
                            {step.error && (
                              <span className="text-xs text-red-600 max-w-xs truncate" title={step.error}>
                                {step.error}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
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
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-retry Failed Tests
                </label>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Automatically retry failed tests up to 3 times
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parallel Test Execution
                </label>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Run multiple tests simultaneously for faster execution
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  defaultValue="120"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum time allowed for each test to complete
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot on Failure
                </label>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Capture screenshots when tests fail for debugging
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
                Export Test Report (PDF)
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2 inline" />
                Backup Test Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndToEndTesting;
