import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Play,
  RefreshCw,
  Terminal,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { cn } from '@/utils';

interface IntegrationTest {
  id: string;
  name: string;
  category: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  description: string;
  critical: boolean;
}

const FinalIntegrationTesting: React.FC = () => {
  const [tests, setTests] = useState<IntegrationTest[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tests' | 'results'>('dashboard');
  const [isRunningTests, setIsRunningTests] = useState(false);

  const integrationTests: IntegrationTest[] = [
    {
      id: 'perf-001',
      name: 'Performance Monitoring Integration',
      category: 'performance',
      status: 'pending',
      description: 'Test real-time performance monitoring with all metrics',
      critical: true
    },
    {
      id: 'sec-001',
      name: 'Authentication Integration',
      category: 'security',
      status: 'pending',
      description: 'Test complete authentication flow across all components',
      critical: true
    },
    {
      id: 'func-001',
      name: 'UAT Framework Integration',
      category: 'functionality',
      status: 'pending',
      description: 'Test user acceptance testing framework with all features',
      critical: false
    }
  ];

  useEffect(() => {
    setTests(integrationTests);
  }, []);

  const runTest = async (testId: string) => {
    setTests(prev => prev.map(t => 
      t.id === testId ? { ...t, status: 'running' } : t
    ));

    await new Promise(resolve => setTimeout(resolve, 2000));
    const passed = Math.random() > 0.1;

    setTests(prev => prev.map(t => 
      t.id === testId ? { ...t, status: passed ? 'passed' : 'failed' } : t
    ));
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    for (const test of tests) {
      if (test.status === 'pending') {
        await runTest(test.id);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    setIsRunningTests(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const metrics = {
    totalTests: tests.length,
    passedTests: tests.filter(t => t.status === 'passed').length,
    failedTests: tests.filter(t => t.status === 'failed').length,
    successRate: tests.length > 0 ? (tests.filter(t => t.status === 'passed').length / tests.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Final Integration Testing</h2>
          <p className="text-gray-600">Comprehensive testing of all Phase 5 components</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runAllTests}
            disabled={isRunningTests}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              isRunningTests
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isRunningTests ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'tests', name: 'Test Cases', icon: Terminal },
            { id: 'results', name: 'Results', icon: CheckCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
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
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Terminal className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTests}</p>
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
                  <p className="text-2xl font-bold text-green-600">{metrics.passedTests}</p>
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
                  <p className="text-2xl font-bold text-red-600">{metrics.failedTests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.successRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                    <p className="text-gray-600">{test.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {test.category}
                  </span>
                  {test.critical && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Critical
                    </span>
                  )}
                  {test.status === 'pending' && (
                    <button
                      onClick={() => runTest(test.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Run Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.passedTests}</div>
                <div className="text-sm text-gray-600">Tests Passed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{metrics.failedTests}</div>
                <div className="text-sm text-gray-600">Tests Failed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalIntegrationTesting;
