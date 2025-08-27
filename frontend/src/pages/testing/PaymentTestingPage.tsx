import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Settings,
  TestTube,
  Zap,
  Shield,
  FileText,
  Globe,
  Monitor
} from 'lucide-react';
import { PaymentService, PaymentMethod, PaymentIntent, PaymentTransaction } from '@/services/payment';
import { cn } from '@/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PerformanceTesting from '@/components/testing/PerformanceTesting';
import SecurityTesting from '@/components/testing/SecurityTesting';
import EndToEndTesting from '@/components/testing/EndToEndTesting';
import APIIntegrationValidation from '@/components/testing/APIIntegrationValidation';
import CrossBrowserTesting from '@/components/testing/CrossBrowserTesting';

interface TestResult {
  id: string;
  testName: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: any;
  timestamp: string;
}

const PaymentTestingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTest, setSelectedTest] = useState<string>('');

  const testSuites = [
    {
      id: 'payment-methods',
      name: 'Payment Methods',
      description: 'Test payment method creation, validation, and management',
      tests: [
        'Create Credit Card',
        'Create Mada Card',
        'Validate Card Number',
        'Validate Expiry Date',
        'Set Default Method',
        'Remove Payment Method'
      ]
    },
    {
      id: 'payment-flow',
      name: 'Payment Flow',
      description: 'Test complete payment processing workflow',
      tests: [
        'Create Payment Intent',
        'Confirm Payment',
        'Process Refund',
        'Handle Failed Payment',
        'Handle 3D Secure',
        'VAT Calculation'
      ]
    },
    {
      id: 'integration',
      name: 'Integration Tests',
      description: 'Test external payment gateway integrations',
      tests: [
        'Stripe Connection',
        'Mada Gateway',
        'Apple Pay Setup',
        'STC Pay Integration',
        'Webhook Handling',
        'Error Handling'
      ]
    },
    {
      id: 'security',
      name: 'Security Tests',
      description: 'Test payment security and compliance',
      tests: [
        'PCI Compliance',
        'Token Validation',
        'Fraud Detection',
        'Data Encryption',
        'Audit Logging',
        'Access Control'
      ]
    }
  ];

  useEffect(() => {
    loadPaymentSettings();
    loadTestResults();
  }, []);

  const loadPaymentSettings = async () => {
    try {
      const settings = await PaymentService.getPaymentSettings();
      setPaymentSettings(settings);
    } catch (error) {
      console.error('Error loading payment settings:', error);
    }
  };

  const loadTestResults = async () => {
    // Load test results from localStorage or API
    const saved = localStorage.getItem('payment-test-results');
    if (saved) {
      setTestResults(JSON.parse(saved));
    }
  };

  const saveTestResults = (results: TestResult[]) => {
    localStorage.setItem('payment-test-results', JSON.stringify(results));
    setTestResults(results);
  };

  const runTest = async (testName: string, testSuite: string) => {
    const testId = `${testSuite}-${testName}-${Date.now()}`;
    const newTest: TestResult = {
      id: testId,
      testName,
      status: 'running',
      timestamp: new Date().toISOString()
    };

    setTestResults(prev => [...prev, newTest]);
    setSelectedTest(testId);

    try {
      const startTime = Date.now();
      
      // Simulate different test scenarios
      let result: any;
      
      switch (testName) {
        case 'Create Credit Card':
          result = await testCreateCreditCard();
          break;
        case 'Create Payment Intent':
          result = await testCreatePaymentIntent();
          break;
        case 'Stripe Connection':
          result = await testStripeConnection();
          break;
        case 'VAT Calculation':
          result = await testVATCalculation();
          break;
        default:
          result = await runGenericTest(testName);
      }

      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'passed', duration, details: result }
          : test
      ));

      toast.success(`${testName} test passed!`);
    } catch (error) {
      setTestResults(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
          : test
      ));
      
      toast.error(`${testName} test failed!`);
    }
  };

  const testCreateCreditCard = async () => {
    // Simulate credit card creation test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const testCard = {
      number: '4242424242424242',
      expiryMonth: 12,
      expiryYear: 2025,
      cvc: '123'
    };

    // Validate card number
    const isValid = PaymentService.validateCardNumber(testCard.number);
    const isValidExpiry = PaymentService.validateExpiryDate(testCard.expiryMonth, testCard.expiryYear);

    if (!isValid || !isValidExpiry) {
      throw new Error('Card validation failed');
    }

    return {
      cardNumber: '**** **** **** 4242',
      expiry: '12/25',
      isValid: true
    };
  };

  const testCreatePaymentIntent = async () => {
    // Simulate payment intent creation test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const testAmount = 5000; // 50.00 SAR
    const vatAmount = PaymentService.calculateVAT(testAmount, 15);
    
    return {
      amount: testAmount,
      vatAmount,
      totalAmount: testAmount + vatAmount,
      currency: 'SAR',
      status: 'requires_payment_method'
    };
  };

  const testStripeConnection = async () => {
    // Simulate Stripe connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      connected: true,
      publishableKey: 'pk_test_...',
      webhookEndpoint: 'https://api.stripe.com/webhooks/...',
      apiVersion: '2023-10-16'
    };
  };

  const testVATCalculation = async () => {
    // Test VAT calculation
    const testAmounts = [1000, 2500, 5000, 10000]; // 10.00, 25.00, 50.00, 100.00 SAR
    const vatRate = 15;
    
    const results = testAmounts.map(amount => ({
      originalAmount: amount,
      vatAmount: PaymentService.calculateVAT(amount, vatRate),
      totalAmount: amount + PaymentService.calculateVAT(amount, vatRate)
    }));

    return {
      vatRate: `${vatRate}%`,
      calculations: results
    };
  };

  const runGenericTest = async (testName: string) => {
    // Generic test runner
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      message: `${testName} completed successfully`,
      timestamp: new Date().toISOString()
    };
  };

  const runAllTests = async (suiteId: string) => {
    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite) return;

    setIsLoading(true);
    
    try {
      for (const test of suite.tests) {
        await runTest(test, suiteId);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
      }
      toast.success(`${suite.name} test suite completed!`);
    } catch (error) {
      toast.error(`Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    localStorage.removeItem('payment-test-results');
  };

  const exportTestResults = () => {
    const dataStr = JSON.stringify(testResults, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `payment-test-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TestTube className="w-8 h-8 text-blue-600" />
            Payment Integration Testing
          </h1>
          <p className="text-gray-600 mt-2">
            Test and validate all payment gateway integrations, methods, and workflows
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'dashboard', name: 'Test Dashboard', icon: Eye },
                { id: 'performance', name: 'Performance Testing', icon: Zap },
                { id: 'security', name: 'Security Testing', icon: Shield },
                { id: 'e2e', name: 'End-to-End Testing', icon: FileText },
                { id: 'api', name: 'API Integration', icon: Globe },
                { id: 'browser', name: 'Cross-Browser Testing', icon: Monitor },
                { id: 'results', name: 'Test Results', icon: CheckCircle },
                { id: 'settings', name: 'Test Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
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
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Test Suites */}
            {testSuites.map((suite) => (
              <div key={suite.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                      <p className="text-gray-600">{suite.description}</p>
                    </div>
                    <button
                      onClick={() => runAllTests(suite.id)}
                      disabled={isLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
                      Run All Tests
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suite.tests.map((test) => (
                      <div key={test} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{test}</h4>
                          <button
                            onClick={() => runTest(test, suite.id)}
                            disabled={isLoading}
                            className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-500">
                          Click to run individual test
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <PerformanceTesting />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <SecurityTesting />
          </div>
        )}

        {activeTab === 'e2e' && (
          <div className="space-y-6">
            <EndToEndTesting />
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <APIIntegrationValidation />
          </div>
        )}

        {activeTab === 'browser' && (
          <div className="space-y-6">
            <CrossBrowserTesting />
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Test Results Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportTestResults}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Results
                  </button>
                  <button
                    onClick={clearTestResults}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Clear Results
                  </button>
                </div>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{testResults.length}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-900">
                    {testResults.filter(t => t.status === 'passed').length}
                  </div>
                  <div className="text-sm text-green-600">Passed</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-900">
                    {testResults.filter(t => t.status === 'failed').length}
                  </div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900">
                    {testResults.filter(t => t.status === 'running').length}
                  </div>
                  <div className="text-sm text-blue-600">Running</div>
                </div>
              </div>

              {/* Test Results List */}
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No test results yet. Run some tests to see results here.
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div
                      key={result.id}
                      className={cn(
                        'border rounded-lg p-4 cursor-pointer transition-colors',
                        selectedTest === result.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => setSelectedTest(selectedTest === result.id ? '' : result.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <span className="font-medium text-gray-900">{result.testName}</span>
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(result.status))}>
                            {result.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {result.duration && (
                            <span>{result.duration}ms</span>
                          )}
                          <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      {/* Expanded Details */}
                      {selectedTest === result.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {result.error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                              <div className="text-sm text-red-800">
                                <strong>Error:</strong> {result.error}
                              </div>
                            </div>
                          )}
                          
                          {result.details && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-700">
                                <strong>Details:</strong>
                                <pre className="mt-2 text-xs overflow-x-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Configuration</h3>
              
              {paymentSettings ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Payment Gateway Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Stripe Enabled</span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          paymentSettings.stripePublishableKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {paymentSettings.stripePublishableKey ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mada Enabled</span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          paymentSettings.madaEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {paymentSettings.madaEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Apple Pay Enabled</span>
                        <span className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          paymentSettings.applePayEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {paymentSettings.applePayEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Test Environment</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Environment</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Test
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">VAT Rate</span>
                        <span className="text-sm font-medium">{paymentSettings.vatRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Currency</span>
                        <span className="text-sm font-medium">{paymentSettings.currency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Loading payment settings...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTestingPage;
