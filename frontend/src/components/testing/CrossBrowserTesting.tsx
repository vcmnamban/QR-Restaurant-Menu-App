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
  Monitor,
  Smartphone,
  Tablet,
  Globe
} from 'lucide-react';
import { cn } from '@/utils';

interface BrowserTest {
  id: string;
  browser: string;
  version: string;
  platform: 'desktop' | 'mobile' | 'tablet';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  features: BrowserFeature[];
  startedAt?: Date;
  completedAt?: Date;
}

interface BrowserFeature {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  details: string;
  error?: string;
}

interface BrowserMetrics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  running: number;
  compatibility: number;
}

const Browsers = [
  { name: 'Chrome', version: '120+', platform: 'desktop' as const },
  { name: 'Firefox', version: '115+', platform: 'desktop' as const },
  { name: 'Safari', version: '17+', platform: 'desktop' as const },
  { name: 'Edge', version: '120+', platform: 'desktop' as const },
  { name: 'Chrome Mobile', version: '120+', platform: 'mobile' as const },
  { name: 'Safari Mobile', version: '17+', platform: 'mobile' as const },
  { name: 'Samsung Internet', version: '23+', platform: 'mobile' as const },
  { name: 'Chrome Tablet', version: '120+', platform: 'tablet' as const },
  { name: 'Safari Tablet', version: '17+', platform: 'tablet' as const }
];

const Features = [
  { id: 'responsive', name: 'Responsive Design', details: 'Layout adapts to different screen sizes' },
  { id: 'css-grid', name: 'CSS Grid', details: 'Modern CSS layout system support' },
  { id: 'flexbox', name: 'Flexbox', details: 'CSS flexbox layout support' },
  { id: 'es6', name: 'ES6+ Features', details: 'Modern JavaScript features support' },
  { id: 'local-storage', name: 'Local Storage', details: 'Browser storage API support' },
  { id: 'service-worker', name: 'Service Worker', details: 'PWA capabilities support' },
  { id: 'webp', name: 'WebP Images', details: 'Modern image format support' },
  { id: 'css-variables', name: 'CSS Variables', details: 'CSS custom properties support' }
];

const CrossBrowserTesting: React.FC = () => {
  const [tests, setTests] = useState<BrowserTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBrowsers, setSelectedBrowsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'browsers' | 'tests' | 'results' | 'settings'>('dashboard');

  const metrics: BrowserMetrics = React.useMemo(() => {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'passed').length;
    const failed = tests.filter(t => t.status === 'failed').length;
    const skipped = tests.filter(t => t.status === 'skipped').length;
    const running = tests.filter(t => t.status === 'running').length;
    const compatibility = total > 0 ? (passed / total) * 100 : 0;

    return { total, passed, failed, skipped, running, compatibility };
  }, [tests]);

  const runBrowserTest = useCallback(async (browserName: string) => {
    const browser = Browsers.find(b => b.name === browserName);
    if (!browser) return;

    const testId = `${browserName}-${Date.now()}`;
    const test: BrowserTest = {
      id: testId,
      browser: browser.name,
      version: browser.version,
      platform: browser.platform,
      status: 'running',
      features: Features.map(f => ({
        ...f,
        status: 'pending' as const
      })),
      startedAt: new Date()
    };

    setTests(prev => [...prev, test]);

    // Simulate feature testing
    for (let i = 0; i < test.features.length; i++) {
      setTests(prev => prev.map(t => 
        t.id === testId 
          ? {
              ...t,
              features: t.features.map((f, idx) => 
                idx === i ? { ...f, status: 'running' } : f
              )
            }
          : t
      ));

      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const shouldFail = Math.random() < 0.1;
      const status = shouldFail ? 'failed' : 'passed';
      const error = shouldFail ? `Feature not supported in ${browser.name}` : undefined;

      setTests(prev => prev.map(t => 
        t.id === testId 
          ? {
              ...t,
              features: t.features.map((f, idx) => 
                idx === i ? { ...f, status, error } : f
              )
            }
          : t
      ));
    }

    const allPassed = test.features.every(f => f.status === 'passed');
    setTests(prev => prev.map(t => 
      t.id === testId 
        ? { 
            ...t, 
            status: allPassed ? 'passed' : 'failed',
            completedAt: new Date()
          }
        : t
    ));
  }, []);

  const runSelectedTests = useCallback(async () => {
    if (selectedBrowsers.length === 0) return;
    
    setIsRunning(true);
    
    for (const browserName of selectedBrowsers) {
      await runBrowserTest(browserName);
    }
    
    setIsRunning(false);
  }, [selectedBrowsers, runBrowserTest]);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    
    for (const browser of Browsers) {
      await runBrowserTest(browser.name);
    }
    
    setIsRunning(false);
  }, [runBrowserTest]);

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
    setSelectedBrowsers([]);
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
    link.download = `cross-browser-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [tests]);

  const toggleBrowserSelection = useCallback((browserName: string) => {
    setSelectedBrowsers(prev => 
      prev.includes(browserName)
        ? prev.filter(name => name !== browserName)
        : [...prev, browserName]
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      desktop: 'bg-blue-100 text-blue-800',
      mobile: 'bg-green-100 text-green-800',
      tablet: 'bg-purple-100 text-purple-800'
    };
    return colors[platform] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cross-Browser Compatibility Testing</h2>
          <p className="text-gray-600">Test application compatibility across different browsers and devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runSelectedTests}
            disabled={selectedBrowsers.length === 0 || isRunning}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              selectedBrowsers.length === 0 || isRunning
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            <Play className="w-4 h-4 mr-2" />
            Test Selected ({selectedBrowsers.length})
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
            Test All Browsers
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
            { id: 'browsers', name: 'Browsers', icon: Globe },
            { id: 'tests', name: 'Test Results', icon: CheckCircle },
            { id: 'results', name: 'Compatibility', icon: Info },
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
                  <p className="text-sm font-medium text-gray-600">Total Browsers</p>
                  <p className="text-2xl font-bold text-gray-900">{Browsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compatible</p>
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
                  <p className="text-sm font-medium text-gray-600">Incompatible</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.failed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compatibility</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.compatibility.toFixed(1)}%</p>
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
                Test All Browsers
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

          {/* Platform Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Compatibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['desktop', 'mobile', 'tablet'].map((platform) => {
                const platformBrowsers = Browsers.filter(b => b.platform === platform);
                const platformTests = tests.filter(t => t.platform === platform);
                const passed = platformTests.filter(t => t.status === 'passed').length;
                const total = platformTests.length;
                const compatibility = total > 0 ? (passed / total) * 100 : 0;
                
                return (
                  <div key={platform} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">{platform}</h4>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getPlatformColor(platform)
                      )}>
                        {platformBrowsers.length} browsers
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compatibility:</span>
                        <span className={cn(
                          "font-medium",
                          compatibility >= 80 ? "text-green-600" : compatibility >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {compatibility.toFixed(0)}%
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

      {/* Browsers Tab */}
      {activeTab === 'browsers' && (
        <div className="space-y-4">
          {Browsers.map((browser) => (
            <div key={browser.name} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedBrowsers.includes(browser.name)}
                      onChange={() => toggleBrowserSelection(browser.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{browser.name}</h3>
                      <p className="text-gray-600">Version {browser.version}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getPlatformColor(browser.platform)
                    )}>
                      <div className="flex items-center space-x-1">
                        {getPlatformIcon(browser.platform)}
                        <span className="capitalize">{browser.platform}</span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>

              {/* Browser Actions */}
              <div className="p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => runBrowserTest(browser.name)}
                      disabled={isRunning}
                      className={cn(
                        "px-3 py-1 rounded text-sm font-medium transition-colors",
                        isRunning
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Test Browser
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                      <Monitor className="w-3 h-3 mr-1" />
                      View Details
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last tested: {tests.filter(t => t.browser === browser.name).length > 0 ? 'Recently' : 'Never'}
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
              <p className="text-gray-600">Run some browser tests to see results here</p>
            </div>
          ) : (
            tests
              .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
              .map((test) => (
                <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">{test.browser}</h4>
                        <p className="text-sm text-gray-600">Version {test.version} • {test.platform}</p>
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
                        getPlatformColor(test.platform)
                      )}>
                        <div className="flex items-center space-x-1">
                          {getPlatformIcon(test.platform)}
                          <span className="capitalize">{test.platform}</span>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* Feature Results */}
                  <div className="space-y-2">
                    {test.features.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(feature.status)}
                          <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                        </div>
                        <div className="text-xs text-gray-600 max-w-xs truncate" title={feature.details}>
                          {feature.details}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    {test.startedAt && `Started: ${test.startedAt.toLocaleString()}`}
                    {test.completedAt && test.startedAt && ` | Completed: ${test.completedAt.toLocaleString()}`}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Compatibility Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Compatibility Matrix */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Compatibility Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    {Browsers.map(browser => (
                      <th key={browser.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{browser.name}</span>
                          <span className="text-xs text-gray-400">{browser.version}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Features.map(feature => (
                    <tr key={feature.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.name}
                      </td>
                      {Browsers.map(browser => {
                        const test = tests.find(t => t.browser === browser.name);
                        const featureTest = test?.features.find(f => f.id === feature.id);
                        const status = featureTest?.status || 'pending';
                        
                        return (
                          <td key={browser.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getStatusIcon(status)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compatibility Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
                <p className="text-sm text-gray-600">Total Tests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{metrics.passed}</p>
                <p className="text-sm text-gray-600">Compatible</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{metrics.failed}</p>
                <p className="text-sm text-gray-600">Incompatible</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{metrics.compatibility.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Overall Compatibility</p>
              </div>
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
                  Maximum time allowed for each browser test
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
                  Capture screenshots when tests fail
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parallel Testing
                </label>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Run multiple browser tests simultaneously
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export & Reports</h3>
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
                Generate Compatibility Report
              </button>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <Monitor className="w-4 h-4 mr-2 inline" />
                Export Browser Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrossBrowserTesting;
