import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Download,
  Play,
  Square,
  RefreshCw,
  Settings,
  BarChart3,
  Cloud,
  Terminal,
  GitBranch,
  Package,
  Lock,
  Key,
  Monitor,
  Activity
} from 'lucide-react';
import { cn } from '@/utils';

interface EnvironmentConfig {
  id: string;
  name: string;
  type: 'production' | 'staging' | 'development';
  status: 'pending' | 'configuring' | 'ready' | 'deployed';
  url?: string;
  databaseUrl?: string;
  sslStatus: 'pending' | 'installing' | 'active' | 'expired';
  lastDeployment?: Date;
  healthStatus: 'unknown' | 'healthy' | 'warning' | 'critical';
}

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  estimatedTime: number;
  actualTime?: number;
  dependencies?: string[];
  completedAt?: Date;
  notes?: string;
}

interface EnvironmentVariable {
  key: string;
  value: string;
  description: string;
  isSecret: boolean;
  isRequired: boolean;
  currentValue?: string;
}

interface DeploymentMetrics {
  totalSteps: number;
  completedSteps: number;
  inProgressSteps: number;
  failedSteps: number;
  completionRate: number;
  environmentsReady: number;
  totalEnvironments: number;
}

const ProductionDeployment: React.FC = () => {
  const [environments, setEnvironments] = useState<EnvironmentConfig[]>([]);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'environments' | 'deployment' | 'variables' | 'monitoring'>('overview');
  const [isDeploying, setIsDeploying] = useState(false);

  const defaultEnvironments: EnvironmentConfig[] = [
    {
      id: 'prod-001',
      name: 'Production',
      type: 'production',
      status: 'pending',
      sslStatus: 'pending',
      healthStatus: 'unknown'
    },
    {
      id: 'staging-001',
      name: 'Staging',
      type: 'staging',
      status: 'pending',
      sslStatus: 'pending',
      healthStatus: 'unknown'
    }
  ];

  const defaultDeploymentSteps: DeploymentStep[] = [
    {
      id: 'step-001',
      name: 'Infrastructure Setup',
      description: 'Set up cloud infrastructure and networking',
      status: 'pending',
      estimatedTime: 60,
      dependencies: []
    },
    {
      id: 'step-002',
      name: 'Database Provisioning',
      description: 'Create and configure production databases',
      status: 'pending',
      estimatedTime: 30,
      dependencies: ['step-001']
    },
    {
      id: 'step-003',
      name: 'Application Deployment',
      description: 'Deploy application to production environment',
      status: 'pending',
      estimatedTime: 45,
      dependencies: ['step-001', 'step-002']
    },
    {
      id: 'step-004',
      name: 'SSL Certificate Installation',
      description: 'Install and configure SSL certificates',
      status: 'pending',
      estimatedTime: 20,
      dependencies: ['step-003']
    },
    {
      id: 'step-005',
      name: 'Health Checks & Validation',
      description: 'Run comprehensive health checks',
      status: 'pending',
      estimatedTime: 15,
      dependencies: ['step-004']
    },
    {
      id: 'step-006',
      name: 'Performance Testing',
      description: 'Execute performance and load tests',
      status: 'pending',
      estimatedTime: 30,
      dependencies: ['step-005']
    }
  ];

  const defaultEnvironmentVariables: EnvironmentVariable[] = [
    {
      key: 'NODE_ENV',
      value: 'production',
      description: 'Application environment',
      isSecret: false,
      isRequired: true
    },
    {
      key: 'DATABASE_URL',
      value: 'mongodb://localhost:27017/qr-restaurant-prod',
      description: 'Production database connection string',
      isSecret: true,
      isRequired: true
    },
    {
      key: 'JWT_SECRET',
      value: 'your-super-secret-jwt-key',
      description: 'JWT signing secret',
      isSecret: true,
      isRequired: true
    },
    {
      key: 'PAYMENT_GATEWAY_KEY',
      value: 'pk_live_...',
      description: 'Payment gateway API key',
      isSecret: true,
      isRequired: true
    },
    {
      key: 'EMAIL_SERVICE_KEY',
      value: 'your-email-service-key',
      description: 'Email service API key',
      isSecret: true,
      isRequired: false
    },
    {
      key: 'CDN_URL',
      value: 'https://cdn.yourdomain.com',
      description: 'CDN base URL for static assets',
      isSecret: false,
      isRequired: false
    }
  ];

  useEffect(() => {
    setEnvironments(defaultEnvironments);
    setDeploymentSteps(defaultDeploymentSteps);
    setEnvironmentVariables(defaultEnvironmentVariables);
  }, []);

  const updateDeploymentStep = (stepId: string, status: DeploymentStep['status'], notes?: string) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { 
            ...step, 
            status, 
            notes,
            completedAt: status === 'completed' ? new Date() : undefined
          }
        : step
    ));
  };

  const updateEnvironmentStatus = (envId: string, status: EnvironmentConfig['status']) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId ? { ...env, status } : env
    ));
  };

  const executeDeployment = async () => {
    setIsDeploying(true);
    
    // Simulate deployment execution
    for (const step of deploymentSteps) {
      if (step.status === 'pending') {
        updateDeploymentStep(step.id, 'in-progress');
        await new Promise(resolve => setTimeout(resolve, 2000));
        updateDeploymentStep(step.id, 'completed');
      }
    }
    
    setIsDeploying(false);
  };

  const exportDeploymentConfig = () => {
    const data = {
      environments,
      deploymentSteps,
      environmentVariables,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deployment-config-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSSLColor = (ssl: string) => {
    switch (ssl) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'installing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const metrics: DeploymentMetrics = {
    totalSteps: deploymentSteps.length,
    completedSteps: deploymentSteps.filter(step => step.status === 'completed').length,
    inProgressSteps: deploymentSteps.filter(step => step.status === 'in-progress').length,
    failedSteps: deploymentSteps.filter(step => step.status === 'failed').length,
    completionRate: deploymentSteps.length > 0 ? (deploymentSteps.filter(step => step.status === 'completed').length / deploymentSteps.length) * 100 : 0,
    environmentsReady: environments.filter(env => env.status === 'ready').length,
    totalEnvironments: environments.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Production Deployment</h2>
          <p className="text-gray-600">Prepare and execute production deployment with comprehensive configuration</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={executeDeployment}
            disabled={isDeploying}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              isDeploying
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isDeploying ? 'Deploying...' : 'Execute Deployment'}
          </button>
          <button
            onClick={exportDeploymentConfig}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Config
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'environments', name: 'Environments', icon: Server },
            { id: 'deployment', name: 'Deployment Steps', icon: Terminal },
            { id: 'variables', name: 'Environment Variables', icon: Key },
            { id: 'monitoring', name: 'Monitoring', icon: Monitor }
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
                  <Terminal className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Steps</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalSteps}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.completedSteps}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.inProgressSteps}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Server className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Environments Ready</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.environmentsReady}/{metrics.totalEnvironments}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Overall Progress</span>
                  <span>{metrics.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.completedSteps}</div>
                  <div className="text-sm text-gray-600">Completed Steps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.inProgressSteps}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{metrics.totalSteps - metrics.completedSteps - metrics.inProgressSteps}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Environment Status</h3>
            <div className="space-y-4">
              {environments.map((env) => (
                <div key={env.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Server className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{env.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{env.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(env.status)
                    )}>
                      {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getSSLColor(env.sslStatus)
                    )}>
                      SSL: {env.sslStatus.charAt(0).toUpperCase() + env.sslStatus.slice(1)}
                    </span>
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
                    <Server className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{env.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{env.type} Environment</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(env.status)
                    )}>
                      {env.status.charAt(0).toUpperCase() + env.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm text-gray-900 capitalize">{env.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">SSL Status:</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          getSSLColor(env.sslStatus)
                        )}>
                          {env.sslStatus.charAt(0).toUpperCase() + env.sslStatus.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Health:</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded",
                          getHealthColor(env.healthStatus)
                        )}>
                          {env.healthStatus.charAt(0).toUpperCase() + env.healthStatus.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Deployment Info</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Deployment:</span>
                        <span className="text-sm text-gray-900">
                          {env.lastDeployment ? env.lastDeployment.toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">URL:</span>
                        <span className="text-sm text-gray-900">
                          {env.url || 'Not configured'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Environment ID: {env.id}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {env.status === 'pending' && (
                      <button
                        onClick={() => updateEnvironmentStatus(env.id, 'configuring')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Configuration
                      </button>
                    )}
                    
                    {env.status === 'configuring' && (
                      <button
                        onClick={() => updateEnvironmentStatus(env.id, 'ready')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Mark Ready
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deployment Steps Tab */}
      {activeTab === 'deployment' && (
        <div className="space-y-4">
          {deploymentSteps.map((step) => (
            <div key={step.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Terminal className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{step.estimatedTime} min</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(step.status)
                    )}>
                      {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated Time</p>
                    <p className="text-gray-900">{step.estimatedTime} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actual Time</p>
                    <p className="text-gray-900">{step.actualTime ? `${step.actualTime} minutes` : 'Not started'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dependencies</p>
                    <p className="text-gray-900">
                      {step.dependencies && step.dependencies.length > 0 ? step.dependencies.join(', ') : 'None'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {step.completedAt && `Completed: ${step.completedAt.toLocaleDateString()}`}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {step.status === 'pending' && (
                      <button
                        onClick={() => updateDeploymentStep(step.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Step
                      </button>
                    )}
                    
                    {step.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => updateDeploymentStep(step.id, 'completed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateDeploymentStep(step.id, 'failed')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Mark Failed
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {step.notes && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {step.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Environment Variables Tab */}
      {activeTab === 'variables' && (
        <div className="space-y-4">
          {environmentVariables.map((variable) => (
            <div key={variable.key} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{variable.key}</h3>
                      <p className="text-sm text-gray-600">{variable.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {variable.isRequired && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        Required
                      </span>
                    )}
                    {variable.isSecret && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        Secret
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Value</p>
                    <p className="text-gray-900">
                      {variable.isSecret ? '••••••••' : (variable.currentValue || 'Not set')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Default Value</p>
                    <p className="text-gray-900">
                      {variable.isSecret ? '••••••••' : variable.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Type: {variable.isSecret ? 'Secret' : 'Public'}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                      Validate
                    </button>
                  </div>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {environments.filter(env => env.healthStatus === 'healthy').length}
                </div>
                <div className="text-sm text-gray-600">Healthy Environments</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {environments.filter(env => env.healthStatus === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Warning</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {environments.filter(env => env.healthStatus === 'critical').length}
                </div>
                <div className="text-sm text-gray-600">Critical</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SSL Certificate Status</h3>
            <div className="space-y-4">
              {environments.map((env) => (
                <div key={env.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{env.name}</p>
                      <p className="text-sm text-gray-600">SSL Certificate</p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    getSSLColor(env.sslStatus)
                  )}>
                    {env.sslStatus.charAt(0).toUpperCase() + env.sslStatus.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Run Health Check
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Status
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                View Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionDeployment;

