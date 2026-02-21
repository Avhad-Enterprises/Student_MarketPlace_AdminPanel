/**
 * BANK SETTINGS TAB - Enterprise-Grade Configuration & Governance
 * High-impact controls with guardrails and audit accountability
 */

import React, { useState } from 'react';
import {
  Eye,
  Zap,
  Shield,
  Lock,
  AlertCircle,
  Edit3,
  FileText,
  Globe,
  CheckCircle,
  DollarSign,
  Users,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export const BankSettingsTab = () => {
  const [isChangeAppModeOpen, setIsChangeAppModeOpen] = useState(false);
  const [visibilitySettings, setVisibilitySettings] = useState({
    visibleToStudents: true,
    visibleToCounselors: true,
  });
  const [applicationMode, setApplicationMode] = useState('instant-online');
  const [newApplicationMode, setNewApplicationMode] = useState('instant-online');
  const [changeReason, setChangeReason] = useState('');

  const handleChangeApplicationMode = () => {
    if (!changeReason.trim()) {
      alert('Please provide a reason for this change');
      return;
    }
    setApplicationMode(newApplicationMode);
    setIsChangeAppModeOpen(false);
    setChangeReason('');
    // Simulate audit log creation
    console.log(`Application mode changed to: ${newApplicationMode}. Reason: ${changeReason}`);
  };

  // Mock audit history
  const recentChanges = [
    {
      what: 'Application mode changed to Instant Online',
      who: 'Admin: Sarah Johnson',
      when: '2024-02-05 10:30 AM',
    },
    {
      what: 'Visibility enabled for students',
      who: 'Admin: Michael Chen',
      when: '2024-02-03 02:15 PM',
    },
    {
      what: 'Commission rate updated to 15%',
      who: 'Finance: Rahul Kumar',
      when: '2024-02-01 11:45 AM',
    },
    {
      what: 'Support contact email updated',
      who: 'Admin: Emily Rodriguez',
      when: '2024-01-28 04:30 PM',
    },
    {
      what: 'Settlement cycle changed to Monthly',
      who: 'Finance: David Park',
      when: '2024-01-25 09:00 AM',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Visibility Rules */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Visibility Rules</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Control who can see and access this banking partner
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <div className="font-semibold text-gray-900 text-sm">Visible to Students</div>
              <div className="text-xs text-gray-600 mt-0.5">Students can see and apply for this bank account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={visibilitySettings.visibleToStudents}
                onChange={(e) => setVisibilitySettings({ ...visibilitySettings, visibleToStudents: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <div className="font-semibold text-gray-900 text-sm">Visible to Counselors Only</div>
              <div className="text-xs text-gray-600 mt-0.5">Counselors can see this bank even if hidden from students</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={visibilitySettings.visibleToCounselors}
                onChange={(e) => setVisibilitySettings({ ...visibilitySettings, visibleToCounselors: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-semibold">Warning:</span> Disabling student visibility will hide this bank from all student-facing interfaces immediately.
          </div>
        </div>
      </div>

      {/* 2. Application Mode Control */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Application Mode Control</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Define how students apply for this bank account
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase">Current Mode</div>
              <div className="font-semibold text-gray-900 mt-1">
                {applicationMode === 'instant-online' && 'Instant Online'}
                {applicationMode === 'counselor-assisted' && 'Counselor-Assisted'}
                {applicationMode === 'appointment-required' && 'Appointment Required'}
                {applicationMode === 'offline-document' && 'Offline / Document-Based'}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {applicationMode === 'instant-online' && 'Students can apply directly via bank portal'}
                {applicationMode === 'counselor-assisted' && 'Counselor helps student through application'}
                {applicationMode === 'appointment-required' && 'Student must book appointment first'}
                {applicationMode === 'offline-document' && 'Paper-based application process'}
              </div>
            </div>
            <button
              onClick={() => setIsChangeAppModeOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Edit3 size={16} />
              Change Mode
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <FileText size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Audit Log:</span> Mode changes create timestamped audit entries with admin details and reason for change.
          </div>
        </div>
      </div>

      {/* 3. Compliance Flags (Read-Only) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Compliance Flags</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Regulatory and compliance requirements (read-only)
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-900 text-sm">KYC Required</div>
                <div className="text-xs text-emerald-700 mt-0.5">Know Your Customer verification mandatory</div>
              </div>
            </div>
            <Lock size={16} className="text-emerald-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900 text-sm">AML Checks Applicable</div>
                <div className="text-xs text-blue-700 mt-0.5">Anti-Money Laundering screening required</div>
              </div>
            </div>
            <Lock size={16} className="text-blue-600" />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <div className="font-semibold text-gray-900 text-sm">Region-Specific Compliance Notes</div>
            </div>
            <div className="text-xs text-gray-700 space-y-1 ml-6">
              <div>• USA: Patriot Act compliance required for all accounts</div>
              <div>• International students: Additional identity verification via consulate</div>
              <div>• High-value deposits: Enhanced due diligence triggers at $10,000+</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Lock size={14} className="text-gray-500" />
            <span>Compliance settings are managed by the Risk & Compliance team</span>
          </div>
        </div>
      </div>

      {/* 4. Commission & Payout Settings (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Commission & Payout Settings</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Revenue structure and settlement configuration for this bank partnership
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-purple-600 uppercase">Commission Model</div>
              <Lock size={14} className="text-purple-600" />
            </div>
            <div className="font-bold text-purple-900 text-lg">Fixed per Account</div>
            <div className="text-xs text-purple-700 mt-1">$150.00 per successful account opening</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-blue-600 uppercase">Commission Currency</div>
              <Lock size={14} className="text-blue-600" />
            </div>
            <div className="font-bold text-blue-900 text-lg">USD</div>
            <div className="text-xs text-blue-700 mt-1">United States Dollar</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-emerald-600 uppercase">Settlement Cycle</div>
              <Lock size={14} className="text-emerald-600" />
            </div>
            <div className="font-bold text-emerald-900 text-lg">Monthly</div>
            <div className="text-xs text-emerald-700 mt-1">Last business day of each month</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-amber-600 uppercase">Min. Payout Threshold</div>
              <Lock size={14} className="text-amber-600" />
            </div>
            <div className="font-bold text-amber-900 text-lg">$500.00</div>
            <div className="text-xs text-amber-700 mt-1">Minimum balance before payout</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <div className="font-semibold text-gray-900 text-sm">Managed By</div>
          </div>
          <div className="text-xs text-gray-700 ml-6">
            Finance Team — Any changes require Finance Manager approval and create audit entries
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
          <Lock size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Restricted Access:</span> Commission settings can only be edited by users with Finance role. All changes require confirmation and audit logging.
          </div>
        </div>
      </div>

      {/* 5. Operational & Escalation Contacts (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Operational & Escalation Contacts</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Internal contacts for incidents, disputes, and escalations
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Mail className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase">Support Contact</div>
              <div className="font-medium text-gray-900">partners@chase.com</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase">Technical Integration Contact</div>
              <div className="font-medium text-gray-900">api-support@chase.com</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Shield className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase">Compliance Contact</div>
              <div className="font-medium text-gray-900">compliance@chase.com</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-500 uppercase">Finance / Payout Contact</div>
              <div className="font-medium text-gray-900">finance-partners@chase.com</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="font-semibold text-blue-900 text-sm">Escalation SLA</div>
            </div>
            <div className="text-xs text-blue-800 ml-6">
              • Standard incidents: Response within 24 hours
              <br />
              • Critical issues: Response within 4 hours
              <br />
              • Financial disputes: Response within 48 hours
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200 flex items-center gap-2">
          <AlertCircle size={14} className="text-gray-600" />
          <div className="text-xs text-gray-700">
            These contacts are internal-facing and used during incidents, disputes, or audits
          </div>
        </div>
      </div>

      {/* 6. Advanced / Technical Settings (RESTRICTED) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-gray-900">Advanced / Technical Settings</h2>
          <Lock size={16} className="text-amber-600" />
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Restricted configuration — changes may affect live integrations
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              Partner Status
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">Restricted</span>
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Active</option>
              <option>Inactive</option>
              <option>Suspended</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              Notification Email
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded">Restricted</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="partners@chase.com"
              defaultValue="partners@chase.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              API Endpoint
              <span className="px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded">Critical</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
              placeholder="https://api.chase.com/v1"
              defaultValue="https://api.chase.com/v1/student-banking"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
          <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-800">
            <span className="font-semibold">Warning:</span> Changing these values may affect live integrations and cause service disruptions. Changes require admin approval and create audit log entries.
          </div>
        </div>
      </div>

      {/* 7. Recent Changes & Audit Snapshot (NEW) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Recent Changes & Audit Snapshot</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Last 5 configuration changes for accountability and transparency
        </div>

        <div className="space-y-2">
          {recentChanges.map((change, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="mt-0.5">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{change.what}</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <User size={12} />
                    {change.who}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {change.when}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-2">
            <FileText size={16} />
            View Full Audit Log
          </button>
        </div>
      </div>

      {/* Change Application Mode Modal */}
      <Dialog open={isChangeAppModeOpen} onOpenChange={setIsChangeAppModeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Change Application Mode
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">Important:</span> Changing the application mode will affect how students interact with this banking partner. This change will be logged in the audit trail.
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">Select New Application Mode</label>
              <div className="space-y-2">
                {[
                  { value: 'instant-online', label: 'Instant Online', desc: 'Students apply directly via bank portal', icon: Globe },
                  { value: 'counselor-assisted', label: 'Counselor-Assisted', desc: 'Counselor helps student through application', icon: Users },
                  { value: 'appointment-required', label: 'Appointment Required', desc: 'Student must book appointment first', icon: Calendar },
                  { value: 'offline-document', label: 'Offline / Document-Based', desc: 'Paper-based application process', icon: FileText },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <label
                      key={mode.value}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        newApplicationMode === mode.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="appMode"
                        value={mode.value}
                        checked={newApplicationMode === mode.value}
                        onChange={(e) => setNewApplicationMode(e.target.value)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <Icon size={20} className={newApplicationMode === mode.value ? 'text-purple-600' : 'text-gray-400'} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{mode.label}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{mode.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Reason for Change <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Explain why this application mode change is necessary..."
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setIsChangeAppModeOpen(false);
                setChangeReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleChangeApplicationMode}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!changeReason.trim()}
            >
              Confirm Change
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
