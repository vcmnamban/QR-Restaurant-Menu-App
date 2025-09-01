import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Zap, 
  Play, 
  Square, 
  BarChart3, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PerformanceTest {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  duration: number;
  responseTime: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string;
  timestamp: string;
}

interface PerformanceMetrics {
  totalTests: number;
  averageResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
  successRate: number;
  totalDuration: number;
}

const PerformanceTesting: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<PerformanceTest[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalTests: 0,
    averageResponseTime: 0,
    fastestResponse: 0,
    slowestResponse: 0,
    successRate: 0,
    totalDuration: 0
  });
  const [concurrentUsers, setConcurrentUsers] = useState(10);
  const [testDuration, setTestDuration] = useState(60); // seconds
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/restaurants');

  const testEndpoints = [
    { path: '/api/restaurants', method: 'GET', name: 'Get Restaurants' },
    { path: '/api/menus', method: 'GET', name: 'Get Menus' },
    { path: '/api/orders', method: 'GET', name: 'Get Orders' },
    { path: '/api/users/profile', method: 'GET', name: 'Get User Profile' },
    { path: '/api/restaurants', method: 'POST', name: 'Create Restaurant' },
    { path: '/api/menus', method: 'POST', name: 'Create Menu' },
    { path: '/api/orders', method: 'POST', name: 'Create Order' },
  ];

  useEffect(() => {
    calculateMetrics();
  }, [tests]);

  const calculateMetrics = () => {
    if (tests.length === 0) return;

    const completedTests = tests.filter(t => t.status === 'completed');
    const failedTests = tests.filter(t => t.status === 'failed');
    
    const responseTimes = completedTests.map(t => t.responseTime);
    const totalTime = completedTests.reduce((sum, t) => sum + t.duration, 0);
    
    setMetrics({
      totalTests: tests.length,
      averageResponseTime: responseTimes.length > 0 ? 
        Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) : 0,
      fastestResponse: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      slowestResponse: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      successRate: tests.length > 0 ? Math.round((completedTests.length / tests.length) * 100) : 0,
      totalDuration: totalTime
    });
  };

  const runSingleTest = async (endpoint: string, method: string, name: string) => {
    const testId = `${endpoint}-${method}-${Date.now()}`;
    const newTest: PerformanceTest = {
      id: testId,
      name,
      endpoint,
      method: method as any,
      duration: 0,
      responseTime: 0,
      status: 'running',
      timestamp: new Date().toISOString()
    };

    setTests(prev => [...prev, newTest]);

    try {
      const startTime = Date.now();
      
      // Simulate API call with random response time
      const responseTime = Math.random() * 2000 + 500; // 500ms to 2.5s
      await new Promise(resolve => setTimeout(resolve, responseTime));
      
      const duration = Date.now() - startTime;
      
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'completed', responseTime, duration }
          : test
      ));

      toast.success(`${name} test completed in ${responseTime}ms`);
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'failed', error: error instanceof Error ? error.message : 'Unknown error' }
          : test
      ));
      
      toast.error(`${name} test failed!`);
    }
  };

  const runLoadTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      // Run multiple concurrent tests
      const promises = [];
      
      for (let i = 0; i < concurrentUsers; i++) {
        const delay = Math.random() * 1000; // Random delay up to 1s
        
        promises.push(
          new Promise<void>(async (resolve) => {
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Run test for selected endpoint
            const endpoint = testEndpoints.find(e => e.path === selectedEndpoint);
            if (endpoint) {
              await runSingleTest(endpoint.path, endpoint.method, endpoint.name);
            }
            
            resolve();
          })
        );
      }
      
      await Promise.all(promises);
      
      const totalDuration = Date.now() - startTime;
      toast.success(`Load test completed in ${totalDuration}ms with ${concurrentUsers} concurrent users`);
      
    } catch (error) {
      toast.error(`Load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runStressTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      // Gradually increase load
      for (let i = 1; i <= 5; i++) {
        const currentUsers = i * 5; // 5, 10, 15, 20, 25 users
        
        toast.info(`Stress test phase ${i}: ${currentUsers} concurrent users`);
        
        const promises = [];
        for (let j = 0; j < currentUsers; j++) {
          const delay = Math.random() * 500;
          
          promises.push(
            new Promise<void>(async (resolve) => {
              await new Promise(resolve => setTimeout(resolve, delay));
              
              const endpoint = testEndpoints.find(e => e.path === selectedEndpoint);
              if (endpoint) {
                await runSingleTest(endpoint.path, endpoint.method, endpoint.name);
              }
              
              resolve();
            })
          );
        }
        
        await Promise.all(promises);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between phases
      }
      
      const totalDuration = Date.now() - startTime;
      toast.success(`Stress test completed in ${totalDuration}ms`);
      
    } catch (error) {
      toast.error(`Stress test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const stopTests = () => {
    setIsRunning(false);
    setTests(prev => prev.map(test => 
      test.status === 'running' ? { ...test, status: 'pending' } : test
    ));
    toast.info('Tests stopped');
  };

  const clearTests = () => {
    setTests([]);
    setMetrics({
      totalTests: 0,
      averageResponseTime: 0,
      fastestResponse: 0,
      slowestResponse: 0,
      successRate: 0,
      totalDuration: 0
    });
  };

  const exportResults = () => {
    const dataStr = JSON.stringify({ tests, metrics }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `performance-test-results-${new Date().toISOString().split('T')[0]}.json`;
    
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
        return <LoadingSpinner size="sm" />;
      case 'completed':
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Performance Test Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Endpoint
            </label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {testEndpoints.map((endpoint) => (
                <option key={endpoint.path} value={endpoint.path}>
                  {endpoint.method} {endpoint.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Concurrent Users
            </label>
            <input
              type="number"
              value={concurrentUsers}
              onChange={(e) => setConcurrentUsers(Number(e.target.value))}
              min="1"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Duration (seconds)
            </label>
            <input
              type="number"
              value={testDuration}
              onChange={(e) => setTestDuration(Number(e.target.value))}
              min="10"
              max="300"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={runLoadTest}
            disabled={isRunning}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? <LoadingSpinner size="sm" /> : <Play className="w-4 h-4" />}
            Run Load Test
          </button>
          
          <button
            onClick={runStressTest}
            disabled={isRunning}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? <LoadingSpinner size="sm" /> : <TrendingUp className="w-4 h-4" />}
            Run Stress Test
          </button>
          
          <button
            onClick={stopTests}
            disabled={!isRunning}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop Tests
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Performance Metrics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{metrics.totalTests}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{metrics.averageResponseTime}ms</div>
            <div className="text-sm text-blue-600">Avg Response</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-900">{metrics.fastestResponse}ms</div>
            <div className="text-sm text-green-600">Fastest</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-900">{metrics.slowestResponse}ms</div>
            <div className="text-sm text-orange-600">Slowest</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-900">{metrics.successRate}%</div>
            <div className="text-sm text-purple-600">Success Rate</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-900">{metrics.totalDuration}ms</div>
            <div className="text-sm text-indigo-600">Total Duration</div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Test Results
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={exportResults}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Export Results
            </button>
            
            <button
              onClick={clearTests}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Clear Results
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {tests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No test results yet. Run some tests to see results here.
            </div>
          ) : (
            tests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <span className="font-medium text-gray-900">{test.name}</span>
                      <div className="text-sm text-gray-500">
                        {test.method} {test.endpoint}
                      </div>
                    </div>
                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(test.status))}>
                      {test.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {test.responseTime > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.responseTime}ms
                      </span>
                    )}
                    {test.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {test.duration}ms
                      </span>
                    )}
                    <span>{new Date(test.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                
                {test.error && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-red-600">
                      <strong>Error:</strong> {test.error}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTesting;
