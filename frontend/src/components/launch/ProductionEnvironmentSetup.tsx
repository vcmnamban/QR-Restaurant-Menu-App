import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Play,
  RefreshCw,
  Download,
  Save,
  Eye,
  EyeOff,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils';

interface EnvironmentConfig {
  id: string;
  name: string;
  type: 'production' | 'staging' | 'development';
  status: 'pending' | 'configuring' | 'configured' | 'error';
  description: string;
  serverUrl: string;
  databaseUrl: string;
  sslEnabled: boolean;
  environmentVariables: EnvironmentVariable[];
  lastUpdated: Date;
  notes?: string;
}

interface EnvironmentVariable {
  key: string;
  value: string;
  isSecret: boolean;
  required: boolean;
  description: string;
}

interface SetupStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  estimatedTime: number;
  actualTime?: number;
  errorMessage?: string;
}

const ProductionEnvironmentSetup: React.FC = () => {
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'environments' | 'setup' | 'variables' | 'monitoring'>('overview');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [isRunningSetup, setIsRunningSetup] = useState(false);

  const defaultEnvironments: EnvironmentConfig[] = [
    {
      id: 'prod-001',
      name: 'Production Environment',
      type: 'production',
      status: 'pending',
      description: 'Main production environment for live users',
      serverUrl: 'https://api.qrrestaurant.com',
      databaseUrl: 'postgresql://prod:****@prod-db.qrrestaurant.com:5432/qrrestaurant_prod',
      sslEnabled: true,
      environmentVariables: [
        { key: 'NODE_ENV', value: 'production', isSecret: false, required: true, description: 'Node.js environment' },
        { key: 'DATABASE_URL', value: 'postgresql://prod:****@prod-db.qrrestaurant.com:5432/qrrestaurant_prod', isSecret: true, required: true, description: 'Production database connection string' },
        { key: 'JWT_SECRET', value: '****', isSecret: true, required: true, description: 'JWT signing secret' },
        { key: 'STRIPE_SECRET_KEY', value: 'sk_live_****', isSecret: true, required: true, description: 'Stripe production secret key' },
        { key: 'TWILIO_ACCOUNT_SID', value: 'AC****', isSecret: true, required: true, description: 'Twilio account SID' },
        { key: 'TWILIO_AUTH_TOKEN', value: '****', isSecret: true, required: true, description: 'Twilio authentication token' },
        { key: 'SMTP_HOST', value: 'smtp.gmail.com', isSecret: false, required: true, description: 'SMTP server host' },
        { key: 'SMTP_USER', value: 'noreply@qrrestaurant.com', isSecret: false, required: true, description: 'SMTP username' },
        { key: 'SMTP_PASS', value: '****', isSecret: true, required: true, description: 'SMTP password' }
      ],
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: 'staging-001',
      name: 'Staging Environment',
      type: 'staging',
      status: 'pending',
      description: 'Pre-production testing environment',
      serverUrl: 'https://staging-api.qrrestaurant.com',
      databaseUrl: 'postgresql://staging:****@staging-db.qrrestaurant.com:5432/qrrestaurant_staging',
      sslEnabled: true,
      environmentVariables: [
        { key: 'NODE_ENV', value: 'staging', isSecret: false, required: true, description: 'Node.js environment' },
        { key: 'DATABASE_URL', value: 'postgresql://staging:****@staging-db.qrrestaurant.com:5432/qrrestaurant_staging', isSecret: true, required: true, description: 'Staging database connection string' },
        { key: 'JWT_SECRET', value: '****', isSecret: true, required: true, description: 'JWT signing secret' },
        { key: 'STRIPE_SECRET_KEY', value: 'sk_test_****', isSecret: true, required: true, description: 'Stripe test secret key' }
      ],
      lastUpdated: new Date('2024-01-20')
    }
  ];

  const defaultSetupSteps: SetupStep[] = [
    {
      id: 'step-001',
      name: 'Server Infrastructure Setup',
      status: 'pending',
      description: 'Provision and configure production servers',
      estimatedTime: 30
    },
    {
      id: 'step-002',
      name: 'Database Setup & Migration',
      status: 'pending',
      description: 'Set up production database and run migrations',
      estimatedTime: 45
    },
    {
      id: 'step-003',
      name: 'SSL Certificate Installation',
      status: 'pending',
      description: 'Install and configure SSL certificates',
      estimatedTime: 15
    },
    {
      id: 'step-004',
      name: 'Environment Variables Configuration',
      status: 'pending',
      description: 'Configure all environment variables',
      estimatedTime: 20
    },
    {
      id: 'step-005',
      name: 'Security Hardening',
      status: 'pending',
      description: 'Apply security configurations and firewall rules',
      estimatedTime: 25
    },
    {
      id: 'step-006',
      name: 'Monitoring & Logging Setup',
      status: 'pending',
      description: 'Configure monitoring, logging, and alerting',
      estimatedTime: 30
    },
    {
      id: 'step-007',
      name: 'Load Balancer Configuration',
      status: 'pending',
      description: 'Set up load balancer and health checks',
      estimatedTime: 20
    },
    {
      id: 'step-008',
      name: 'Final Validation & Testing',
      status: 'pending',
      description: 'Run comprehensive tests and validation',
      estimatedTime: 30
    }
  ];

  useEffect(() => {
    setEnvironments(defaultEnvironments);
    setSetupSteps(defaultSetupSteps);
  }, []);

  const updateEnvironmentStatus = (envId: string, status: EnvironmentConfig['status']) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status, lastUpdated: new Date() }
        : env
    ));
  };

  const updateSetupStepStatus = (stepId: string, status: SetupStep['status'], errorMessage?: string) => {
    setSetupSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status, 
            actualTime: status === 'completed' ? Date.now() : undefined,
            errorMessage
          }
        : step
    ));
  };

  const runSetupStep = async (stepId: string) => {
    const step = setupSteps.find(s => s.id === stepId);
    if (!step) return;

    updateSetupStepStatus(stepId, 'running');

    try {
      // Simulate setup step execution
      await new Promise(resolve => setTimeout(resolve, step.estimatedTime * 1000));
      
      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        updateSetupStepStatus(stepId, 'completed');
      } else {
        updateSetupStepStatus(stepId, 'failed', 'Simulated setup failure for demonstration');
      }
    } catch (error) {
      updateSetupStepStatus(stepId, 'failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAllSetupSteps = async () => {
    setIsRunningSetup(true);
    
    for (const step of setupSteps) {
      if (step.status === 'pending') {
        await runSetupStep(step.id);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay between steps
      }
    }
    
    setIsRunningSetup(false);
  };

  const exportEnvironmentConfig = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (!env) return;

    const config = {
      name: env.name,
      type: env.type,
      serverUrl: env.serverUrl,
      databaseUrl: env.databaseUrl,
      sslEnabled: env.sslEnabled,
      environmentVariables: env.environmentVariables.map(v => ({
        key: v.key,
        value: v.isSecret ? '****' : v.value,
        required: v.required,
        description: v.description
      })),
      lastUpdated: env.lastUpdated.toISOString()
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${env.name.toLowerCase().replace(/\s/g, '-')}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured': return 'text-green-600 bg-green-50 border-green-200';
      case 'configuring': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'production': return <Server className="w-4 h-4" />;
      case 'staging': return <Database className="w-4 h-4" />;
      case 'development': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const metrics = {
    totalEnvironments: environments.length,
    configuredEnvironments: environments.filter(e => e.status === 'configured').length,
    totalSetupSteps: setupSteps.length,
    completedSetupSteps: setupSteps.filter(s => s.status === 'completed').length,
    setupProgress: setupSteps.length > 0 ? (setupSteps.filter(s => s.status === 'completed').length / setupSteps.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Production Environment Setup</h2>
          <p className="text-gray-600">Configure and manage production environments for deployment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={runAllSetupSteps}
            disabled={isRunningSetup}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              isRunningSetup
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {isRunningSetup ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isRunningSetup ? 'Running Setup...' : 'Run All Setup Steps'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'environments', name: 'Environments', icon: Server },
            { id: 'setup', name: 'Setup Steps', icon: Settings },
            { id: 'variables', name: 'Environment Variables', icon: Database },
            { id: 'monitoring', name: 'Monitoring', icon: Globe }
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
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Environments</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalEnvironments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Configured</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.configuredEnvironments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Settings className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Setup Steps</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.completedSetupSteps}/{metrics.totalSetupSteps}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Setup Progress</p>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.setupProgress.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Progress */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Setup Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.setupProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {metrics.completedSetupSteps} of {metrics.totalSetupSteps} steps completed
            </div>
          </div>

          {/* Environment Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Environment Status</h3>
            <div className="space-y-3">
              {environments.map((env) => (
                <div key={env.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(env.type)}
                    <div>
                      <p className="font-medium text-gray-900">{env.name}</p>
                      <p className="text-sm text-gray-600">{env.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(env.status)
                    )}>
                      {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                    </span>
                    <button
                      onClick={() => exportEnvironmentConfig(env.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Export Config
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Environments Tab */}
      {activeTab === 'environments' && (
        <div className="space-y-4">
          {environments.map((env) => (
            <div key={env.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(env.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{env.name}</h3>
                      <p className="text-gray-600">{env.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(env.status)
                    )}>
                      {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {env.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Server URL</p>
                    <p className="text-gray-900 font-mono text-sm">{env.serverUrl}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Database URL</p>
                    <p className="text-gray-900 font-mono text-sm">{env.databaseUrl}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">SSL Enabled</p>
                    <p className="text-gray-900">{env.sslEnabled ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-gray-900">{env.lastUpdated.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {env.environmentVariables.length} environment variables
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => exportEnvironmentConfig(env.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Export Config
                    </button>
                    <button
                      onClick={() => updateEnvironmentStatus(env.id, 'configuring')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Mark Configured
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Setup Steps Tab */}
      {activeTab === 'setup' && (
        <div className="space-y-4">
          {setupSteps.map((step) => (
            <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Est: {step.estimatedTime}min
                    {step.actualTime && ` | Actual: ${Math.round((Date.now() - step.actualTime) / 1000 / 60)}min`}
                  </span>
                  {step.status === 'pending' && (
                    <button
                      onClick={() => runSetupStep(step.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Run Step
                    </button>
                  )}
                  {step.status === 'running' && (
                    <span className="text-sm text-blue-600">Running...</span>
                  )}
                  {step.status === 'completed' && (
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </span>
                  )}
                  {step.status === 'failed' && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Failed
                    </span>
                  )}
                </div>
              </div>

              {step.errorMessage && (
                <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {step.errorMessage}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Environment Variables Tab */}
      {activeTab === 'variables' && (
        <div className="space-y-6">
          {environments.map((env) => (
            <div key={env.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{env.name} - Environment Variables</h3>
                <p className="text-gray-600">Configure and manage environment variables for {env.name.toLowerCase()}</p>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {env.environmentVariables.map((variable, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Key</p>
                        <p className="text-gray-900 font-mono text-sm">{variable.key}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Value</p>
                        <div className="flex items-center space-x-2">
                          <input
                            type={variable.isSecret ? "password" : "text"}
                            value={variable.value}
                            className="flex-1 text-gray-900 font-mono text-sm bg-white border border-gray-300 rounded px-2 py-1"
                            readOnly
                          />
                          {variable.isSecret && (
                            <button className="text-gray-500 hover:text-gray-700">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Required</p>
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          variable.required 
                            ? "bg-red-100 text-red-800" 
                            : "bg-gray-100 text-gray-800"
                        )}>
                          {variable.required ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Description</p>
                        <p className="text-gray-900 text-sm">{variable.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Environment Health Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Production Environment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSL Certificate</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Valid</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Staging Environment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Pending</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database Status</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Pending</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">SSL Certificate</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionEnvironmentSetup;
