/**
 * BANK ANALYTICS TAB - Marketplace Performance Analytics
 * Shows partnership performance, NOT student financial data
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Globe,
  CreditCard,
  UserCheck,
  Activity,
  Calendar,
  Filter,
  BarChart3,
  ArrowRight,
  Zap,
} from 'lucide-react';

export const BankAnalyticsTab = () => {
  const [dateRange, setDateRange] = useState('30');
  const [filterAccountType, setFilterAccountType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  // Mock analytics data
  const funnelData = [
    { stage: 'Viewed Bank Page', count: 2456, percentage: 100, dropOff: 0, avgTime: '—' },
    { stage: 'Application Started', count: 1834, percentage: 74.7, dropOff: 25.3, avgTime: '2.3h' },
    { stage: 'Application Submitted', count: 1512, percentage: 61.6, dropOff: 13.1, avgTime: '1.8d' },
    { stage: 'KYC Approved', count: 1289, percentage: 52.5, dropOff: 9.1, avgTime: '3.2d' },
    { stage: 'Account Opened', count: 1089, percentage: 44.3, dropOff: 8.2, avgTime: '1.5d' },
  ];

  const outcomesKPIs = {
    totalApplications: 1834,
    approved: 1089,
    rejected: 156,
    abandoned: 589,
    avgApprovalTime: '5.2 days',
  };

  const timeBasedData = {
    applications: [
      { date: 'Week 1', count: 287 },
      { date: 'Week 2', count: 345 },
      { date: 'Week 3', count: 412 },
      { date: 'Week 4', count: 456 },
      { date: 'Week 5', count: 334 },
    ],
    approvals: [
      { date: 'Week 1', count: 189 },
      { date: 'Week 2', count: 234 },
      { date: 'Week 3', count: 298 },
      { date: 'Week 4', count: 312 },
      { date: 'Week 5', count: 256 },
    ],
  };

  const geographyData = [
    { country: 'India', applications: 456, approvalRate: 78.5, flag: '🇮🇳' },
    { country: 'China', applications: 389, approvalRate: 82.1, flag: '🇨🇳' },
    { country: 'Nigeria', applications: 267, approvalRate: 65.2, flag: '🇳🇬' },
    { country: 'Mexico', applications: 234, approvalRate: 88.9, flag: '🇲🇽' },
    { country: 'Brazil', applications: 198, approvalRate: 74.7, flag: '🇧🇷' },
    { country: 'Vietnam', applications: 156, approvalRate: 81.4, flag: '🇻🇳' },
    { country: 'South Korea', applications: 134, approvalRate: 91.8, flag: '🇰🇷' },
  ];

  const accountTypeData = [
    { type: 'College Checking', applications: 892, approvalRate: 82.3, avgTime: '4.8d' },
    { type: 'Total Checking', applications: 567, approvalRate: 76.5, avgTime: '5.5d' },
    { type: 'Student Savings', applications: 289, approvalRate: 84.1, avgTime: '4.2d' },
    { type: 'Multi-Currency', applications: 86, approvalRate: 68.6, avgTime: '6.8d' },
  ];

  const counselorData = [
    { name: 'Sarah Johnson', applications: 234, approvalRate: 85.5, dropOffRate: 8.5, avgFollowUp: '1.2d' },
    { name: 'Michael Chen', applications: 198, approvalRate: 88.4, dropOffRate: 6.1, avgFollowUp: '0.9d' },
    { name: 'Emily Rodriguez', applications: 167, approvalRate: 82.6, dropOffRate: 11.4, avgFollowUp: '1.5d' },
    { name: 'David Park', applications: 145, approvalRate: 79.3, dropOffRate: 14.5, avgFollowUp: '1.8d' },
  ];

  const operationalHealth = {
    avgProcessingTime: '5.2 days',
    callbackSuccessRate: 94.8,
    manualInterventionRate: 12.3,
    failedStuckApps: 23,
  };

  return (
    <div className="space-y-6">
      {/* Global Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Analytics Filters</h3>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date Range</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Account Type</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filterAccountType}
              onChange={(e) => setFilterAccountType(e.target.value)}
            >
              <option value="all">All Account Types</option>
              <option value="college-checking">College Checking</option>
              <option value="total-checking">Total Checking</option>
              <option value="savings">Student Savings</option>
              <option value="multi-currency">Multi-Currency</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Country</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            >
              <option value="all">All Countries</option>
              <option value="india">India</option>
              <option value="china">China</option>
              <option value="nigeria">Nigeria</option>
              <option value="mexico">Mexico</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Application Channel</label>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="counselor">Counselor Assisted</option>
              <option value="organic">Organic</option>
              <option value="referral">Referral</option>
              <option value="campaign">Partner Campaign</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 1: Application Funnel Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Application Funnel Performance</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Visualizes the complete student journey from viewing the bank page to account opening
        </div>

        <div className="space-y-3">
          {funnelData.map((stage, index) => {
            const isLast = index === funnelData.length - 1;
            const width = stage.percentage;
            
            return (
              <div key={index}>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-40 text-sm font-semibold text-gray-900">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 flex items-center justify-between px-4 transition-all ${
                          isLast ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                          index === 0 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                          'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-white font-bold text-sm">{stage.count.toLocaleString()}</span>
                        <span className="text-white text-xs">{stage.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    {stage.dropOff > 0 && (
                      <div className="text-xs text-red-600 font-semibold flex items-center justify-end gap-1">
                        <TrendingDown size={14} />
                        -{stage.dropOff}%
                      </div>
                    )}
                  </div>
                  <div className="w-20 text-right text-xs text-gray-600 font-medium">
                    {stage.avgTime}
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="ml-40 pl-4 py-1">
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-700 font-semibold uppercase">Overall Conversion</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">44.3%</div>
            <div className="text-xs text-purple-700 mt-1">From view to account opened</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xs text-amber-700 font-semibold uppercase">Biggest Drop-Off</div>
            <div className="text-2xl font-bold text-amber-900 mt-1">25.3%</div>
            <div className="text-xs text-amber-700 mt-1">View → Start Application</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-semibold uppercase">Total Journey Time</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">8.8 days</div>
            <div className="text-xs text-blue-700 mt-1">Average time to complete</div>
          </div>
        </div>
      </div>

      {/* Section 2: Application Outcomes Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Application Outcomes Summary</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-gray-600" />
              <div className="text-xs font-semibold text-gray-500 uppercase">Total Applications</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{outcomesKPIs.totalApplications.toLocaleString()}</div>
            <div className="text-xs text-gray-600 mt-2">Last {dateRange} days</div>
          </div>

          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div className="text-xs font-semibold text-emerald-600 uppercase">Approved</div>
            </div>
            <div className="text-3xl font-bold text-emerald-900">{outcomesKPIs.approved.toLocaleString()}</div>
            <div className="text-xs text-emerald-700 mt-2 font-semibold">
              {((outcomesKPIs.approved / outcomesKPIs.totalApplications) * 100).toFixed(1)}% success rate
            </div>
          </div>

          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="text-xs font-semibold text-red-600 uppercase">Rejected</div>
            </div>
            <div className="text-3xl font-bold text-red-900">{outcomesKPIs.rejected.toLocaleString()}</div>
            <div className="text-xs text-red-700 mt-2 font-semibold">
              {((outcomesKPIs.rejected / outcomesKPIs.totalApplications) * 100).toFixed(1)}% rejection rate
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div className="text-xs font-semibold text-orange-600 uppercase">Abandoned</div>
            </div>
            <div className="text-3xl font-bold text-orange-900">{outcomesKPIs.abandoned.toLocaleString()}</div>
            <div className="text-xs text-orange-700 mt-2 font-semibold">
              {((outcomesKPIs.abandoned / outcomesKPIs.totalApplications) * 100).toFixed(1)}% drop-off rate
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-xs font-semibold text-blue-600 uppercase">Avg Approval Time</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{outcomesKPIs.avgApprovalTime}</div>
            <div className="text-xs text-blue-700 mt-2">From submission to approval</div>
          </div>
        </div>
      </div>

      {/* Section 3: Time-Based Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Time-Based Trends</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Application volume and approval trends over time
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Applications Chart */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Applications Over Time</h3>
            <div className="space-y-2">
              {timeBasedData.applications.map((item, index) => {
                const maxCount = Math.max(...timeBasedData.applications.map(d => d.count));
                const barWidth = (item.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600 font-medium">{item.date}</div>
                    <div className="flex-1 relative h-8 bg-gray-100 rounded">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center px-3"
                        style={{ width: `${barWidth}%` }}
                      >
                        <span className="text-white text-xs font-bold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approvals Chart */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Approvals Over Time</h3>
            <div className="space-y-2">
              {timeBasedData.approvals.map((item, index) => {
                const maxCount = Math.max(...timeBasedData.approvals.map(d => d.count));
                const barWidth = (item.count / maxCount) * 100;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-xs text-gray-600 font-medium">{item.date}</div>
                    <div className="flex-1 relative h-8 bg-gray-100 rounded">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded flex items-center px-3"
                        style={{ width: `${barWidth}%` }}
                      >
                        <span className="text-white text-xs font-bold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-600" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Trend:</span> Applications increased by 23.4% compared to previous period
          </div>
        </div>
      </div>

      {/* Section 4: Geography Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Geography Performance</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Application volume and approval rates by student nationality
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Country</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Applications</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Approval Rate</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Visual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {geographyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.flag}</span>
                      <span className="font-medium text-gray-900">{item.country}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                    {item.applications.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.approvalRate >= 85 ? 'bg-emerald-100 text-emerald-700' :
                      item.approvalRate >= 70 ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.approvalRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.approvalRate >= 85 ? 'bg-emerald-500' :
                          item.approvalRate >= 70 ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${item.approvalRate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-xs text-emerald-700 font-semibold">Highest Approval Rate</div>
            <div className="text-lg font-bold text-emerald-900 mt-1">South Korea (91.8%)</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-700 font-semibold">Most Applications</div>
            <div className="text-lg font-bold text-purple-900 mt-1">India (456)</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-xs text-amber-700 font-semibold">Needs Attention</div>
            <div className="text-lg font-bold text-amber-900 mt-1">Nigeria (65.2%)</div>
          </div>
        </div>
      </div>

      {/* Section 5: Account Type Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Account Type Performance</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Performance breakdown by bank product type
        </div>

        <div className="space-y-4">
          {accountTypeData.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-gray-900">{item.type}</div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Applications</div>
                    <div className="font-bold text-gray-900">{item.applications}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Approval Rate</div>
                    <div className={`font-bold ${
                      item.approvalRate >= 80 ? 'text-emerald-700' :
                      item.approvalRate >= 70 ? 'text-blue-700' :
                      'text-amber-700'
                    }`}>
                      {item.approvalRate}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Avg Time</div>
                    <div className="font-bold text-blue-700">{item.avgTime}</div>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.approvalRate >= 80 ? 'bg-emerald-500' :
                    item.approvalRate >= 70 ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`}
                  style={{ width: `${item.approvalRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Counselor-Assisted Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Counselor-Assisted Performance</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Quality and efficiency metrics for counselor-assisted applications
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Counselor</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Applications</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Approval Rate</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Drop-off Rate</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Avg Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {counselorData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-right text-gray-900 font-semibold">{item.applications}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.approvalRate >= 85 ? 'bg-emerald-100 text-emerald-700' :
                      item.approvalRate >= 75 ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.approvalRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-sm font-semibold ${
                      item.dropOffRate <= 10 ? 'text-emerald-700' :
                      item.dropOffRate <= 15 ? 'text-amber-700' :
                      'text-red-700'
                    }`}>
                      {item.dropOffRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700 font-medium">{item.avgFollowUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <Activity size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Insight:</span> This data is for quality tracking only, not performance ranking. Counselor-assisted applications show an 11.2% higher approval rate on average.
          </div>
        </div>
      </div>

      {/* Section 7: Operational Health Metrics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Operational Health Metrics</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Partnership reliability and technical performance indicators
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="text-xs font-semibold text-blue-600 uppercase">Avg Processing Time</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{operationalHealth.avgProcessingTime}</div>
            <div className="text-xs text-blue-700 mt-2">Submission to decision</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div className="text-xs font-semibold text-emerald-600 uppercase">Callback Success</div>
            </div>
            <div className="text-3xl font-bold text-emerald-900">{operationalHealth.callbackSuccessRate}%</div>
            <div className="text-xs text-emerald-700 mt-2">Bank API reliability</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div className="text-xs font-semibold text-amber-600 uppercase">Manual Intervention</div>
            </div>
            <div className="text-3xl font-bold text-amber-900">{operationalHealth.manualInterventionRate}%</div>
            <div className="text-xs text-amber-700 mt-2">Require human review</div>
          </div>

          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="text-xs font-semibold text-red-600 uppercase">Failed/Stuck Apps</div>
            </div>
            <div className="text-3xl font-bold text-red-900">{operationalHealth.failedStuckApps}</div>
            <div className="text-xs text-red-700 mt-2">Requiring escalation</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">System Health Indicators</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-sm text-gray-700">API Uptime (Last 30 days)</span>
              <span className="text-sm font-bold text-emerald-700">99.7%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-sm text-gray-700">Avg API Response Time</span>
              <span className="text-sm font-bold text-blue-700">342ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-sm text-gray-700">Webhook Success Rate</span>
              <span className="text-sm font-bold text-emerald-700">96.3%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
              <span className="text-sm text-gray-700">Last Sync</span>
              <span className="text-sm font-bold text-gray-700">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
