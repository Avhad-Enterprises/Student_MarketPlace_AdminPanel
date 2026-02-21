/**
 * BANK ACCOUNTS TAB - Student Bank Applications & Lifecycle
 * Shows application lifecycle, NOT financial data
 */

import React, { useState } from 'react';
import {
  FileText,
  Users,
  Activity,
  Search,
  Eye,
  Lock,
  ClipboardList,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';

export const BankAccountsTab = () => {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterCounselor, setFilterCounselor] = useState('all');
  const [filterAccountType, setFilterAccountType] = useState('all');

  // Mock application data
  const applications = [
    {
      id: 1,
      student: { name: 'John Smith', id: 'STU-2024-001' },
      accountType: 'College Checking',
      appRefId: 'BNK-APP-2024-00123',
      channel: 'Counselor Assisted',
      startedOn: '2024-01-15',
      lastUpdated: '2024-02-03',
      currentStage: 'Account Opened',
      counselor: 'Sarah Johnson',
      nextAction: 'No Action Required',
      university: 'NYU',
      country: 'USA',
      timeline: [
        { event: 'Application link sent', timestamp: '2024-01-15 10:00 AM', source: 'System' },
        { event: 'Application started', timestamp: '2024-01-15 02:30 PM', source: 'Student' },
        { event: 'Documents uploaded', timestamp: '2024-01-16 11:20 AM', source: 'Student' },
        { event: 'KYC review started', timestamp: '2024-01-18 09:00 AM', source: 'Bank' },
        { event: 'KYC approved', timestamp: '2024-01-20 03:45 PM', source: 'Bank' },
        { event: 'Account opened', timestamp: '2024-02-03 10:15 AM', source: 'Bank' },
      ],
    },
    {
      id: 2,
      student: { name: 'Maria Garcia', id: 'STU-2024-002' },
      accountType: 'Total Checking',
      appRefId: 'BNK-APP-2024-00124',
      channel: 'Organic',
      startedOn: '2024-01-18',
      lastUpdated: '2024-01-25',
      currentStage: 'KYC Pending',
      counselor: null,
      nextAction: 'Request Documents',
      university: 'Columbia University',
      country: 'USA',
      timeline: [
        { event: 'Application started', timestamp: '2024-01-18 04:15 PM', source: 'Student' },
        { event: 'Initial documents uploaded', timestamp: '2024-01-19 10:00 AM', source: 'Student' },
        { event: 'Additional documents requested', timestamp: '2024-01-22 02:30 PM', source: 'Bank' },
        { event: 'Counselor note added', timestamp: '2024-01-25 09:45 AM', source: 'Counselor', note: 'Student needs help with visa documentation' },
      ],
    },
    {
      id: 3,
      student: { name: 'Wei Zhang', id: 'STU-2024-003' },
      accountType: 'Student Checking',
      appRefId: 'BNK-APP-2024-00125',
      channel: 'Referral',
      startedOn: '2024-01-20',
      lastUpdated: '2024-02-05',
      currentStage: 'Account Opened',
      counselor: 'Michael Chen',
      nextAction: 'No Action Required',
      university: 'UCLA',
      country: 'USA',
      timeline: [
        { event: 'Application link sent', timestamp: '2024-01-20 11:00 AM', source: 'System' },
        { event: 'Application started', timestamp: '2024-01-20 03:30 PM', source: 'Student' },
        { event: 'Documents uploaded', timestamp: '2024-01-22 09:15 AM', source: 'Student' },
        { event: 'KYC review started', timestamp: '2024-01-23 10:00 AM', source: 'Bank' },
        { event: 'KYC approved', timestamp: '2024-01-26 02:20 PM', source: 'Bank' },
        { event: 'Account opened', timestamp: '2024-02-05 11:30 AM', source: 'Bank' },
      ],
    },
    {
      id: 4,
      student: { name: 'Priya Patel', id: 'STU-2024-004' },
      accountType: 'Savings Account',
      appRefId: 'BNK-APP-2024-00126',
      channel: 'Counselor Assisted',
      startedOn: '2024-01-22',
      lastUpdated: '2024-01-28',
      currentStage: 'KYC Failed',
      counselor: 'Sarah Johnson',
      nextAction: 'Follow Up',
      university: 'Boston University',
      country: 'USA',
      timeline: [
        { event: 'Application link sent', timestamp: '2024-01-22 09:00 AM', source: 'System' },
        { event: 'Application started', timestamp: '2024-01-22 01:45 PM', source: 'Student' },
        { event: 'Documents uploaded', timestamp: '2024-01-23 11:00 AM', source: 'Student' },
        { event: 'KYC review started', timestamp: '2024-01-24 10:30 AM', source: 'Bank' },
        { event: 'KYC failed - ID verification issue', timestamp: '2024-01-28 03:15 PM', source: 'Bank' },
        { event: 'Counselor assigned for follow-up', timestamp: '2024-01-28 04:00 PM', source: 'System' },
      ],
    },
    {
      id: 5,
      student: { name: 'Alex Johnson', id: 'STU-2024-005' },
      accountType: 'College Checking',
      appRefId: 'BNK-APP-2024-00127',
      channel: 'Partner Campaign',
      startedOn: '2024-01-25',
      lastUpdated: '2024-01-25',
      currentStage: 'Draft',
      counselor: null,
      nextAction: 'Resend Application Link',
      university: 'MIT',
      country: 'USA',
      timeline: [
        { event: 'Application link sent', timestamp: '2024-01-25 10:00 AM', source: 'System' },
      ],
    },
    {
      id: 6,
      student: { name: 'Sofia Rodriguez', id: 'STU-2024-006' },
      accountType: 'Total Checking',
      appRefId: 'BNK-APP-2024-00128',
      channel: 'Organic',
      startedOn: '2024-01-27',
      lastUpdated: '2024-02-01',
      currentStage: 'Submitted',
      counselor: 'Michael Chen',
      nextAction: 'No Action Required',
      university: 'Stanford',
      country: 'USA',
      timeline: [
        { event: 'Application started', timestamp: '2024-01-27 02:00 PM', source: 'Student' },
        { event: 'Application submitted', timestamp: '2024-02-01 11:45 AM', source: 'Student' },
      ],
    },
    {
      id: 7,
      student: { name: 'Michael Chen', id: 'STU-2024-007' },
      accountType: 'Student Checking',
      appRefId: 'BNK-APP-2024-00129',
      channel: 'Counselor Assisted',
      startedOn: '2024-01-28',
      lastUpdated: '2024-02-02',
      currentStage: 'Abandoned',
      counselor: 'Sarah Johnson',
      nextAction: 'Follow Up',
      university: 'Harvard',
      country: 'USA',
      timeline: [
        { event: 'Application link sent', timestamp: '2024-01-28 09:30 AM', source: 'System' },
        { event: 'Application started', timestamp: '2024-01-28 03:00 PM', source: 'Student' },
        { event: 'Application abandoned (30 days inactive)', timestamp: '2024-02-02 12:00 PM', source: 'System' },
      ],
    },
    {
      id: 8,
      student: { name: 'Emma Wilson', id: 'STU-2024-008' },
      accountType: 'Savings Account',
      appRefId: 'BNK-APP-2024-00130',
      channel: 'Referral',
      startedOn: '2024-01-30',
      lastUpdated: '2024-02-04',
      currentStage: 'KYC Approved',
      counselor: null,
      nextAction: 'Book Appointment',
      university: 'Yale',
      country: 'USA',
      timeline: [
        { event: 'Application started', timestamp: '2024-01-30 10:15 AM', source: 'Student' },
        { event: 'Documents uploaded', timestamp: '2024-01-31 02:30 PM', source: 'Student' },
        { event: 'KYC review started', timestamp: '2024-02-01 09:00 AM', source: 'Bank' },
        { event: 'KYC approved', timestamp: '2024-02-04 11:20 AM', source: 'Bank' },
        { event: 'Appointment required for final activation', timestamp: '2024-02-04 11:25 AM', source: 'System' },
      ],
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Account Opened':
        return 'bg-emerald-100 text-emerald-700';
      case 'KYC Approved':
        return 'bg-blue-100 text-blue-700';
      case 'Submitted':
      case 'KYC Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Draft':
        return 'bg-gray-100 text-gray-700';
      case 'KYC Failed':
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case 'Abandoned':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === '' ||
      app.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appRefId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || app.currentStage === filterStage;
    const matchesCounselor =
      filterCounselor === 'all' ||
      (filterCounselor === 'unassigned' && !app.counselor) ||
      app.counselor === filterCounselor;
    const matchesAccountType = filterAccountType === 'all' || app.accountType === filterAccountType;

    return matchesSearch && matchesStage && matchesCounselor && matchesAccountType;
  });

  const stats = {
    started: applications.filter((a) => a.currentStage !== 'Draft').length,
    submitted: applications.filter((a) => ['Submitted', 'KYC Pending', 'KYC Approved'].includes(a.currentStage)).length,
    approved: applications.filter((a) => a.currentStage === 'Account Opened').length,
    rejected: applications.filter((a) => a.currentStage === 'KYC Failed' || a.currentStage === 'Rejected').length,
    dropoffs: applications.filter((a) => a.currentStage === 'Abandoned').length,
  };

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Applications Started</div>
          <div className="text-2xl font-bold text-gray-900">{stats.started}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Submitted</div>
          <div className="text-2xl font-bold text-amber-700">{stats.submitted}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Approved</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.approved}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Rejected</div>
          <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Drop-offs</div>
          <div className="text-2xl font-bold text-orange-700">{stats.dropoffs}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Avg Time to Open</div>
          <div className="text-2xl font-bold text-blue-700">5.2d</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Student Bank Applications</h2>
            <div className="text-xs text-gray-500 mt-1">
              Track student application lifecycle and onboarding progress
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
              <FileText size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
          <Lock size={16} className="text-blue-600" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Privacy Notice:</span> This table shows application lifecycle data only. Bank balances and transaction details are never exposed to marketplace admins.
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student name or application ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="all">All Stages</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="KYC Pending">KYC Pending</option>
            <option value="KYC Approved">KYC Approved</option>
            <option value="KYC Failed">KYC Failed</option>
            <option value="Account Opened">Account Opened</option>
            <option value="Rejected">Rejected</option>
            <option value="Abandoned">Abandoned</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterCounselor}
            onChange={(e) => setFilterCounselor(e.target.value)}
          >
            <option value="all">All Counselors</option>
            <option value="unassigned">Unassigned</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Michael Chen">Michael Chen</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterAccountType}
            onChange={(e) => setFilterAccountType(e.target.value)}
          >
            <option value="all">All Account Types</option>
            <option value="College Checking">College Checking</option>
            <option value="Student Checking">Student Checking</option>
            <option value="Total Checking">Total Checking</option>
            <option value="Savings Account">Savings Account</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Account Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">App Ref ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Channel</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Started On</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Last Updated</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Current Stage</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Counselor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Next Action</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedApplication(app)}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{app.student.name}</div>
                    <div className="text-xs text-gray-500">{app.student.id}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{app.accountType}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-700">{app.appRefId}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                      {app.channel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{app.startedOn}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{app.lastUpdated}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStageColor(app.currentStage)}`}>
                      {app.currentStage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{app.counselor || <span className="text-gray-400">—</span>}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${
                      app.nextAction === 'No Action Required' ? 'text-gray-500' : 'text-purple-700'
                    }`}>
                      {app.nextAction}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplication(app);
                      }}
                      className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredApplications.length}</span> of <span className="font-semibold">{applications.length}</span> applications
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
        <DialogContent className="max-w-[1400px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              Bank Application Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              View detailed information about the bank application including student info, account details, and application status
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-6">
                {/* Student Summary */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={18} className="text-blue-600" />
                    Student Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Student Name</div>
                      <div className="font-semibold text-gray-900">{selectedApplication.student.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Student ID</div>
                      <div className="text-sm text-gray-700">{selectedApplication.student.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">University</div>
                      <div className="text-sm text-gray-700">{selectedApplication.university}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Study Country</div>
                      <div className="text-sm text-gray-700">{selectedApplication.country}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Counselor</div>
                      <div className="text-sm text-gray-700">
                        {selectedApplication.counselor || <span className="text-gray-400">Unassigned</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-purple-600" />
                    Application Overview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Bank Name</div>
                      <div className="font-semibold text-gray-900">Chase Bank</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Account Type</div>
                      <div className="text-sm text-gray-700">{selectedApplication.accountType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Application Reference ID</div>
                      <div className="font-mono text-xs text-gray-700">{selectedApplication.appRefId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Channel</div>
                      <div>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                          {selectedApplication.channel}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Current Stage</div>
                      <div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStageColor(selectedApplication.currentStage)}`}>
                          {selectedApplication.currentStage}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Started On</div>
                      <div className="text-sm text-gray-700">{selectedApplication.startedOn}</div>
                    </div>
                  </div>
                </div>

                {/* Application Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-emerald-600" />
                    Application Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedApplication.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === selectedApplication.timeline.length - 1 ? 'bg-purple-600' : 'bg-gray-300'
                          }`} />
                          {index < selectedApplication.timeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="font-medium text-gray-900">{event.event}</div>
                          <div className="text-xs text-gray-500 mt-1">{event.timestamp}</div>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              event.source === 'Bank' ? 'bg-blue-100 text-blue-700' :
                              event.source === 'Student' ? 'bg-emerald-100 text-emerald-700' :
                              event.source === 'Counselor' ? 'bg-purple-100 text-purple-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {event.source}
                            </span>
                          </div>
                          {event.note && (
                            <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-xs text-amber-800">
                              <span className="font-semibold">Note:</span> {event.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ClipboardList size={18} className="text-amber-600" />
                    Internal Notes
                    <span className="ml-2 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">
                      Admin/Counselor Only
                    </span>
                  </h3>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                    placeholder="Add internal notes for follow-ups (not visible to students)..."
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-gray-500">Last updated: 2024-02-05 10:30 AM by Sarah Johnson</div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">
                      Save Note
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setSelectedApplication(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <ExternalLink size={16} />
              View Audit Log
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};