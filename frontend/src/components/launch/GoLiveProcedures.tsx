import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Download,
  Play,
  Square,
  RefreshCw,
  Database,
  Server,
  Globe,
  Shield,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  BarChart3,
  ArrowLeft,
  ArrowRight,
  Pause
} from 'lucide-react';
import { cn } from '@/utils';

interface GoLiveChecklist {
  id: string;
  name: string;
  category: 'pre-launch' | 'launch' | 'post-launch';
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  estimatedTime: number;
  actualTime?: number;
  dependencies?: string[];
  completedAt?: Date;
  notes?: string;
}

interface RollbackPlan {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  steps: string[];
  estimatedTime: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'reviewed' | 'approved' | 'ready';
}

interface GoLiveMetrics {
  totalChecklistItems: number;
  completedItems: number;
  inProgressItems: number;
  failedItems: number;
  completionRate: number;
  criticalItemsRemaining: number;
}

const GoLiveProcedures: React.FC = () => {
  const [checklistItems, setChecklistItems] = useState<GoLiveChecklist[]>([]);
  const [rollbackPlans, setRollbackPlans] = useState<RollbackPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'checklist' | 'rollback' | 'workflow' | 'approval'>('dashboard');
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);

  const defaultChecklistItems: GoLiveChecklist[] = [
    // Pre-Launch Checklist
    {
      id: 'pre-001',
      name: 'Final System Testing',
      category: 'pre-launch',
      description: 'Complete comprehensive system testing including load testing and security scans',
      status: 'pending',
      priority: 'critical',
      estimatedTime: 4,
      dependencies: []
    },
    {
      id: 'pre-002',
      name: 'Database Backup',
      category: 'pre-launch',
      description: 'Create full database backup before deployment',
      status: 'pending',
      priority: 'critical',
      estimatedTime: 1,
      dependencies: []
    },
    {
      id: 'pre-003',
      name: 'Environment Validation',
      category: 'pre-launch',
      description: 'Validate production environment configuration',
      status: 'pending',
      priority: 'high',
      estimatedTime: 2,
      dependencies: ['pre-001']
    },
    {
      id: 'pre-004',
      name: 'Team Communication',
      category: 'pre-launch',
      description: 'Notify all stakeholders about go-live schedule',
      status: 'pending',
      priority: 'medium',
      estimatedTime: 1,
      dependencies: []
    },

    // Launch Checklist
    {
      id: 'launch-001',
      name: 'Deployment Execution',
      category: 'launch',
      description: 'Execute production deployment with monitoring',
      status: 'pending',
      priority: 'critical',
      estimatedTime: 2,
      dependencies: ['pre-001', 'pre-002', 'pre-003']
    },
    {
      id: 'launch-002',
      name: 'Health Checks',
      category: 'launch',
      description: 'Verify system health after deployment',
      status: 'pending',
      priority: 'critical',
      estimatedTime: 1,
      dependencies: ['launch-001']
    },
    {
      id: 'launch-003',
      name: 'User Access Verification',
      category: 'launch',
      description: 'Verify all user accounts and permissions',
      status: 'pending',
      priority: 'high',
      estimatedTime: 1,
      dependencies: ['launch-002']
    },

    // Post-Launch Checklist
    {
      id: 'post-001',
      name: 'Performance Monitoring',
      category: 'post-launch',
      description: 'Monitor system performance for 24 hours',
      status: 'pending',
      priority: 'high',
      estimatedTime: 24,
      dependencies: ['launch-003']
    },
    {
      id: 'post-002',
      name: 'User Support Activation',
      category: 'post-launch',
      description: 'Activate user support channels and monitoring',
      status: 'pending',
      priority: 'high',
      estimatedTime: 2,
      dependencies: ['launch-003']
    },
    {
      id: 'post-003',
      name: 'Go-Live Confirmation',
      category: 'post-launch',
      description: 'Send go-live confirmation to stakeholders',
      status: 'pending',
      priority: 'medium',
      estimatedTime: 1,
      dependencies: ['post-001', 'post-002']
    }
  ];

  const defaultRollbackPlans: RollbackPlan[] = [
    {
      id: 'rb-001',
      name: 'Database Rollback',
      description: 'Rollback database to previous stable version',
      triggerConditions: ['Data corruption detected', 'Critical bugs found', 'Performance degradation'],
      steps: [
        'Stop application services',
        'Restore database from backup',
        'Verify data integrity',
        'Restart application services',
        'Run health checks'
      ],
      estimatedTime: 30,
      riskLevel: 'high',
      status: 'approved'
    },
    {
      id: 'rb-002',
      name: 'Application Rollback',
      description: 'Rollback application to previous version',
      triggerConditions: ['Application crashes', 'Security vulnerabilities', 'User complaints'],
      steps: [
        'Deploy previous application version',
        'Update configuration files',
        'Restart services',
        'Verify functionality',
        'Monitor system health'
      ],
      estimatedTime: 15,
      riskLevel: 'medium',
      status: 'approved'
    }
  ];

  useEffect(() => {
    setChecklistItems(defaultChecklistItems);
    setRollbackPlans(defaultRollbackPlans);
  }, []);

  const updateChecklistStatus = (itemId: string, status: GoLiveChecklist['status'], notes?: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status, 
            notes,
            completedAt: status === 'completed' ? new Date() : undefined
          }
        : item
    ));
  };

  const executeGoLiveWorkflow = async () => {
    setIsExecutingWorkflow(true);
    
    // Simulate go-live workflow execution
    const workflowSteps = [
      'Pre-launch validation...',
      'Database backup creation...',
      'Environment preparation...',
      'Deployment execution...',
      'Health checks...',
      'User access verification...',
      'Go-live confirmation...'
    ];

    for (const step of workflowSteps) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(step);
    }
    
    setIsExecutingWorkflow(false);
  };

  const exportGoLivePlan = () => {
    const data = {
      checklistItems,
      rollbackPlans,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `go-live-plan-${new Date().toISOString().split('T')[0]}.json`;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pre-launch': return <Clock className="w-4 h-4" />;
      case 'launch': return <Rocket className="w-4 h-4" />;
      case 'post-launch': return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const metrics: GoLiveMetrics = {
    totalChecklistItems: checklistItems.length,
    completedItems: checklistItems.filter(item => item.status === 'completed').length,
    inProgressItems: checklistItems.filter(item => item.status === 'in-progress').length,
    failedItems: checklistItems.filter(item => item.status === 'failed').length,
    completionRate: checklistItems.length > 0 ? (checklistItems.filter(item => item.status === 'completed').length / checklistItems.length) * 100 : 0,
    criticalItemsRemaining: checklistItems.filter(item => item.priority === 'critical' && item.status !== 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Go-Live Procedures</h2>
          <p className="text-gray-600">Manage launch checklists, rollback plans, and go-live workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={executeGoLiveWorkflow}
            disabled={isExecutingWorkflow}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
              isExecutingWorkflow
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            )}
          >
            {isExecutingWorkflow ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isExecutingWorkflow ? 'Executing...' : 'Execute Go-Live'}
          </button>
          <button
            onClick={exportGoLivePlan}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Plan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'checklist', name: 'Checklist', icon: FileText },
            { id: 'rollback', name: 'Rollback Plans', icon: ArrowLeft },
            { id: 'workflow', name: 'Workflow', icon: Play },
            { id: 'approval', name: 'Approval', icon: CheckCircle }
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
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalChecklistItems}</p>
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
                  <p className="text-2xl font-bold text-green-600">{metrics.completedItems}</p>
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
                  <p className="text-2xl font-bold text-blue-600">{metrics.inProgressItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Critical Remaining</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.criticalItemsRemaining}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Go-Live Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Overall Progress</span>
                  <span>{metrics.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['pre-launch', 'launch', 'post-launch'].map((category) => {
                  const categoryItems = checklistItems.filter(item => item.category === category);
                  const completed = categoryItems.filter(item => item.status === 'completed').length;
                  const total = categoryItems.length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;
                  
                  return (
                    <div key={category} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{percentage.toFixed(0)}%</div>
                      <div className="text-sm text-gray-600 capitalize">{category.replace('-', ' ')}</div>
                      <div className="text-xs text-gray-500">{completed}/{total} items</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Critical Items */}
          {metrics.criticalItemsRemaining > 0 && (
            <div className="bg-white p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Critical Items Requiring Attention
              </h3>
              <div className="space-y-3">
                {checklistItems
                  .filter(item => item.priority === 'critical' && item.status !== 'completed')
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-red-900">{item.name}</p>
                        <p className="text-sm text-red-700">{item.description}</p>
                      </div>
                      <button
                        onClick={() => updateChecklistStatus(item.id, 'in-progress')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Start Item
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(item.category)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getPriorityColor(item.priority)
                    )}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(item.status)
                    )}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-gray-900 capitalize">{item.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Estimated Time</p>
                    <p className="text-gray-900">{item.estimatedTime} hours</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className="text-gray-900">{item.status}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {item.assignedTo && `Assigned to: ${item.assignedTo}`}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.status === 'pending' && (
                      <button
                        onClick={() => updateChecklistStatus(item.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Item
                      </button>
                    )}
                    
                    {item.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => updateChecklistStatus(item.id, 'completed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateChecklistStatus(item.id, 'failed')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Mark Failed
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="text-sm text-gray-700">
                      <strong>Notes:</strong> {item.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rollback Plans Tab */}
      {activeTab === 'rollback' && (
        <div className="space-y-4">
          {rollbackPlans.map((plan) => (
            <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  plan.status === 'ready' ? 'text-green-600 bg-green-50 border-green-200' :
                  plan.status === 'approved' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  'text-gray-600 bg-gray-50 border-gray-200'
                )}>
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trigger Conditions</h4>
                  <ul className="space-y-1">
                    {plan.triggerConditions.map((condition, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <AlertTriangle className="w-3 h-3 text-orange-500 mr-2" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rollback Steps</h4>
                  <ol className="space-y-1">
                    {plan.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Estimated Time: {plan.estimatedTime} minutes</span>
                  <span>Risk Level: {plan.riskLevel}</span>
                </div>
                
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Execute Rollback
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Go-Live Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Pre-Launch Validation</h4>
                  <p className="text-sm text-gray-600">Complete all pre-launch checklist items</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Launch Execution</h4>
                  <p className="text-sm text-gray-600">Execute deployment and verify system health</p>
                </div>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Post-Launch Monitoring</h4>
                  <p className="text-sm text-gray-600">Monitor system performance and user feedback</p>
                </div>
                <Square className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Controls</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={executeGoLiveWorkflow}
                disabled={isExecutingWorkflow}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2",
                  isExecutingWorkflow
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                )}
              >
                {isExecutingWorkflow ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isExecutingWorkflow ? 'Executing Workflow...' : 'Start Go-Live Workflow'}
              </button>

              <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center gap-2">
                <Pause className="w-4 h-4" />
                Pause Workflow
              </button>

              <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Rollback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Tab */}
      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Go-Live Approval Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-green-900">Technical Team</h4>
                    <p className="text-sm text-green-700">All technical requirements met</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Approved</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Business Stakeholders</h4>
                    <p className="text-sm text-yellow-700">Pending business approval</p>
                  </div>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Pending</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Square className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">Legal & Compliance</h4>
                    <p className="text-sm text-gray-700">Not yet reviewed</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">Not Started</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Final Approval</h3>
            <p className="text-gray-600 mb-4">
              All approvals must be completed before proceeding with go-live. 
              Ensure all stakeholders have reviewed and approved the launch plan.
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Request Final Approval
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoLiveProcedures;

