import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Rocket, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Monitor,
  Users,
  FileText,
  Download,
  Play,
  Square,
  RefreshCw,
  Database,
  Server,
  Globe,
  Shield,
  Zap,
  BarChart3,
  GitBranch,
  Package,
  Cloud,
  Terminal,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/utils';
import PerformanceMonitoring from '@/components/launch/PerformanceMonitoring';
import UserAcceptanceTesting from '@/components/launch/UserAcceptanceTesting';
import DocumentationGenerator from '@/components/launch/DocumentationGenerator';
import GoLiveProcedures from '@/components/launch/GoLiveProcedures';
import SupportTrainingSystem from '@/components/launch/SupportTrainingSystem';
import ProductionDeployment from '@/components/launch/ProductionDeployment';
import FinalIntegrationTesting from '@/components/launch/FinalIntegrationTesting';
import ProductionEnvironmentSetup from '@/components/launch/ProductionEnvironmentSetup';
import GoLiveExecution from '@/components/launch/GoLiveExecution';

interface LaunchTask {
  id: string;
  name: string;
  category: 'deployment' | 'performance' | 'testing' | 'documentation' | 'go-live';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedTime: string;
  assignedTo?: string;
  dependencies?: string[];
  completedAt?: Date;
  notes?: string;
}

interface LaunchMetrics {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  completionRate: number;
  criticalTasksRemaining: number;
}

const LaunchPreparationPage: React.FC = () => {
  const [tasks, setTasks] = useState<LaunchTask[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deployment' | 'performance' | 'testing' | 'documentation' | 'go-live' | 'monitoring' | 'uat' | 'integration' | 'env-setup' | 'go-live-execution'>('dashboard');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [isRunningChecks, setIsRunningChecks] = useState(false);

  const launchTasks: LaunchTask[] = [
    // Deployment Preparation
    {
      id: 'deploy-prep-1',
      name: 'Production Environment Setup',
      category: 'deployment',
      status: 'pending',
      priority: 'critical',
      description: 'Set up production servers, databases, and infrastructure',
      estimatedTime: '4-6 hours',
      dependencies: []
    },
    {
      id: 'deploy-prep-2',
      name: 'Environment Variables Configuration',
      category: 'deployment',
      status: 'pending',
      priority: 'critical',
      description: 'Configure production environment variables and secrets',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-1']
    },
    {
      id: 'deploy-prep-3',
      name: 'SSL Certificate Setup',
      category: 'deployment',
      status: 'pending',
      priority: 'high',
      description: 'Install and configure SSL certificates for HTTPS',
      estimatedTime: '1-2 hours',
      dependencies: ['deploy-prep-1']
    },
    {
      id: 'deploy-prep-4',
      name: 'Database Migration Scripts',
      category: 'deployment',
      status: 'pending',
      priority: 'high',
      description: 'Prepare and test database migration scripts for production',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-2']
    },
    {
      id: 'deploy-prep-5',
      name: 'CI/CD Pipeline Configuration',
      category: 'deployment',
      status: 'pending',
      priority: 'high',
      description: 'Set up automated deployment pipeline',
      estimatedTime: '3-4 hours',
      dependencies: ['deploy-prep-1']
    },

    // Performance & Monitoring
    {
      id: 'perf-1',
      name: 'Performance Monitoring Setup',
      category: 'performance',
      status: 'pending',
      priority: 'high',
      description: 'Configure application performance monitoring (APM)',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-1']
    },
    {
      id: 'perf-2',
      name: 'Error Tracking & Logging',
      category: 'performance',
      status: 'pending',
      priority: 'high',
      description: 'Set up error tracking and centralized logging',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-1']
    },
    {
      id: 'perf-3',
      name: 'Database Performance Optimization',
      category: 'performance',
      status: 'pending',
      priority: 'medium',
      description: 'Optimize database queries and indexes for production',
      estimatedTime: '3-4 hours',
      dependencies: ['deploy-prep-4']
    },
    {
      id: 'perf-4',
      name: 'CDN Configuration',
      category: 'performance',
      status: 'pending',
      priority: 'medium',
      description: 'Configure CDN for static assets and media files',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-3']
    },
    {
      id: 'perf-5',
      name: 'Load Testing',
      category: 'performance',
      status: 'pending',
      priority: 'medium',
      description: 'Perform load testing to validate performance under stress',
      estimatedTime: '4-6 hours',
      dependencies: ['perf-1', 'perf-2']
    },

    // User Acceptance Testing
    {
      id: 'uat-1',
      name: 'UAT Environment Setup',
      category: 'testing',
      status: 'pending',
      priority: 'high',
      description: 'Set up user acceptance testing environment',
      estimatedTime: '2-3 hours',
      dependencies: ['deploy-prep-1']
    },
    {
      id: 'uat-2',
      name: 'Test Data Preparation',
      category: 'testing',
      status: 'pending',
      priority: 'medium',
      description: 'Prepare comprehensive test data for UAT',
      estimatedTime: '3-4 hours',
      dependencies: ['uat-1']
    },
    {
      id: 'uat-3',
      name: 'User Testing Scripts',
      category: 'testing',
      status: 'pending',
      priority: 'medium',
      description: 'Create detailed testing scripts for end users',
      estimatedTime: '2-3 hours',
      dependencies: ['uat-2']
    },
    {
      id: 'uat-4',
      name: 'Stakeholder Testing Sessions',
      category: 'testing',
      status: 'pending',
      priority: 'high',
      description: 'Conduct testing sessions with key stakeholders',
      estimatedTime: '6-8 hours',
      dependencies: ['uat-3']
    },
    {
      id: 'uat-5',
      name: 'Bug Fixes & Validation',
      category: 'testing',
      status: 'pending',
      priority: 'high',
      description: 'Fix identified issues and validate fixes',
      estimatedTime: '4-8 hours',
      dependencies: ['uat-4']
    },

    // Documentation
    {
      id: 'doc-1',
      name: 'User Manual Creation',
      category: 'documentation',
      status: 'pending',
      priority: 'medium',
      description: 'Create comprehensive user manual for restaurant owners',
      estimatedTime: '8-12 hours',
      dependencies: []
    },
    {
      id: 'doc-2',
      name: 'Admin Guide Development',
      category: 'documentation',
      status: 'pending',
      priority: 'medium',
      description: 'Develop detailed admin and technical documentation',
      estimatedTime: '6-8 hours',
      dependencies: []
    },
    {
      id: 'doc-3',
      name: 'API Documentation',
      category: 'documentation',
      status: 'pending',
      priority: 'medium',
      description: 'Create comprehensive API documentation',
      estimatedTime: '4-6 hours',
      dependencies: []
    },
    {
      id: 'doc-4',
      name: 'Training Materials',
      category: 'documentation',
      status: 'pending',
      priority: 'medium',
      description: 'Prepare training materials and video tutorials',
      estimatedTime: '6-8 hours',
      dependencies: ['doc-1', 'doc-2']
    },

    // Go-Live Preparation
    {
      id: 'go-live-1',
      name: 'Go-Live Checklist Creation',
      category: 'go-live',
      status: 'pending',
      priority: 'critical',
      description: 'Create comprehensive go-live checklist',
      estimatedTime: '2-3 hours',
      dependencies: []
    },
    {
      id: 'go-live-2',
      name: 'Rollback Plan Development',
      category: 'go-live',
      status: 'pending',
      priority: 'critical',
      description: 'Develop detailed rollback and disaster recovery plan',
      estimatedTime: '3-4 hours',
      dependencies: ['go-live-1']
    },
    {
      id: 'go-live-3',
      name: 'Support Team Training',
      category: 'go-live',
      status: 'pending',
      priority: 'high',
      description: 'Train support team on new system',
      estimatedTime: '4-6 hours',
      dependencies: ['doc-4']
    },
    {
      id: 'go-live-4',
      name: 'Communication Plan',
      category: 'go-live',
      status: 'pending',
      priority: 'high',
      description: 'Develop communication plan for stakeholders',
      estimatedTime: '2-3 hours',
      dependencies: ['go-live-1']
    },
    {
      id: 'go-live-5',
      name: 'Final Go-Live Approval',
      category: 'go-live',
      status: 'pending',
      priority: 'critical',
      description: 'Obtain final approval from all stakeholders',
      estimatedTime: '1-2 hours',
      dependencies: ['go-live-2', 'go-live-3', 'go-live-4']
    }
  ];

  useEffect(() => {
    setTasks(launchTasks);
    loadTaskProgress();
  }, []);

  const loadTaskProgress = () => {
    const saved = localStorage.getItem('launch-tasks-progress');
    if (saved) {
      const savedTasks = JSON.parse(saved);
      setTasks(prev => prev.map(task => {
        const savedTask = savedTasks.find((t: LaunchTask) => t.id === task.id);
        return savedTask ? { ...task, ...savedTask } : task;
      }));
    }
  };

  const saveTaskProgress = (updatedTasks: LaunchTask[]) => {
    localStorage.setItem('launch-tasks-progress', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const updateTaskStatus = (taskId: string, status: LaunchTask['status'], notes?: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status, 
            notes,
            completedAt: status === 'completed' ? new Date() : undefined
          }
        : task
    );
    saveTaskProgress(updatedTasks);
    
    if (status === 'completed') {
      toast.success(`Task "${tasks.find(t => t.id === taskId)?.name}" completed!`);
    }
  };

  const runPreLaunchChecks = async () => {
    setIsRunningChecks(true);
    
    // Simulate various pre-launch checks
    const checks = [
      'Database connectivity',
      'API endpoints',
      'Payment gateway integration',
      'Email service',
      'File storage',
      'SSL certificates',
      'Performance metrics',
      'Security scan'
    ];

    for (const check of checks) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Running check: ${check}`);
    }

    setIsRunningChecks(false);
    toast.success('Pre-launch checks completed successfully!');
  };

  const exportLaunchPlan = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `launch-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'blocked': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'deployment': return <Server className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'testing': return <Users className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'go-live': return <Rocket className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const metrics: LaunchMetrics = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
    blockedTasks: tasks.filter(t => t.status === 'blocked').length,
    completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 : 0,
    criticalTasksRemaining: tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length
  };

  const filteredTasks = tasks.filter(task => 
    activeTab === 'dashboard' || task.category === activeTab
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-blue-600" />
            Launch Preparation
          </h1>
          <p className="text-gray-600 mt-2">
            Prepare your application for production launch with comprehensive planning and testing
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
                { id: 'deployment', name: 'Deployment', icon: Server },
                { id: 'performance', name: 'Performance', icon: Zap },
                { id: 'testing', name: 'Testing', icon: Users },
                { id: 'documentation', name: 'Documentation', icon: FileText },
                { id: 'go-live', name: 'Go-Live', icon: Rocket },
                { id: 'monitoring', name: 'Performance', icon: Zap },
                { id: 'uat', name: 'UAT', icon: Users },
                                 { id: 'training', name: 'Training', icon: GraduationCap },
                 { id: 'deployment', name: 'Deployment', icon: Server },
                 { id: 'integration', name: 'Integration', icon: GitBranch },
                 { id: 'env-setup', name: 'Environment Setup', icon: Database },
                 { id: 'go-live-execution', name: 'Go-Live Execution', icon: Rocket }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
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

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalTasks}</p>
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
                    <p className="text-2xl font-bold text-green-600">{metrics.completedTasks}</p>
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
                    <p className="text-2xl font-bold text-blue-600">{metrics.inProgressTasks}</p>
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
                    <p className="text-2xl font-bold text-red-600">{metrics.criticalTasksRemaining}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Launch Progress</h3>
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

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['deployment', 'performance', 'testing', 'documentation', 'go-live'].map((category) => {
                    const categoryTasks = tasks.filter(t => t.category === category);
                    const completed = categoryTasks.filter(t => t.status === 'completed').length;
                    const total = categoryTasks.length;
                    const percentage = total > 0 ? (completed / total) * 100 : 0;
                    
                    return (
                      <div key={category} className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{percentage.toFixed(0)}%</div>
                        <div className="text-sm text-gray-600 capitalize">{category}</div>
                        <div className="text-xs text-gray-500">{completed}/{total} tasks</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={runPreLaunchChecks}
                  disabled={isRunningChecks}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                    isRunningChecks
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isRunningChecks ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunningChecks ? 'Running Checks...' : 'Run Pre-Launch Checks'}
                </button>
                
                <button
                  onClick={exportLaunchPlan}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Launch Plan
                </button>

                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>

            {/* Critical Tasks */}
            {metrics.criticalTasksRemaining > 0 && (
              <div className="bg-white p-6 rounded-lg border border-red-200">
                <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Tasks Requiring Attention
                </h3>
                <div className="space-y-3">
                  {tasks
                    .filter(t => t.priority === 'critical' && t.status !== 'completed')
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <p className="font-medium text-red-900">{task.name}</p>
                          <p className="text-sm text-red-700">{task.description}</p>
                        </div>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Start Task
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <PerformanceMonitoring />
          </div>
        )}

        {/* User Acceptance Testing Tab */}
        {activeTab === 'uat' && (
          <div className="space-y-6">
            <UserAcceptanceTesting />
          </div>
        )}

        {/* Documentation Generator Tab */}
        {activeTab === 'documentation' && (
          <div className="space-y-6">
            <DocumentationGenerator />
          </div>
        )}

        {/* Go-Live Procedures Tab */}
        {activeTab === 'go-live' && (
          <div className="space-y-6">
            <GoLiveProcedures />
          </div>
        )}

        {/* Support Training System Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <SupportTrainingSystem />
          </div>
        )}

        {/* Production Deployment Tab */}
        {activeTab === 'deployment' && (
          <div className="space-y-6">
            <ProductionDeployment />
          </div>
        )}

        {/* Final Integration Testing Tab */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <FinalIntegrationTesting />
          </div>
        )}

        {/* Production Environment Setup Tab */}
        {activeTab === 'env-setup' && (
          <div className="space-y-6">
            <ProductionEnvironmentSetup />
          </div>
        )}

        {/* Go-Live Execution Tab */}
        {activeTab === 'go-live-execution' && (
          <div className="space-y-6">
            <GoLiveExecution />
          </div>
        )}

        {/* Category Tabs */}
        {activeTab !== 'dashboard' && activeTab !== 'monitoring' && activeTab !== 'uat' && activeTab !== 'documentation' && activeTab !== 'go-live' && activeTab !== 'training' && activeTab !== 'deployment' && activeTab !== 'integration' && activeTab !== 'env-setup' && activeTab !== 'go-live-execution' && (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{task.name}</h3>
                        <p className="text-gray-600">{task.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border",
                        getPriorityColor(task.priority)
                      )}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{task.estimatedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(task.category)}
                      <span className="text-sm text-gray-600 capitalize">{task.category}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in-progress')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Task
                        </button>
                      )}
                      
                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      
                      {task.status === 'completed' && (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed {task.completedAt?.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {task.notes && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {task.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchPreparationPage;
