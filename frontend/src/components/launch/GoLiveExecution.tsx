import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  RefreshCw, 
  BarChart3,
  AlertTriangle,
  Users,
  Globe,
  Database,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Activity,
  Settings
} from 'lucide-react';
import { cn } from '@/utils';

interface GoLiveStep {
  id: string;
  name: string;
  category: 'pre-launch' | 'launch' | 'post-launch';
  status: 'pending' | 'running' | 'completed' | 'failed';
  description: string;
  critical: boolean;
  estimatedTime: number;
  actualTime?: number;
  errorMessage?: string;
  dependencies?: string[];
}

interface LaunchMetrics {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  launchProgress: number;
  estimatedTimeRemaining: number;
  criticalStepsCompleted: boolean;
}

interface LaunchStatus {
  phase: 'pre-launch' | 'launch' | 'post-launch' | 'completed';
  startTime?: Date;
  endTime?: Date;
  currentStep?: string;
  overallStatus: 'pending' | 'running' | 'success' | 'failed';
}

const GoLiveExecution: React.FC = () => {
  const [goLiveSteps, setGoLiveSteps] = useState<GoLiveStep[]>([]);
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>({
    phase: 'pre-launch',
    overallStatus: 'pending'
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'execution' | 'monitoring' | 'rollback'>('dashboard');
  const [isLaunching, setIsLaunching] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const defaultGoLiveSteps: GoLiveStep[] = [
    // Pre-Launch Phase
    {
      id: 'pre-001',
      name: 'Final System Health Check',
      category: 'pre-launch',
      status: 'pending',
      description: 'Verify all systems are healthy and ready for launch',
      critical: true,
      estimatedTime: 10,
      dependencies: []
    },
    {
      id: 'pre-002',
      name: 'Database Backup & Verification',
      category: 'pre-launch',
      status: 'pending',
      description: 'Create final backup and verify data integrity',
      critical: true,
      estimatedTime: 15,
      dependencies: ['pre-001']
    },
    {
      id: 'pre-003',
      name: 'Load Balancer Configuration',
      category: 'pre-launch',
      status: 'pending',
      description: 'Configure load balancer for production traffic',
      critical: true,
      estimatedTime: 20,
      dependencies: ['pre-002']
    },
    {
      id: 'pre-004',
      name: 'SSL Certificate Validation',
      category: 'pre-launch',
      status: 'pending',
      description: 'Verify SSL certificates are valid and properly configured',
      critical: true,
      estimatedTime: 10,
      dependencies: ['pre-003']
    },
    {
      id: 'pre-005',
      name: 'Final Security Scan',
      category: 'pre-launch',
      status: 'pending',
      description: 'Run comprehensive security vulnerability scan',
      critical: true,
      estimatedTime: 25,
      dependencies: ['pre-004']
    },

    // Launch Phase
    {
      id: 'launch-001',
      name: 'DNS Configuration Update',
      category: 'launch',
      status: 'pending',
      description: 'Update DNS records to point to production servers',
      critical: true,
      estimatedTime: 5,
      dependencies: ['pre-005']
    },
    {
      id: 'launch-002',
      name: 'Production Traffic Routing',
      category: 'launch',
      status: 'pending',
      description: 'Route production traffic to new infrastructure',
      critical: true,
      estimatedTime: 10,
      dependencies: ['launch-001']
    },
    {
      id: 'launch-003',
      name: 'Service Health Verification',
      category: 'launch',
      status: 'pending',
      description: 'Verify all services are responding correctly',
      critical: true,
      estimatedTime: 15,
      dependencies: ['launch-002']
    },
    {
      id: 'launch-004',
      name: 'Performance Baseline Establishment',
      category: 'launch',
      status: 'pending',
      description: 'Establish performance baselines for monitoring',
      critical: false,
      estimatedTime: 20,
      dependencies: ['launch-003']
    },

    // Post-Launch Phase
    {
      id: 'post-001',
      name: 'User Acceptance Testing',
      category: 'post-launch',
      status: 'pending',
      description: 'Execute user acceptance testing with stakeholders',
      critical: true,
      estimatedTime: 30,
      dependencies: ['launch-004']
    },
    {
      id: 'post-002',
      name: 'Performance Monitoring Setup',
      category: 'post-launch',
      status: 'pending',
      description: 'Activate real-time performance monitoring and alerting',
      critical: true,
      estimatedTime: 20,
      dependencies: ['post-001']
    },
    {
      id: 'post-003',
      name: 'Support Team Activation',
      category: 'post-launch',
      status: 'pending',
      description: 'Activate support team and communication channels',
      critical: false,
      estimatedTime: 15,
      dependencies: ['post-002']
    },
    {
      id: 'post-004',
      name: 'Launch Announcement',
      category: 'post-launch',
      status: 'pending',
      description: 'Announce launch to stakeholders and users',
      critical: false,
      estimatedTime: 10,
      dependencies: ['post-003']
    },
    {
      id: 'post-005',
      name: 'Final Launch Validation',
      category: 'post-launch',
      status: 'pending',
      description: 'Complete final validation and launch confirmation',
      critical: true,
      estimatedTime: 25,
      dependencies: ['post-004']
    }
  ];

  useEffect(() => {
    setGoLiveSteps(defaultGoLiveSteps);
  }, []);

  const updateStepStatus = (stepId: string, status: GoLiveStep['status'], errorMessage?: string) => {
    setGoLiveSteps(prev => prev.map(step => 
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

  const canExecuteStep = (step: GoLiveStep): boolean => {
    if (!step.dependencies || step.dependencies.length === 0) return true;
    return step.dependencies.every(depId => {
      const depStep = goLiveSteps.find(s => s.id === depId);
      return depStep?.status === 'completed';
    });
  };

  const executeStep = async (step: GoLiveStep) => {
    if (!canExecuteStep(step)) {
      alert(`Cannot execute ${step.name} - dependencies not met`);
      return;
    }

    updateStepStatus(step.id, 'running');

    try {
      // Simulate step execution
      await new Promise(resolve => setTimeout(resolve, step.estimatedTime * 1000));
      
      // Simulate success/failure (95% success rate for critical steps, 90% for non-critical)
      const successRate = step.critical ? 0.95 : 0.90;
      const success = Math.random() < successRate;
      
      if (success) {
        updateStepStatus(step.id, 'completed');
      } else {
        updateStepStatus(step.id, 'failed', 'Simulated execution failure for demonstration');
      }
    } catch (error) {
      updateStepStatus(step.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const executeGoLive = async () => {
    setIsLaunching(true);
    setLaunchStatus(prev => ({ ...prev, overallStatus: 'running', startTime: new Date() }));

    // Execute pre-launch steps
    setLaunchStatus(prev => ({ ...prev, phase: 'pre-launch' }));
    for (const step of goLiveSteps.filter(s => s.category === 'pre-launch')) {
      if (step.status === 'pending') {
        setLaunchStatus(prev => ({ ...prev, currentStep: step.name }));
        await executeStep(step);
        if (step.status === 'failed') {
          setLaunchStatus(prev => ({ ...prev, overallStatus: 'failed' }));
          setIsLaunching(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Execute launch steps
    setLaunchStatus(prev => ({ ...prev, phase: 'launch' }));
    for (const step of goLiveSteps.filter(s => s.category === 'launch')) {
      if (step.status === 'pending') {
        setLaunchStatus(prev => ({ ...prev, currentStep: step.name }));
        await executeStep(step);
        if (step.status === 'failed') {
          setLaunchStatus(prev => ({ ...prev, overallStatus: 'failed' }));
          setIsLaunching(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Execute post-launch steps
    setLaunchStatus(prev => ({ ...prev, phase: 'post-launch' }));
    for (const step of goLiveSteps.filter(s => s.category === 'post-launch')) {
      if (step.status === 'pending') {
        setLaunchStatus(prev => ({ ...prev, currentStep: step.name }));
        await executeStep(step);
        if (step.status === 'failed') {
          setLaunchStatus(prev => ({ ...prev, overallStatus: 'failed' }));
          setIsLaunching(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Launch completed successfully
    setLaunchStatus(prev => ({ 
      ...prev, 
      phase: 'completed', 
      overallStatus: 'success',
      endTime: new Date()
    }));
    setIsLaunching(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'pre-launch': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'launch': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'post-launch': return 'text-green-600 bg-green-50 border-green-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pre-launch': return <Shield className="w-4 h-4" />;
      case 'launch': return <Rocket className="w-4 h-4" />;
      case 'post-launch': return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const metrics: LaunchMetrics = {
    totalSteps: goLiveSteps.length,
    completedSteps: goLiveSteps.filter(s => s.status === 'completed').length,
    failedSteps: goLiveSteps.filter(s => s.status === 'failed').length,
    launchProgress: goLiveSteps.length > 0 ? (goLiveSteps.filter(s => s.status === 'completed').length / goLiveSteps.length) * 100 : 0,
    estimatedTimeRemaining: goLiveSteps
      .filter(s => s.status === 'pending')
      .reduce((total, step) => total + step.estimatedTime, 0),
    criticalStepsCompleted: goLiveSteps
      .filter(s => s.critical)
      .every(s => s.status === 'completed')
  };

  const getOverallStatusIcon = () => {
    switch (launchStatus.overallStatus) {
      case 'success': return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed': return <XCircle className="w-8 h-8 text-red-500" />;
      case 'running': return <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />;
      default: return <Clock className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Go-Live Execution</h2>
          <p className="text-gray-600">Execute the final launch sequence and deploy to production</p>
        </div>
        <div className="flex items-center space-x-3">
          {!isLaunching && launchStatus.overallStatus === 'pending' && (
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Execute Go-Live
            </button>
          )}
          {launchStatus.overallStatus === 'success' && (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Launch Successful!
            </div>
          )}
          {launchStatus.overallStatus === 'failed' && (
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Launch
            </button>
          )}
        </div>
      </div>

      {/* Launch Status Banner */}
      {launchStatus.overallStatus !== 'pending' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getOverallStatusIcon()}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Launch Status: {launchStatus.overallStatus.charAt(0).toUpperCase() + launchStatus.overallStatus.slice(1)}
                </h3>
                <p className="text-gray-600">
                  Phase: {launchStatus.phase.charAt(0).toUpperCase() + launchStatus.phase.slice(1).replace('-', ' ')}
                  {launchStatus.currentStep && ` - Current: ${launchStatus.currentStep}`}
                </p>
                {launchStatus.startTime && (
                  <p className="text-sm text-gray-500">
                    Started: {launchStatus.startTime.toLocaleString()}
                    {launchStatus.endTime && ` | Completed: ${launchStatus.endTime.toLocaleString()}`}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{metrics.launchProgress.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'execution', name: 'Execution', icon: Rocket },
            { id: 'monitoring', name: 'Monitoring', icon: Activity },
            { id: 'rollback', name: 'Rollback', icon: AlertTriangle }
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Rocket className="w-6 h-6 text-blue-600" />
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
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.failedSteps}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Time Remaining</p>
                  <p className="text-2xl font-bold text-yellow-600">{Math.round(metrics.estimatedTimeRemaining / 60)}m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Launch Progress */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Launch Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${metrics.launchProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {metrics.completedSteps} of {metrics.totalSteps} steps completed
            </div>
          </div>

          {/* Phase Status */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Phase Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['pre-launch', 'launch', 'post-launch'].map((phase) => {
                const phaseSteps = goLiveSteps.filter(s => s.category === phase);
                const completedSteps = phaseSteps.filter(s => s.status === 'completed').length;
                const totalSteps = phaseSteps.length;
                const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
                
                return (
                  <div key={phase} className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      {phase.charAt(0).toUpperCase() + phase.slice(1).replace('-', ' ')}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{completedSteps}/{totalSteps}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Execution Tab */}
      {activeTab === 'execution' && (
        <div className="space-y-4">
          {goLiveSteps.map((step) => (
            <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {step.category.replace('-', ' ')}
                      </span>
                      {step.critical && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          Critical
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Est: {step.estimatedTime}min
                        {step.actualTime && ` | Actual: ${Math.round((Date.now() - step.actualTime) / 1000 / 60)}min`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {step.status === 'pending' && canExecuteStep(step) && (
                    <button
                      onClick={() => executeStep(step)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Execute
                    </button>
                  )}
                  {step.status === 'pending' && !canExecuteStep(step) && (
                    <span className="text-sm text-gray-400">Waiting for dependencies</span>
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

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Real-Time Launch Monitoring</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Web Server</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Gateway</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Ready</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm text-gray-900">~200ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Throughput</span>
                    <span className="text-sm text-gray-900">1000 req/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="text-sm text-gray-900">0.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm text-gray-900">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rollback Tab */}
      {activeTab === 'rollback' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rollback Procedures</h3>
            <p className="text-gray-600 mb-4">
              In case of critical issues during launch, use these rollback procedures to restore the previous stable version.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Database Rollback</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Restore database to the last known good state before launch.
                </p>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition-colors">
                  Execute Database Rollback
                </button>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">Application Rollback</h4>
                <p className="text-sm text-red-700 mb-3">
                  Rollback application to the previous stable version.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors">
                  Execute Application Rollback
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">DNS Rollback</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Revert DNS changes to point back to the previous infrastructure.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                  Execute DNS Rollback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Go-Live Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm Go-Live Execution</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to execute the go-live sequence? This will:
            </p>
            
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li>• Deploy to production environment</li>
              <li>• Update DNS and routing</li>
              <li>• Activate live user traffic</li>
              <li>• Cannot be easily undone</li>
            </ul>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  executeGoLive();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Execute Go-Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoLiveExecution;
