import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  BookOpen, 
  Code, 
  Users, 
  Download,
  Eye,
  Edit,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Database,
  Server
} from 'lucide-react';
import { cn } from '@/utils';

interface DocumentationTemplate {
  id: string;
  name: string;
  type: 'user-manual' | 'admin-guide' | 'api-docs' | 'training-materials';
  description: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  version: string;
  lastUpdated: Date;
  author: string;
  sections: DocumentationSection[];
  estimatedTime: number;
  actualTime?: number;
}

interface DocumentationSection {
  id: string;
  title: string;
  content: string;
  order: number;
  isRequired: boolean;
  status: 'pending' | 'in-progress' | 'completed';
}

interface DocumentationMetrics {
  totalTemplates: number;
  publishedDocs: number;
  inReviewDocs: number;
  draftDocs: number;
  completionRate: number;
}

const DocumentationGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<DocumentationTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'templates' | 'generator' | 'review' | 'publish'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultTemplates: DocumentationTemplate[] = [
    {
      id: 'doc-001',
      name: 'Restaurant Owner User Manual',
      type: 'user-manual',
      description: 'Comprehensive guide for restaurant owners to manage their QR menu system',
      status: 'draft',
      version: '1.0.0',
      lastUpdated: new Date(),
      author: 'Development Team',
      estimatedTime: 8,
      sections: [
        {
          id: 'sec-001',
          title: 'Getting Started',
          content: 'Welcome to your QR Restaurant Menu System. This guide will help you get started with managing your restaurant\'s digital menu.',
          order: 1,
          isRequired: true,
          status: 'completed'
        },
        {
          id: 'sec-002',
          title: 'Restaurant Setup',
          content: 'Learn how to set up your restaurant profile, including basic information, contact details, and business hours.',
          order: 2,
          isRequired: true,
          status: 'in-progress'
        },
        {
          id: 'sec-003',
          title: 'Menu Management',
          content: 'Create and manage your menu items, categories, pricing, and special offers.',
          order: 3,
          isRequired: true,
          status: 'pending'
        },
        {
          id: 'sec-004',
          title: 'QR Code Generation',
          content: 'Generate and manage QR codes for your tables and promotional materials.',
          order: 4,
          isRequired: true,
          status: 'pending'
        },
        {
          id: 'sec-005',
          title: 'Order Management',
          content: 'Monitor incoming orders, update order status, and manage customer communications.',
          order: 5,
          isRequired: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'doc-002',
      name: 'System Administrator Guide',
      type: 'admin-guide',
      description: 'Technical documentation for system administrators and IT staff',
      status: 'draft',
      version: '1.0.0',
      lastUpdated: new Date(),
      author: 'Development Team',
      estimatedTime: 6,
      sections: [
        {
          id: 'sec-006',
          title: 'System Architecture',
          content: 'Overview of the system architecture, including backend services, database design, and API structure.',
          order: 1,
          isRequired: true,
          status: 'completed'
        },
        {
          id: 'sec-007',
          title: 'Installation & Deployment',
          content: 'Step-by-step guide for installing and deploying the system in production environments.',
          order: 2,
          isRequired: true,
          status: 'in-progress'
        },
        {
          id: 'sec-008',
          title: 'Configuration Management',
          content: 'System configuration options, environment variables, and customization settings.',
          order: 3,
          isRequired: true,
          status: 'pending'
        },
        {
          id: 'sec-009',
          title: 'Monitoring & Maintenance',
          content: 'System monitoring, logging, backup procedures, and routine maintenance tasks.',
          order: 4,
          isRequired: true,
          status: 'pending'
        }
      ]
    },
    {
      id: 'doc-003',
      name: 'API Documentation',
      type: 'api-docs',
      description: 'Comprehensive API reference for developers integrating with the system',
      status: 'draft',
      version: '1.0.0',
      lastUpdated: new Date(),
      author: 'Development Team',
      estimatedTime: 4,
      sections: [
        {
          id: 'sec-010',
          title: 'Authentication',
          content: 'API authentication methods, including JWT tokens and API keys.',
          order: 1,
          isRequired: true,
          status: 'completed'
        },
        {
          id: 'sec-011',
          title: 'Restaurant Endpoints',
          content: 'Complete reference for restaurant management API endpoints.',
          order: 2,
          isRequired: true,
          status: 'in-progress'
        },
        {
          id: 'sec-012',
          title: 'Menu Endpoints',
          content: 'API endpoints for menu management operations.',
          order: 3,
          isRequired: true,
          status: 'pending'
        },
        {
          id: 'sec-013',
          title: 'Order Endpoints',
          content: 'Order processing and management API endpoints.',
          order: 4,
          isRequired: true,
          status: 'pending'
        }
      ]
    }
  ];

  useEffect(() => {
    setTemplates(defaultTemplates);
  }, []);

  const updateSectionStatus = (templateId: string, sectionId: string, status: DocumentationSection['status']) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? {
            ...template,
            sections: template.sections.map(section =>
              section.id === sectionId 
                ? { ...section, status }
                : section
            )
          }
        : template
    ));
  };

  const generateDocumentation = async (templateId: string) => {
    setIsGenerating(true);
    
    // Simulate documentation generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, status: 'review' as const }
        : template
    ));
    
    setIsGenerating(false);
  };

  const publishDocumentation = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, status: 'published' as const }
        : template
    ));
  };

  const exportDocumentation = (template: DocumentationTemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-${template.version}.json`;
    link.click();
    URL.revokeObjectURL(url);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user-manual': return <BookOpen className="w-4 h-4" />;
      case 'admin-guide': return <Settings className="w-4 h-4" />;
      case 'api-docs': return <Code className="w-4 h-4" />;
      case 'training-materials': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'user-manual': 'bg-blue-100 text-blue-800',
      'admin-guide': 'bg-purple-100 text-purple-800',
      'api-docs': 'bg-green-100 text-green-800',
      'training-materials': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const metrics: DocumentationMetrics = {
    totalTemplates: templates.length,
    publishedDocs: templates.filter(t => t.status === 'published').length,
    inReviewDocs: templates.filter(t => t.status === 'review').length,
    draftDocs: templates.filter(t => t.status === 'draft').length,
    completionRate: templates.length > 0 ? (templates.filter(t => t.status === 'published').length / templates.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentation Generator</h2>
          <p className="text-gray-600">Generate and manage comprehensive documentation for your system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'templates', name: 'Templates', icon: FileText },
            { id: 'generator', name: 'Generator', icon: RefreshCw },
            { id: 'review', name: 'Review', icon: Eye },
            { id: 'publish', name: 'Publish', icon: CheckCircle }
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
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalTemplates}</p>
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
                  <p className="text-2xl font-bold text-green-600">{metrics.publishedDocs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics.inReviewDocs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft</p>
                  <p className="text-2xl font-bold text-gray-600">{metrics.draftDocs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documentation Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                  <span>Overall Completion</span>
                  <span>{metrics.completionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${metrics.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['user-manual', 'admin-guide', 'api-docs', 'training-materials'].map((type) => {
                  const typeTemplates = templates.filter(t => t.type === type);
                  const published = typeTemplates.filter(t => t.status === 'published').length;
                  const total = typeTemplates.length;
                  const percentage = total > 0 ? (published / total) * 100 : 0;
                  
                  return (
                    <div key={type} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{percentage.toFixed(0)}%</div>
                      <div className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}</div>
                      <div className="text-xs text-gray-500">{published}/{total} docs</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {templates
                .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
                .slice(0, 5)
                .map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(template.type)}
                      <div>
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-600">v{template.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getStatusColor(template.status)
                      )}>
                        {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {template.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(template.type)}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-gray-600">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getTypeColor(template.type)
                    )}>
                      {template.type.replace('-', ' ')}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      getStatusColor(template.status)
                    )}>
                      {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">v{template.version}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Author</p>
                    <p className="text-gray-900">{template.author}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Updated</p>
                    <p className="text-gray-900">{template.lastUpdated.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sections</p>
                    <p className="text-gray-900">{template.sections.length} sections</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Estimated: {template.estimatedTime} hours
                    </span>
                    {template.actualTime && (
                      <span className="text-sm text-gray-500">
                        | Actual: {template.actualTime} hours
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => exportDocumentation(template)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </button>
                    
                    {template.status === 'draft' && (
                      <button
                        onClick={() => generateDocumentation(template.id)}
                        disabled={isGenerating}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generator Tab */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Auto-Generation Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">User Manual</h4>
                <p className="text-sm text-gray-600">Generate comprehensive user manual with screenshots</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                <Settings className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Admin Guide</h4>
                <p className="text-sm text-gray-600">Create technical admin documentation</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                <Code className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">API Docs</h4>
                <p className="text-sm text-gray-600">Generate interactive API documentation</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
                <Users className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-medium text-gray-900">Training Materials</h4>
                <p className="text-sm text-gray-600">Create video tutorials and training guides</p>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generation Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include Screenshots
                </label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Include Code Examples
                </label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>English</option>
                  <option>Arabic</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {templates.filter(t => t.status === 'review').map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-gray-600">{template.description}</p>
                </div>
                <span className="text-sm text-gray-500">v{template.version}</span>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Sections to Review</h4>
                <div className="space-y-2">
                  {template.sections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{section.title}</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        section.status === 'completed' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                      )}>
                        {section.status === 'completed' ? 'Ready' : 'Needs Review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Author: {template.author}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-yellow-600 text-white rounded text-sm font-medium hover:bg-yellow-700 transition-colors">
                    Request Changes
                  </button>
                  <button
                    onClick={() => publishDocumentation(template.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Approve & Publish
                  </button>
                </div>
              </div>
            </div>
          ))}

          {templates.filter(t => t.status === 'review').length === 0 && (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents in Review</h3>
              <p className="text-gray-600">Documents will appear here when they are ready for review</p>
            </div>
          )}
        </div>
      )}

      {/* Publish Tab */}
      {activeTab === 'publish' && (
        <div className="space-y-4">
          {templates.filter(t => t.status === 'published').map((template) => (
            <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                    <p className="text-gray-600">{template.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">v{template.version}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published Date</p>
                  <p className="text-gray-900">{template.lastUpdated.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Author</p>
                  <p className="text-gray-900">{template.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Sections</p>
                  <p className="text-gray-900">{template.sections.length} sections</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-green-600 font-medium">
                  ✓ Published and Available
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => exportDocumentation(template)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </button>
                  <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors">
                    <Globe className="w-3 h-3 mr-1" />
                    View Online
                  </button>
                </div>
              </div>
            </div>
          ))}

          {templates.filter(t => t.status === 'published').length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Published Documents</h3>
              <p className="text-gray-600">Published documents will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentationGenerator;
