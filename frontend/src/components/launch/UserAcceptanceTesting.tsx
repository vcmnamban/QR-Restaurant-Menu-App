import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Play,
  Square,
  RefreshCw,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Star,
  Calendar,
  User,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '@/utils';

interface TestCase {
  id: string;
  title: string;
  description: string;
  category: 'authentication' | 'restaurant' | 'menu' | 'order' | 'payment' | 'customer' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'passed' | 'failed' | 'blocked';
  assignedTo?: string;
  estimatedTime: number;
  actualTime?: number;
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface UATSession {
  id: string;
  name: string;
  description: string;
  participants: string[];
  startDate: Date;
  endDate?: Date;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  testCases: string[];
  progress: number;
  notes?: string;
}

interface UserFeedback {
  id: string;
  testCaseId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  category: 'usability' | 'functionality' | 'performance' | 'design' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: Date;
  resolvedAt?: Date;
}

const UserAcceptanceTesting: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [uatSessions, setUatSessions] = useState<UATSession[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'test-cases' | 'sessions' | 'feedback' | 'reports'>('dashboard');
  const [selectedTestCase, setSelectedTestCase] = useState<string>('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const defaultTestCases: TestCase[] = [
    {
      id: 'tc-001',
      title: 'User Login and Authentication',
      description: 'Test user login functionality with valid and invalid credentials',
      category: 'authentication',
      priority: 'critical',
      status: 'pending',
      estimatedTime: 30,
      steps: [
        'Navigate to login page',
        'Enter valid email and password',
        'Click login button',
        'Verify successful login and redirect'
      ],
      expectedResult: 'User should be logged in and redirected to dashboard',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tc-002',
      title: 'Restaurant Creation',
      description: 'Test restaurant creation workflow with all required fields',
      category: 'restaurant',
      priority: 'high',
      status: 'pending',
      estimatedTime: 45,
      steps: [
        'Navigate to restaurant management',
        'Click "Add New Restaurant"',
        'Fill in all required fields',
        'Submit the form',
        'Verify restaurant is created successfully'
      ],
      expectedResult: 'Restaurant should be created and visible in the list',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tc-003',
      title: 'Menu Item Addition',
      description: 'Test adding new menu items to existing categories',
      category: 'menu',
      priority: 'high',
      status: 'pending',
      estimatedTime: 40,
      steps: [
        'Navigate to menu management',
        'Select a category',
        'Click "Add New Item"',
        'Fill in item details',
        'Upload item image',
        'Save the item'
      ],
      expectedResult: 'Menu item should be added and visible in the category',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tc-004',
      title: 'Order Processing',
      description: 'Test complete order workflow from creation to completion',
      category: 'order',
      priority: 'critical',
      status: 'pending',
      estimatedTime: 60,
      steps: [
        'Create a new order',
        'Add menu items to order',
        'Set delivery details',
        'Process payment',
        'Verify order confirmation'
      ],
      expectedResult: 'Order should be processed successfully with confirmation',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'tc-005',
      title: 'Payment Integration',
      description: 'Test payment processing with various payment methods',
      category: 'payment',
      priority: 'critical',
      status: 'pending',
      estimatedTime: 50,
      steps: [
        'Select payment method',
        'Enter payment details',
        'Process payment',
        'Verify payment confirmation',
        'Check transaction record'
      ],
      expectedResult: 'Payment should be processed and recorded correctly',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const defaultUATSessions: UATSession[] = [
    {
      id: 'uat-001',
      name: 'Phase 3 Core Features Testing',
      description: 'Comprehensive testing of restaurant, menu, and order management features',
      participants: ['Restaurant Owner', 'Manager', 'Staff Member'],
      startDate: new Date(),
      status: 'planned',
      testCases: ['tc-001', 'tc-002', 'tc-003', 'tc-004'],
      progress: 0
    }
  ];

  useEffect(() => {
    setTestCases(defaultTestCases);
    setUatSessions(defaultUATSessions);
  }, []);

  const updateTestCaseStatus = (testCaseId: string, status: TestCase['status'], notes?: string) => {
    setTestCases(prev => prev.map(tc => 
      tc.id === testCaseId 
        ? { 
            ...tc, 
            status, 
            notes,
            updatedAt: new Date(),
            completedAt: status === 'passed' || status === 'failed' ? new Date() : undefined
          }
        : tc
    ));
  };

  const createUATSession = (sessionData: Omit<UATSession, 'id' | 'progress'>) => {
    const newSession: UATSession = {
      ...sessionData,
      id: `uat-${Date.now()}`,
      progress: 0
    };
    setUatSessions(prev => [...prev, newSession]);
    setIsCreatingSession(false);
  };

  const addUserFeedback = (feedback: Omit<UserFeedback, 'id' | 'createdAt'>) => {
    const newFeedback: UserFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      createdAt: new Date()
    };
    setUserFeedback(prev => [...prev, newFeedback]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'blocked': return 'text-orange-600 bg-orange-50 border-orange-200';
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      authentication: 'bg-blue-100 text-blue-800',
      restaurant: 'bg-green-100 text-green-800',
      menu: 'bg-purple-100 text-purple-800',
      order: 'bg-orange-100 text-orange-800',
      payment: 'bg-indigo-100 text-indigo-800',
      customer: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const exportTestResults = () => {
    const data = {
      testCases,
      uatSessions,
      userFeedback,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uat-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = {
    totalTestCases: testCases.length,
    passedTestCases: testCases.filter(tc => tc.status === 'passed').length,
    failedTestCases: testCases.filter(tc => tc.status === 'failed').length,
    inProgressTestCases: testCases.filter(tc => tc.status === 'in-progress').length,
    totalUATSessions: uatSessions.length,
    activeSessions: uatSessions.filter(s => s.status === 'active').length,
    totalFeedback: userFeedback.length,
    openFeedback: userFeedback.filter(f => f.status === 'open').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Acceptance Testing</h2>
          <p className="text-gray-600">Manage UAT sessions, test cases, and user feedback</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreatingSession(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New UAT Session
          </button>
          <button
            onClick={exportTestResults}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'test-cases', name: 'Test Cases', icon: FileText },
            { id: 'sessions', name: 'UAT Sessions', icon: Users },
            { id: 'feedback', name: 'User Feedback', icon: MessageSquare },
            { id: 'reports', name: 'Reports', icon: Download }
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
                  <p className="text-sm font-medium text-gray-600">Total Test Cases</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTestCases}</p>
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
                  <p className="text-2xl font-bold text-green-600">{metrics.passedTestCases}</p>
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
                  <p className="text-2xl font-bold text-red-600">{metrics.failedTestCases}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.activeSessions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Testing Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Overall Progress</span>
                  <span>{metrics.totalTestCases > 0 ? Math.round((metrics.passedTestCases / metrics.totalTestCases) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.totalTestCases > 0 ? (metrics.passedTestCases / metrics.totalTestCases) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{metrics.passedTestCases}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{metrics.failedTestCases}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.inProgressTestCases}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{metrics.totalTestCases - metrics.passedTestCases - metrics.failedTestCases - metrics.inProgressTestCases}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {testCases
                .filter(tc => tc.status !== 'pending')
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 5)
                .map((testCase) => (
                  <div key={testCase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getStatusColor(testCase.status)
                      )}>
                        {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{testCase.title}</p>
                        <p className="text-sm text-gray-600">{testCase.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {testCase.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Cases Tab */}
      {activeTab === 'test-cases' && (
        <div className="space-y-4">
          {testCases.map((testCase) => (
            <div key={testCase.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{testCase.title}</h3>
                      <p className="text-gray-600">{testCase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getPriorityColor(testCase.priority)
                    )}>
                      {testCase.priority.charAt(0).toUpperCase() + testCase.priority.slice(1)}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(testCase.status)
                    )}>
                      {testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getCategoryColor(testCase.category)
                    )}>
                      {testCase.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Test Steps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {testCase.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expected Result</h4>
                    <p className="text-sm text-gray-600">{testCase.expectedResult}</p>
                    
                    {testCase.actualResult && (
                      <>
                        <h4 className="font-medium text-gray-900 mb-2 mt-4">Actual Result</h4>
                        <p className="text-sm text-gray-600">{testCase.actualResult}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Estimated: {testCase.estimatedTime} min
                    </span>
                    {testCase.actualTime && (
                      <span className="text-sm text-gray-500">
                        | Actual: {testCase.actualTime} min
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {testCase.status === 'pending' && (
                      <button
                        onClick={() => updateTestCaseStatus(testCase.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Test
                      </button>
                    )}
                    
                    {testCase.status === 'in-progress' && (
                      <>
                        <button
                          onClick={() => updateTestCaseStatus(testCase.id, 'passed')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Passed
                        </button>
                        <button
                          onClick={() => updateTestCaseStatus(testCase.id, 'failed')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Mark Failed
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UAT Sessions Tab */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {uatSessions.map((session) => (
            <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{session.name}</h3>
                  <p className="text-gray-600">{session.description}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  session.status === 'active' ? 'text-green-600 bg-green-50 border-green-200' :
                  session.status === 'completed' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  session.status === 'cancelled' ? 'text-red-600 bg-red-50 border-red-200' :
                  'text-gray-600 bg-gray-50 border-gray-200'
                )}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participants</p>
                  <p className="text-gray-900">{session.participants.join(', ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="text-gray-900">{session.startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-gray-900">{session.progress}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Test Cases: {session.testCases.length}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {userFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedback Yet</h3>
              <p className="text-gray-600">User feedback will appear here as testing progresses</p>
            </div>
          ) : (
            userFeedback.map((feedback) => (
              <div key={feedback.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getPriorityColor(feedback.priority)
                    )}>
                      {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                    </span>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    feedback.status === 'open' ? 'text-red-600 bg-red-50 border-red-200' :
                    feedback.status === 'resolved' ? 'text-green-600 bg-green-50 border-green-200' :
                    'text-blue-600 bg-blue-50 border-blue-200'
                  )}>
                    {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-900">{feedback.feedback}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Category: {feedback.category}</span>
                  <span>{feedback.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Test Execution Report</h4>
                <p className="text-sm text-gray-600">Detailed report of all test case executions</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">UAT Session Report</h4>
                <p className="text-sm text-gray-600">Summary of UAT sessions and progress</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Feedback Analysis</h4>
                <p className="text-sm text-gray-600">Analysis of user feedback and ratings</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
                <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-medium text-gray-900">Performance Summary</h4>
                <p className="text-sm text-gray-600">Overall testing performance metrics</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAcceptanceTesting;
