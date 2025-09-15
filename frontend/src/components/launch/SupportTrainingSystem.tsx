import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  Download,
  Play,
  Square,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  User,
  Settings,
  BarChart3,
  GraduationCap,
  Headphones,
  Shield,
  Zap
} from 'lucide-react';
import { cn } from '@/utils';

interface TrainingMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'interactive' | 'assessment';
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'system-overview' | 'user-management' | 'order-processing' | 'payment-handling' | 'troubleshooting';
  status: 'draft' | 'review' | 'approved' | 'published';
  author: string;
  lastUpdated: Date;
  fileUrl?: string;
  tags: string[];
}

interface TrainingSession {
  id: string;
  title: string;
  description: string;
  trainer: string;
  participants: string[];
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  materials: string[];
  notes?: string;
  feedback?: TrainingFeedback[];
}

interface TrainingFeedback {
  id: string;
  participantId: string;
  participantName: string;
  rating: number;
  comments: string;
  submittedAt: Date;
}

interface SupportWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'billing' | 'user-access' | 'system-issues';
  steps: string[];
  estimatedTime: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTeam: string;
  status: 'active' | 'inactive' | 'archived';
}

interface TrainingMetrics {
  totalMaterials: number;
  publishedMaterials: number;
  totalSessions: number;
  completedSessions: number;
  averageRating: number;
  activeWorkflows: number;
}

const SupportTrainingSystem: React.FC = () => {
  const [trainingMaterials, setTrainingMaterials] = useState<TrainingMaterial[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [supportWorkflows, setSupportWorkflows] = useState<SupportWorkflow[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'materials' | 'sessions' | 'workflows' | 'feedback'>('dashboard');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const defaultTrainingMaterials: TrainingMaterial[] = [
    {
      id: 'tm-001',
      title: 'System Overview & Navigation',
      type: 'video',
      description: 'Complete overview of the QR Restaurant Menu App system',
      duration: 15,
      difficulty: 'beginner',
      category: 'system-overview',
      status: 'published',
      author: 'System Admin',
      lastUpdated: new Date('2024-01-15'),
      tags: ['overview', 'navigation', 'basics']
    },
    {
      id: 'tm-002',
      title: 'User Management & Permissions',
      type: 'interactive',
      description: 'Learn how to manage users, roles, and permissions',
      duration: 20,
      difficulty: 'intermediate',
      category: 'user-management',
      status: 'published',
      author: 'System Admin',
      lastUpdated: new Date('2024-01-16'),
      tags: ['users', 'roles', 'permissions']
    },
    {
      id: 'tm-003',
      title: 'Order Processing Workflow',
      type: 'document',
      description: 'Step-by-step guide to processing orders',
      duration: 25,
      difficulty: 'intermediate',
      category: 'order-processing',
      status: 'published',
      author: 'Operations Team',
      lastUpdated: new Date('2024-01-17'),
      tags: ['orders', 'workflow', 'processing']
    },
    {
      id: 'tm-004',
      title: 'Payment Handling & Refunds',
      type: 'video',
      description: 'Complete guide to payment processing and refunds',
      duration: 30,
      difficulty: 'advanced',
      category: 'payment-handling',
      status: 'review',
      author: 'Finance Team',
      lastUpdated: new Date('2024-01-18'),
      tags: ['payments', 'refunds', 'finance']
    },
    {
      id: 'tm-005',
      title: 'Common Issues & Troubleshooting',
      type: 'interactive',
      description: 'Interactive troubleshooting guide for common problems',
      duration: 20,
      difficulty: 'intermediate',
      category: 'troubleshooting',
      status: 'draft',
      author: 'Support Team',
      lastUpdated: new Date('2024-01-19'),
      tags: ['troubleshooting', 'support', 'issues']
    }
  ];

  const defaultTrainingSessions: TrainingSession[] = [
    {
      id: 'ts-001',
      title: 'New Support Team Onboarding',
      description: 'Comprehensive training for new support team members',
      trainer: 'Senior Support Lead',
      participants: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      scheduledDate: new Date('2024-02-01T10:00:00'),
      duration: 120,
      status: 'scheduled',
      materials: ['tm-001', 'tm-002', 'tm-003']
    },
    {
      id: 'ts-002',
      title: 'Advanced Payment Processing',
      description: 'Advanced training for payment handling and refunds',
      trainer: 'Finance Team Lead',
      participants: ['Sarah Wilson', 'David Brown'],
      scheduledDate: new Date('2024-02-05T14:00:00'),
      duration: 90,
      status: 'scheduled',
      materials: ['tm-004']
    }
  ];

  const defaultSupportWorkflows: SupportWorkflow[] = [
    {
      id: 'sw-001',
      name: 'User Access Issues',
      description: 'Standard workflow for resolving user access problems',
      category: 'user-access',
      steps: [
        'Verify user account status',
        'Check role permissions',
        'Reset password if needed',
        'Update user settings',
        'Confirm access restored'
      ],
      estimatedTime: 15,
      priority: 'medium',
      assignedTeam: 'Support Team',
      status: 'active'
    },
    {
      id: 'sw-002',
      name: 'Payment Processing Errors',
      description: 'Workflow for handling payment processing failures',
      category: 'technical',
      steps: [
        'Identify error type',
        'Check payment gateway status',
        'Verify transaction details',
        'Process manual payment if needed',
        'Update order status',
        'Notify customer'
      ],
      estimatedTime: 30,
      priority: 'high',
      assignedTeam: 'Technical Team',
      status: 'active'
    },
    {
      id: 'sw-003',
      name: 'System Performance Issues',
      description: 'Workflow for addressing system performance problems',
      category: 'system-issues',
      steps: [
        'Monitor system metrics',
        'Identify bottleneck',
        'Check resource usage',
        'Optimize configuration',
        'Test performance',
        'Document solution'
      ],
      estimatedTime: 60,
      priority: 'urgent',
      assignedTeam: 'Technical Team',
      status: 'active'
    }
  ];

  useEffect(() => {
    setTrainingMaterials(defaultTrainingMaterials);
    setTrainingSessions(defaultTrainingSessions);
    setSupportWorkflows(defaultSupportWorkflows);
  }, []);

  const updateMaterialStatus = (materialId: string, status: TrainingMaterial['status']) => {
    setTrainingMaterials(prev => prev.map(material => 
      material.id === materialId 
        ? { ...material, status, lastUpdated: new Date() }
        : material
    ));
  };

  const createTrainingSession = (sessionData: Omit<TrainingSession, 'id' | 'status'>) => {
    const newSession: TrainingSession = {
      ...sessionData,
      id: `ts-${Date.now()}`,
      status: 'scheduled'
    };
    setTrainingSessions(prev => [...prev, newSession]);
    setIsCreatingSession(false);
  };

  const updateSessionStatus = (sessionId: string, status: TrainingSession['status']) => {
    setTrainingSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, status } : session
    ));
  };

  const addWorkflowFeedback = (workflowId: string, feedback: Omit<TrainingFeedback, 'id' | 'submittedAt'>) => {
    const newFeedback: TrainingFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      submittedAt: new Date()
    };
    // Add feedback to appropriate session
    setTrainingSessions(prev => prev.map(session => 
      session.id === workflowId 
        ? { ...session, feedback: [...(session.feedback || []), newFeedback] }
        : session
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50 border-green-200';
      case 'approved': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system-overview': return <Eye className="w-4 h-4" />;
      case 'user-management': return <Users className="w-4 h-4" />;
      case 'order-processing': return <FileText className="w-4 h-4" />;
      case 'payment-handling': return <Shield className="w-4 h-4" />;
      case 'troubleshooting': return <Zap className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'interactive': return <Play className="w-4 h-4" />;
      case 'assessment': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const exportTrainingPlan = () => {
    const data = {
      trainingMaterials,
      trainingSessions,
      supportWorkflows,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `training-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics: TrainingMetrics = {
    totalMaterials: trainingMaterials.length,
    publishedMaterials: trainingMaterials.filter(m => m.status === 'published').length,
    totalSessions: trainingSessions.length,
    completedSessions: trainingSessions.filter(s => s.status === 'completed').length,
    averageRating: 4.2, // This would be calculated from actual feedback
    activeWorkflows: supportWorkflows.filter(w => w.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Training System</h2>
          <p className="text-gray-600">Manage training materials, sessions, and support workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreatingSession(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Session
          </button>
          <button
            onClick={exportTrainingPlan}
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
            { id: 'materials', name: 'Training Materials', icon: BookOpen },
            { id: 'sessions', name: 'Training Sessions', icon: GraduationCap },
            { id: 'workflows', name: 'Support Workflows', icon: Headphones },
            { id: 'feedback', name: 'Feedback', icon: MessageSquare }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Materials</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalMaterials}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.publishedMaterials}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Training Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.completedSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.averageRating}/5.0</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Headphones className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                  <p className="text-2xl font-bold text-indigo-600">{metrics.activeWorkflows}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Training Activity</h3>
            <div className="space-y-4">
              {trainingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{session.title}</p>
                      <p className="text-sm text-gray-600">
                        {session.participants.length} participants • {session.duration} minutes
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    session.status === 'completed' ? 'text-green-600 bg-green-50' :
                    session.status === 'in-progress' ? 'text-blue-600 bg-blue-50' :
                    session.status === 'scheduled' ? 'text-yellow-600 bg-yellow-50' :
                    'text-gray-600 bg-gray-50'
                  )}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Training Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-4">
          {trainingMaterials.map((material) => (
            <div key={material.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(material.type)}
                    {getCategoryIcon(material.category)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{material.title}</h3>
                      <p className="text-gray-600">{material.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getDifficultyColor(material.difficulty)
                    )}>
                      {material.difficulty.charAt(0).toUpperCase() + material.difficulty.slice(1)}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(material.status)
                    )}>
                      {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{material.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-gray-900 capitalize">{material.category.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Author</p>
                    <p className="text-gray-900">{material.author}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-gray-900">{material.lastUpdated.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {material.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                      View
                    </button>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                      Edit
                    </button>
                    {material.status === 'draft' && (
                      <button
                        onClick={() => updateMaterialStatus(material.id, 'review')}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition-colors"
                      >
                        Submit for Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Training Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {trainingSessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.title}</h3>
                    <p className="text-gray-600">{session.description}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    session.status === 'completed' ? 'text-green-600 bg-green-50 border-green-200' :
                    session.status === 'in-progress' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                    session.status === 'scheduled' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                    'text-gray-600 bg-gray-50 border-gray-200'
                  )}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trainer</p>
                    <p className="text-gray-900">{session.trainer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled</p>
                    <p className="text-gray-900">{session.scheduledDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Duration</p>
                    <p className="text-gray-900">{session.duration} minutes</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Participants ({session.participants.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {session.participants.map((participant, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {session.materials.length} training materials included
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {session.status === 'scheduled' && (
                      <button
                        onClick={() => updateSessionStatus(session.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Session
                      </button>
                    )}
                    
                    {session.status === 'in-progress' && (
                      <button
                        onClick={() => updateSessionStatus(session.id, 'completed')}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Complete Session
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Support Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-4">
          {supportWorkflows.map((workflow) => (
            <div key={workflow.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                  <p className="text-gray-600">{workflow.description}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  workflow.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' :
                  workflow.status === 'inactive' ? 'text-gray-600 bg-gray-50 border-gray-200' :
                  'text-red-600 bg-red-50 border-red-200'
                )}>
                  {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Workflow Steps</h4>
                  <ol className="space-y-1">
                    {workflow.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Workflow Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm text-gray-900 capitalize">{workflow.category.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estimated Time:</span>
                      <span className="text-sm text-gray-900">{workflow.estimatedTime} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Priority:</span>
                      <span className="text-sm text-gray-900 capitalize">{workflow.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Assigned Team:</span>
                      <span className="text-sm text-gray-900">{workflow.assignedTeam}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Workflow
                </button>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors">
                    Archive
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Training Feedback Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{metrics.averageRating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="flex items-center justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= metrics.averageRating ? "text-yellow-400 fill-current" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{metrics.completedSessions}</div>
                <div className="text-sm text-gray-600">Sessions Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{metrics.totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Feedback</h3>
            <div className="space-y-4">
              {trainingSessions
                .filter(session => session.feedback && session.feedback.length > 0)
                .slice(0, 5)
                .map((session) => (
                  <div key={session.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{session.title}</h4>
                    {session.feedback?.map((feedback) => (
                      <div key={feedback.id} className="ml-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{feedback.participantName}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-3 h-3",
                                  star <= feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{feedback.comments}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {feedback.submittedAt.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTrainingSystem;

