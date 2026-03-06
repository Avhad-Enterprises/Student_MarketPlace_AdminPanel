import React, { useState } from 'react';
import {
  CheckCircle, AlertCircle, Eye, ExternalLink, ArrowLeft, Save, X,
  Plus, Trash2, Settings, FileText, RotateCcw, User, Calendar, Loader
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { toast } from 'sonner';

// ============================================
// PART 7: ENHANCED PUBLISHING & ENVIRONMENT COMPONENTS
// ============================================

// Helper function (already exists in main file, duplicated for standalone use)
const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// ============================================
// 1️⃣ ENVIRONMENT STATUS SYSTEM (TOP BAR)
// ============================================

export const EnhancedEnvironmentBadge: React.FC<{ 
  environment: 'draft' | 'preview' | 'live';
  lastPublished: Date;
}> = ({ environment, lastPublished }) => {
  const config = {
    draft: { 
      label: 'Draft', 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      tooltip: 'Changes are saved but not visible to visitors.'
    },
    preview: { 
      label: 'Preview', 
      bg: 'bg-blue-100', 
      text: 'text-blue-700', 
      tooltip: 'Preview how your site will look when published.'
    },
    live: { 
      label: 'Live', 
      bg: 'bg-green-100', 
      text: 'text-green-700', 
      tooltip: 'This is what visitors currently see.'
    }
  };

  const { label, bg, text, tooltip } = config[environment];
  const timeAgo = formatTimeAgo(lastPublished);

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span 
            className={`px-2.5 py-1 ${bg} ${text} text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-help`}
          >
            {environment === 'live' && <CheckCircle size={12} />}
            {label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-center">
            <p className="font-semibold mb-1">{tooltip}</p>
            {environment === 'live' && (
              <p className="text-xs text-gray-400">Published {timeAgo}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
      {environment === 'live' && (
        <span className="text-xs text-gray-500">Published {timeAgo}</span>
      )}
    </div>
  );
};

// ============================================
// 2️⃣ DRAFT MODE UX ENHANCEMENT
// ============================================

export const EnhancedDraftModeBanner: React.FC = () => (
  <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="text-blue-600" />
        <div>
          <p className="text-sm text-blue-800">
            <strong>You&apos;re editing a draft.</strong> Changes are not live yet.
          </p>
          {/* Secondary helper text */}
          <p className="text-xs text-blue-600 mt-0.5">
            Preview or publish when ready.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// 3️⃣ PREVIEW MODE UX MODELING
// ============================================

export const EnhancedPreviewModeBar: React.FC<{ 
  onBackToDraft: () => void;
  onPublish: () => void;
}> = ({ onBackToDraft, onPublish }) => {
  const [showShareLink, setShowShareLink] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b border-blue-800 px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Eye size={20} className="text-white" />
          <div>
            <p className="text-white font-semibold text-sm">Preview Mode</p>
            {/* Enhanced subtext */}
            <p className="text-blue-100 text-xs">Viewing unpublished changes safely</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowShareLink(!showShareLink)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium"
          >
            <ExternalLink size={16} />
            Share Preview
          </button>
          <button 
            onClick={onBackToDraft}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Back to Draft
          </button>
          {/* Enhanced Publish button with tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onPublish}
                className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-md"
              >
                <Save size={16} />
                Publish
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Publishing will make all draft changes live.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {showShareLink && (
        <div className="mt-3 pt-3 border-t border-blue-500">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value="https://preview.studyvisa.com/draft-a8f3d2" 
              className="flex-1 px-3 py-2 bg-white rounded-lg text-sm text-gray-700 border border-blue-300"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText("https://preview.studyvisa.com/draft-a8f3d2");
                toast.success('Preview link copied to clipboard');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors text-sm font-medium"
            >
              Copy Link
            </button>
          </div>
          <p className="text-xs text-blue-100 mt-1.5">
            This preview link is read-only and will expire in 7 days
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================
// 4️⃣ PUBLISH CONFIRMATION — EDUCATED CONFIRMATION
// ============================================

const ChangeSummaryItem: React.FC<{
  icon: React.ElementType;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}> = ({ icon: Icon, label, count, color, bgColor }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`p-1.5 rounded-lg ${bgColor}`}>
        <Icon size={14} className={color} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className={`text-sm font-bold ${color}`}>{count}</span>
  </div>
);

export const EnhancedPublishConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccess(true);
      // 5️⃣ POST-PUBLISH FEEDBACK
      toast.success('Changes published successfully', {
        description: 'Your site is now live for all visitors'
      });
      setTimeout(() => {
        onConfirm();
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-[450px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your changes are now live!</h2>
          <p className="text-sm text-gray-600">All visitors can now see the updated website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={isPublishing ? undefined : onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Save size={24} className="text-blue-600" />
              </div>
              <div>
                {/* Enhanced title */}
                <h2 className="text-xl font-bold text-gray-900">Publish Changes</h2>
                {/* Enhanced message */}
                <p className="text-sm text-gray-600 mt-0.5">This will make all draft changes live for visitors.</p>
              </div>
            </div>
            {!isPublishing && (
              <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Change Summary with Checklist */}
        <div className="p-6">
          {/* PART 9: Change Count Summary */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Changes included in this publish:</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-600 mt-1">Content updates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-xs text-gray-600 mt-1">Theme update</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-xs text-gray-600 mt-1">App configuration</div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">What will be published</h3>
              <span className="text-xs text-gray-500">Last modified 5 minutes ago</span>
            </div>
            {/* 4️⃣ Checklist (visual only) */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium">Pages & Sections</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium">Theme Styles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium">Apps Configuration</span>
              </div>
              
              <div className="pt-3 border-t border-gray-300 space-y-2">
                <ChangeSummaryItem 
                  icon={Plus} 
                  label="Sections added" 
                  count={2} 
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <ChangeSummaryItem 
                  icon={Trash2} 
                  label="Sections removed" 
                  count={0} 
                  color="text-red-600"
                  bgColor="bg-red-50"
                />
                <ChangeSummaryItem 
                  icon={Settings} 
                  label="Settings changed" 
                  count={8} 
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
                <ChangeSummaryItem 
                  icon={FileText} 
                  label="Content edited" 
                  count={12} 
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
              </div>
            </div>
          </div>

          {/* Publishing Info - Enhanced */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">Publishing may affect live traffic</p>
                <p className="text-xs text-yellow-700">
                  All draft changes will go live immediately. Visitors will see these updates right away. You can rollback from Version History if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          {!isPublishing && (
            <button 
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-6 py-2.5 rounded-lg transition-all text-sm font-semibold shadow-md flex items-center gap-2 ${
              isPublishing 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            {isPublishing ? (
              <>
                <Loader size={16} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save size={16} />
                Publish Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 6️⃣ & 7️⃣ VERSION HISTORY — ROLLBACK EDUCATION
// ============================================

export const EnhancedVersionHistoryPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [showRollbackModal, setShowRollbackModal] = useState(false);

  const versions = [
    { id: '1', date: new Date(), author: 'Admin User', status: 'Draft', changes: 'Current draft' },
    { id: '2', date: new Date(Date.now() - 2 * 60 * 60 * 1000), author: 'Admin User', status: 'Published', changes: 'Updated hero section' },
    { id: '3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), author: 'John Doe', status: 'Published', changes: 'Added testimonials' },
    { id: '4', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), author: 'Admin User', status: 'Published', changes: 'Initial website setup' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-end justify-end z-50" onClick={onClose}>
        <div 
          className="bg-white h-full w-[500px] shadow-2xl flex flex-col" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <RotateCcw size={20} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Version History</h2>
                  <p className="text-xs text-gray-600">View and restore previous versions</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Version List - Enhanced with tooltips */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {versions.map((version, index) => (
              <div 
                key={version.id}
                className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${
                  selectedVersion === version.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[9px] font-bold rounded uppercase">
                        Current
                      </span>
                    )}
                    {/* 6️⃣ Enhanced labels */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase cursor-help ${
                          version.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {version.status}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {version.status === 'Published' 
                          ? 'This version was published and visible to visitors' 
                          : 'This is a draft version, not yet published'}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimeAgo(version.date)}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{version.changes}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User size={12} />
                  <span>{version.author}</span>
                  <span>•</span>
                  <Calendar size={12} />
                  <span>{version.date.toLocaleDateString()}</span>
                </div>

                {selectedVersion === version.id && index !== 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                    <button className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium">
                      Preview Version
                    </button>
                    {/* 6️⃣ Enhanced Restore button with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRollbackModal(true);
                          }}
                          className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-semibold"
                        >
                          Restore as Draft
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Restoring creates a new draft based on this version.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Rollback Safety:</strong> Restoring a version creates a new draft. Review and publish when ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7️⃣ Rollback Confirmation Modal - Enhanced */}
      {showRollbackModal && (
        <EnhancedRollbackConfirmationModal
          onConfirm={() => {
            setShowRollbackModal(false);
            toast.success('Version restored as draft', {
              description: 'Review and publish when ready'
            });
            onClose();
          }}
          onCancel={() => setShowRollbackModal(false)}
        />
      )}
    </>
  );
};

// 7️⃣ RESTORE CONFIRMATION UX
export const EnhancedRollbackConfirmationModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onCancel}>
    <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="px-6 py-4 border-b bg-purple-50 border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <RotateCcw size={20} className="text-purple-600" />
          </div>
          {/* 7️⃣ Enhanced title */}
          <h2 className="text-lg font-semibold text-purple-900">Restore Version</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* 7️⃣ Enhanced message */}
        <p className="text-sm text-gray-700 font-medium">
          This will create a new draft from this version. Your live site won&apos;t change until you publish.
        </p>
        <p className="text-sm text-gray-600">
          Your current draft will be replaced with the selected version. The restored content will NOT be published automatically — you&apos;ll need to review and publish it manually.
        </p>

        {/* Process Visualization */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-3">Restore Process</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">1</div>
              <span>Version is restored as a new draft</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">2</div>
              <span>Review the restored content</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-[10px]">3</div>
              <span>Publish when ready (live site unchanged until then)</span>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">
              <strong>Safe Operation:</strong> Your live site won&apos;t be affected. You can review the restored draft before publishing.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        {/* 7️⃣ Enhanced CTA */}
        <button 
          onClick={onConfirm}
          className="px-4 py-2 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Restore to Draft
        </button>
      </div>
    </div>
  </div>
);

// ============================================
// 8️⃣ UNSAVED CHANGES GUARDRAILS
// ============================================

export const EnhancedUnsavedChangesWarning: React.FC<{
  onStay: () => void;
  onDiscard: () => void;
}> = ({ onStay, onDiscard }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-yellow-50 border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <AlertCircle size={20} className="text-yellow-600" />
          </div>
          {/* 8️⃣ Enhanced message */}
          <h2 className="text-lg font-semibold text-yellow-900">You have unpublished changes</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* 8️⃣ Secondary text */}
        <p className="text-sm text-gray-700 font-medium">
          Leave without publishing?
        </p>
        <p className="text-sm text-gray-600">
          Your draft changes are auto-saved, but they haven&apos;t been published yet. Visitors won&apos;t see these updates until you publish.
        </p>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">Unpublished Changes:</p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>8 setting modifications</li>
            <li>2 new sections added</li>
            <li>12 content edits</li>
          </ul>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Note:</strong> Your changes are saved as a draft. You can return and publish them later.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        {/* 8️⃣ Enhanced CTAs */}
        <button 
          onClick={onStay}
          className="px-5 py-2.5 text-sm font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Stay & Review
        </button>
        <button 
          onClick={onDiscard}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Leave Without Publishing
        </button>
      </div>
    </div>
  </div>
);
