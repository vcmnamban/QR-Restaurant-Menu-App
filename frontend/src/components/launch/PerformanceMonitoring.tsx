import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Globe,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/utils';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  change: number;
  threshold: {
    warning: number;
    critical: number;
  };
  lastUpdated: Date;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'critical';
  api: 'healthy' | 'warning' | 'critical';
  frontend: 'healthy' | 'warning' | 'critical';
  external: 'healthy' | 'warning' | 'critical';
}

const PerformanceMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    database: 'healthy',
    api: 'healthy',
    frontend: 'healthy',
    external: 'healthy'
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showAlerts, setShowAlerts] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'alerts' | 'settings'>('overview');

  const defaultMetrics: PerformanceMetric[] = [
    {
      id: 'response-time',
      name: 'API Response Time',
      value: 245,
      unit: 'ms',
      status: 'healthy',
      trend: 'stable',
      change: 2.1,
      threshold: { warning: 500, critical: 1000 },
      lastUpdated: new Date()
    },
    {
      id: 'throughput',
      name: 'Requests per Second',
      value: 1250,
      unit: 'req/s',
      status: 'healthy',
      trend: 'up',
      change: 8.5,
      threshold: { warning: 800, critical: 500 },
      lastUpdated: new Date()
    },
    {
      id: 'error-rate',
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      change: -0.3,
      threshold: { warning: 2, critical: 5 },
      lastUpdated: new Date()
    },
    {
      id: 'cpu-usage',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      change: 1.2,
      threshold: { warning: 70, critical: 90 },
      lastUpdated: new Date()
    },
    {
      id: 'memory-usage',
      name: 'Memory Usage',
      value: 62,
      unit: '%',
      status: 'warning',
      trend: 'up',
      change: 5.8,
      threshold: { warning: 60, critical: 85 },
      lastUpdated: new Date()
    },
    {
      id: 'database-connections',
      name: 'Database Connections',
      value: 28,
      unit: 'connections',
      status: 'healthy',
      trend: 'stable',
      change: 0,
      threshold: { warning: 40, critical: 50 },
      lastUpdated: new Date()
    }
  ];

  useEffect(() => {
    setMetrics(defaultMetrics);
    startMonitoring();
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    const interval = setInterval(() => {
      updateMetrics();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  };

  const updateMetrics = () => {
    setMetrics(prev => prev.map(metric => {
      // Simulate real-time updates with some randomness
      const change = (Math.random() - 0.5) * 10;
      const newValue = Math.max(0, Math.min(100, metric.value + change));
      
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (newValue >= metric.threshold.critical) status = 'critical';
      else if (newValue >= metric.threshold.warning) status = 'warning';

      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (change > 2) trend = 'up';
      else if (change < -2) trend = 'down';

      return {
        ...metric,
        value: Math.round(newValue * 100) / 100,
        status,
        trend,
        change: Math.round(change * 100) / 100,
        lastUpdated: new Date()
      };
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const exportMetrics = () => {
    const dataStr = JSON.stringify(metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const criticalAlerts = metrics.filter(m => m.status === 'critical');
  const warningAlerts = metrics.filter(m => m.status === 'warning');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
          <p className="text-gray-600">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              isMonitoring
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isMonitoring ? (
              <>
                <EyeOff className="w-4 h-4" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Start Monitoring
              </>
            )}
          </button>
          <button
            onClick={exportMetrics}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'metrics', name: 'Metrics', icon: Activity },
            { id: 'alerts', name: 'Alerts', icon: AlertTriangle },
            { id: 'settings', name: 'Settings', icon: Settings }
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Health Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Database</p>
                  <p className="text-2xl font-bold text-gray-900">Healthy</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Server</p>
                  <p className="text-2xl font-bold text-gray-900">Healthy</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Frontend</p>
                  <p className="text-2xl font-bold text-gray-900">Healthy</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">External Services</p>
                  <p className="text-2xl font-bold text-gray-900">Healthy</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.slice(0, 3).map((metric) => (
              <div key={metric.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(metric.status)
                  )}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.unit}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className={cn(
                      "text-sm font-medium",
                      metric.trend === 'up' ? 'text-red-600' : 'text-green-600'
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Performance charts will be displayed here</p>
                <p className="text-sm text-gray-400">Real-time data visualization</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
                  <p className="text-sm text-gray-600">Last updated: {metric.lastUpdated.toLocaleTimeString()}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getStatusColor(metric.status)
                  )}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className={cn(
                      "text-sm font-medium",
                      metric.trend === 'up' ? 'text-red-600' : 'text-green-600'
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value} {metric.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Warning Threshold</p>
                  <p className="text-lg font-medium text-yellow-600">{metric.threshold.warning} {metric.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Threshold</p>
                  <p className="text-lg font-medium text-red-600">{metric.threshold.critical} {metric.unit}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className={cn(
                    "text-lg font-medium",
                    metric.status === 'healthy' ? 'text-green-600' : 
                    metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  )}>
                    {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Critical Alerts ({criticalAlerts.length})
              </h3>
              <div className="space-y-3">
                {criticalAlerts.map((metric) => (
                  <div key={metric.id} className="bg-white p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-900">{metric.name}</p>
                        <p className="text-sm text-red-700">
                          Current: {metric.value} {metric.unit} | Threshold: {metric.threshold.critical} {metric.unit}
                        </p>
                      </div>
                      <span className="text-sm text-red-600 font-medium">Critical</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Alerts */}
          {warningAlerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-yellow-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Warning Alerts ({warningAlerts.length})
              </h3>
              <div className="space-y-3">
                {warningAlerts.map((metric) => (
                  <div key={metric.id} className="bg-white p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-yellow-900">{metric.name}</p>
                        <p className="text-sm text-yellow-700">
                          Current: {metric.value} {metric.unit} | Threshold: {metric.threshold.warning} {metric.unit}
                        </p>
                      </div>
                      <span className="text-sm text-yellow-600 font-medium">Warning</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Alerts */}
          {criticalAlerts.length === 0 && warningAlerts.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-green-900 mb-2">All Systems Healthy</h3>
              <p className="text-green-700">No critical or warning alerts at this time.</p>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monitoring Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  How often to update performance metrics
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="show-alerts"
                  checked={showAlerts}
                  onChange={(e) => setShowAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="show-alerts" className="ml-2 text-sm font-medium text-gray-700">
                  Show performance alerts
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-refresh"
                  checked={isMonitoring}
                  onChange={(e) => setIsMonitoring(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="auto-refresh" className="ml-2 text-sm font-medium text-gray-700">
                  Auto-refresh metrics
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Threshold Configuration</h3>
            <p className="text-gray-600 mb-4">
              Configure warning and critical thresholds for performance metrics
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Configure Thresholds
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitoring;
