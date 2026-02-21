/**
 * VISA DETAIL TABS - READ-ONLY TABS
 * 
 * These tabs don't require edit functionality based on requirements.
 * They display information in read-only format.
 */

import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Clock,
  Plus,
  Trash2,
  Edit3,
  FileText,
  AlertCircle,
  TrendingUp,
  Download,
  Activity,
  CheckCircle2,
  Flag,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import type { ProcessStep, Fee, AdminNote, EditModeContextType } from './VisaProviderDetail';

// ============================================
// TAB 4: PROCESS & TIMELINE - READ-ONLY
// ============================================

export const VisaProcessTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { processSteps } = context;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Application Process</h2>
        </div>

        <div className="space-y-3">
          {processSteps
            .sort((a: ProcessStep, b: ProcessStep) => (a.order || 0) - (b.order || 0))
            .map((step: ProcessStep, index: number) => (
              <div
                key={step.id}
                className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                    {step.fastTrack && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                        Fast Track
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-500">{step.duration}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 5: FEES & COSTS - READ-ONLY
// ============================================

export const VisaFeesTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { fees } = context;

  const totalFees = fees.reduce((sum: number, fee: Fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Fees & Costs</h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Estimated</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalFees.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {fees.map((fee: Fee) => (
            <div
              key={fee.id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-900 mb-1">{fee.name}</h4>
                <div className="flex items-center gap-2">
                  {fee.refundable && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Refundable
                    </span>
                  )}
                  {fee.variableByCountry && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                      Variable by Country
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {fee.amount} {fee.currency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 6: NOTES & EXCEPTIONS - READ-ONLY
// ============================================

export const VisaNotesTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { adminNotes } = context;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Admin Notes & Country-Specific Insights</h2>
        </div>

        <div className="space-y-4">
          {adminNotes.map((note: AdminNote) => (
            <div
              key={note.id}
              className={`p-4 border rounded-lg ${getSeverityColor(note.severity || 'Low')}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <h4 className="text-sm font-bold">{note.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded font-semibold">
                    {note.country}
                  </span>
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded font-semibold">
                    {note.visibility}
                  </span>
                </div>
              </div>
              <p className="text-sm mb-2">{note.content}</p>
              <div className="flex items-center gap-4 text-xs opacity-70">
                <span>By: {note.createdBy}</span>
                <span>Date: {note.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 7: ANALYTICS - READ-ONLY
// ============================================

export const VisaAnalyticsTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { visaData } = context;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Visa Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-700 font-semibold mb-1">Avg Processing Time</div>
            <div className="text-2xl font-bold text-blue-900">{visaData.avgProcessingTime}</div>
          </div>

          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs text-green-700 font-semibold mb-1">Approval Rate</div>
            <div className="text-2xl font-bold text-green-900">{visaData.approvalRate}</div>
          </div>

          <div className="p-6 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-xs text-purple-700 font-semibold mb-1">Students Applied</div>
            <div className="text-2xl font-bold text-purple-900">{visaData.studentsApplied}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 8: ACTIVITY LOG - READ-ONLY
// ============================================

export const VisaActivityLogTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { activityLog } = context;

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Added':
        return 'bg-green-100 text-green-800';
      case 'Updated':
        return 'bg-blue-100 text-blue-800';
      case 'Deleted':
        return 'bg-red-100 text-red-800';
      case 'Synced':
        return 'bg-purple-100 text-purple-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Activity Log</h2>
          </div>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Download size={14} />
            Export Log
          </Button>
        </div>

        <div className="space-y-2">
          {activityLog.map((entry: any) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 mt-1">
                <Activity size={16} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getActionColor(entry.action)}`}>
                    {entry.action}
                  </span>
                  <span className="text-xs text-gray-500">{entry.entity}</span>
                </div>
                <p className="text-sm text-gray-900">{entry.summary}</p>
                {entry.details && (
                  <p className="text-xs text-gray-600 mt-1">{entry.details}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>By: {entry.admin}</span>
                  <span>{entry.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
