'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Building, 
  MapPin, 
  Clock, 
  FileText, 
  Sparkles,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Download
} from 'lucide-react';

// Interfaces
interface Tender {
  id: string;
  title: string;
  description: string;
  organization: string;
  location: string;
  budget: string;
  deadline: string;
  publishDate: string;
  category: string;
  status: 'open' | 'closing_soon' | 'closed';
  requirements: string[];
  documents: string[];
}

interface APIResponse {
  tenders: Tender[];
  total: number;
  page: number;
  hasMore: boolean;
}

interface ProposalData {
  tenderId: string;
  content: string;
  isGenerating: boolean;
}

// Mock API functions (replace with actual API calls)
const fetchTenders = async (page: number = 1, search: string = '', category: string = ''): Promise<APIResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockTenders: Tender[] = [
    {
      id: '1',
      title: 'Digital Infrastructure Modernization Project',
      description: 'Comprehensive upgrade of government digital infrastructure including cloud migration, cybersecurity implementation, and system integration.',
      organization: 'Department of Digital Services',
      location: 'Washington, DC',
      budget: '$2.5M - $5.0M',
      deadline: '2024-10-15',
      publishDate: '2024-09-01',
      category: 'Technology',
      status: 'open',
      requirements: ['Cloud Architecture Experience', 'Government Security Clearance', 'Agile Development'],
      documents: ['RFP_Digital_Infrastructure.pdf', 'Technical_Requirements.pdf']
    },
    {
      id: '2',
      title: 'Public Transportation Fleet Management System',
      description: 'Development and implementation of an integrated fleet management system for public buses and trains.',
      organization: 'Metropolitan Transport Authority',
      location: 'New York, NY',
      budget: '$1.2M - $2.8M',
      deadline: '2024-09-20',
      publishDate: '2024-08-15',
      category: 'Transportation',
      status: 'closing_soon',
      requirements: ['IoT Integration', 'Real-time Analytics', 'Mobile App Development'],
      documents: ['Fleet_Management_RFP.pdf', 'System_Specifications.pdf']
    },
    {
      id: '3',
      title: 'Smart City Environmental Monitoring Network',
      description: 'Implementation of IoT sensors and data analytics platform for environmental monitoring across the city.',
      organization: 'Environmental Protection Agency',
      location: 'San Francisco, CA',
      budget: '$800K - $1.5M',
      deadline: '2024-11-30',
      publishDate: '2024-09-05',
      category: 'Environment',
      status: 'open',
      requirements: ['IoT Sensor Networks', 'Data Visualization', 'Environmental Compliance'],
      documents: ['Environmental_Monitoring_RFP.pdf', 'Sensor_Specifications.pdf']
    },
    {
      id: '4',
      title: 'Healthcare Data Analytics Platform',
      description: 'Development of a comprehensive healthcare data analytics platform for public health monitoring and reporting.',
      organization: 'Department of Health Services',
      location: 'Austin, TX',
      budget: '$3.0M - $6.0M',
      deadline: '2024-12-15',
      publishDate: '2024-09-10',
      category: 'Healthcare',
      status: 'open',
      requirements: ['HIPAA Compliance', 'Big Data Analytics', 'Healthcare Domain Expertise'],
      documents: ['Healthcare_Analytics_RFP.pdf', 'Compliance_Requirements.pdf']
    }
  ];

  // Simulate filtering
  let filteredTenders = mockTenders;
  if (search) {
    filteredTenders = filteredTenders.filter(tender => 
      tender.title.toLowerCase().includes(search.toLowerCase()) ||
      tender.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (category) {
    filteredTenders = filteredTenders.filter(tender => tender.category === category);
  }

  return {
    tenders: filteredTenders,
    total: filteredTenders.length,
    page,
    hasMore: false
  };
};

const generateProposal = async (tender: Tender): Promise<string> => {
  // Simulate Gemini API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return `# Proposal for ${tender.title}

## Executive Summary
We are pleased to submit our comprehensive proposal for the ${tender.title} project. Our team brings extensive experience in ${tender.category.toLowerCase()} solutions and a proven track record of delivering government projects on time and within budget.

## Technical Approach
Our proposed solution addresses the key requirements outlined in your RFP:

${tender.requirements.map(req => `- **${req}**: We have demonstrated expertise and relevant experience`).join('\n')}

## Project Timeline
- **Phase 1 (Weeks 1-4)**: Requirements analysis and system design
- **Phase 2 (Weeks 5-12)**: Core system development and integration
- **Phase 3 (Weeks 13-16)**: Testing, deployment, and user training

## Budget Estimation
Based on the project scope and requirements, our estimated budget falls within the range of ${tender.budget}, with detailed breakdown available upon request.

## Why Choose Us
- Proven experience with ${tender.organization}
- Strong technical team with relevant certifications
- Commitment to quality and timely delivery
- Comprehensive post-implementation support

We look forward to the opportunity to discuss this proposal further and answer any questions you may have.`;
};

// Loading Skeleton Components
const TenderCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const TenderMarketplace = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [proposals, setProposals] = useState<Record<string, ProposalData>>({});

  const categories = ['Technology', 'Transportation', 'Environment', 'Healthcare', 'Construction', 'Consulting'];

  useEffect(() => {
    loadTenders();
  }, [searchTerm, selectedCategory]);

  const loadTenders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchTenders(1, searchTerm, selectedCategory);
      setTenders(response.tenders);
    } catch (err) {
      setError('Failed to load tenders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProposal = async (tender: Tender) => {
    setProposals(prev => ({
      ...prev,
      [tender.id]: { tenderId: tender.id, content: '', isGenerating: true }
    }));

    try {
      const proposalContent = await generateProposal(tender);
      setProposals(prev => ({
        ...prev,
        [tender.id]: { tenderId: tender.id, content: proposalContent, isGenerating: false }
      }));
    } catch (error) {
      setProposals(prev => ({
        ...prev,
        [tender.id]: { tenderId: tender.id, content: 'Failed to generate proposal. Please try again.', isGenerating: false }
      }));
    }
  };

  const getStatusBadge = (status: Tender['status']) => {
    const styles = {
      open: 'bg-green-100 text-green-800 border-green-200',
      closing_soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      closed: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      open: 'Open',
      closing_soon: 'Closing Soon',
      closed: 'Closed'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const TenderCard = ({ tender }: { tender: Tender }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6">
      <div className="flex justify-between items-start mb-4">
        {getStatusBadge(tender.status)}
        <span className="text-sm text-gray-500">
          Published {formatDate(tender.publishDate)}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
        {tender.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {tender.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Building className="w-4 h-4 mr-2 text-gray-400" />
          {tender.organization}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          {tender.location}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
          {tender.budget}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          Due {formatDate(tender.deadline)}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Requirements:</h4>
        <div className="flex flex-wrap gap-2">
          {tender.requirements.slice(0, 3).map((req, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {req}
            </span>
          ))}
          {tender.requirements.length > 3 && (
            <span className="text-xs text-gray-500">+{tender.requirements.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <FileText className="w-4 h-4 mr-1" />
            Documents ({tender.documents.length})
          </button>
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ExternalLink className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>
        
        <button
          onClick={() => handleGenerateProposal(tender)}
          disabled={proposals[tender.id]?.isGenerating}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {proposals[tender.id]?.isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Proposal
            </>
          )}
        </button>
      </div>

      {proposals[tender.id]?.content && !proposals[tender.id]?.isGenerating && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Generated Proposal</h4>
            <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
          <div className="prose prose-sm max-w-none text-gray-600 max-h-32 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{proposals[tender.id].content}</pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Government Tender Marketplace</h1>
              <p className="mt-2 text-gray-600">Discover and bid on government contracts with AI-powered proposal generation</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                My Proposals
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Submit Tender
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>Sort by Deadline</option>
                <option>Sort by Budget</option>
                <option>Sort by Published Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <p className="text-red-800">{error}</p>
                <button
                  onClick={loadTenders}
                  className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <TenderCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {tenders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No tenders found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or check back later for new opportunities.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tenders.map((tender) => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TenderMarketplace;