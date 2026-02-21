/**
 * VISA DETAIL TABS - COMPLETE PER-TAB EDIT MODE IMPLEMENTATION
 * 
 * ✅ PROPER EDIT FUNCTIONALITY:
 * - Page loads in READ-ONLY mode
 * - Edit button triggers EDIT MODE per tab
 * - Fields switch from text to inputs
 * - Save/Cancel buttons appear
 * - Cancel restores original values
 * - Save exits edit mode and persists
 * 
 * TABS COVERED:
 * 1. Overview
 * 2. Eligibility & Rules  
 * 3. Required Documents
 */

import React, { useState } from 'react';
import {
  Info,
  Zap,
  Briefcase,
  Users,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  XOctagon,
  Globe,
  Calendar,
  DollarSign,
  Clock,
  Edit3,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  AlertCircle,
  TrendingUp,
  Download,
  Flag,
  Brain,
  AlertTriangle,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  Eye,
  Lock,
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
import type { Document, ProcessStep, Fee, AdminNote, EditModeContextType } from './VisaProviderDetail'; // Re-added EditModeContextType as it's used

// ============================================
// TAB 1: OVERVIEW - ✅ PROPER EDIT MODE
// ============================================

export const VisaOverviewTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { visaData, setVisaData, addActivityLog } = context;

  // Local edit state for this tab only
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(visaData);
  const [originalData, setOriginalData] = useState(visaData);

  // Enter Edit Mode
  const handleStartEdit = () => {
    setOriginalData({ ...visaData }); // Store original for Cancel
    setEditedData({ ...visaData }); // Create working copy
    setIsEditing(true);
    toast.info('📝 Edit mode enabled - make your changes');
  };

  // Cancel - Revert all changes
  const handleCancel = () => {
    setEditedData({ ...originalData }); // Restore original
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  // Save - Persist changes
  const handleSave = () => {
    if (!editedData.name || editedData.name.trim() === '') {
      toast.error('Visa name is required');
      return;
    }

    setVisaData(editedData); // Update parent state
    setIsEditing(false);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Overview',
      summary: 'Updated visa overview information',
    });

    toast.success('✅ Overview updated successfully');
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleCountriesChange = (value: string) => {
    const countries = value.split(',').map(s => s.trim()).filter(Boolean);
    setEditedData({ ...editedData, supportedCountries: countries });
  };

  const currentData = isEditing ? editedData : visaData;

  return (
    <div className="space-y-6">
      {/* Edit Mode Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Visa Overview</h2>
            {isEditing && (
              <span className="flex items-center gap-1.5 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 font-semibold">
                <Edit3 size={12} />
                Editing Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={handleStartEdit}
                size="sm"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Edit3 size={14} />
                Edit Visa
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <X size={14} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save size={14} />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Visa Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Visa Summary</h2>
        </div>

        <div className="space-y-4">
          {/* Visa ID - LOCKED */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-xs text-gray-500">Visa ID</div>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Lock size={10} />
                  LOCKED
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900 font-mono">{currentData.id}</div>
            </div>
          </div>

          {/* Visa Name - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Visa Name
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={currentData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                placeholder="Enter visa name"
              />
            ) : (
              <div className="text-sm font-semibold text-gray-900">{currentData.name}</div>
            )}
          </div>

          {/* Category - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Category
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <select
                value={currentData.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
              >
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Tourist">Tourist</option>
                <option value="Business">Business</option>
                <option value="Family">Family</option>
              </select>
            ) : (
              <div className="text-sm font-semibold text-gray-900">{currentData.category} Visa</div>
            )}
          </div>

          {/* Short Description - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Short Description
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <textarea
                rows={2}
                value={currentData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                placeholder="Brief description of this visa type"
              />
            ) : (
              <div className="text-sm text-gray-700">{currentData.description}</div>
            )}
          </div>

          {/* Difficulty Level - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Difficulty Level
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <select
                value={currentData.difficulty}
                onChange={(e) => handleFieldChange('difficulty', e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-md text-sm font-semibold ${currentData.difficulty === 'Low' ? 'bg-emerald-100 text-emerald-900' :
                  currentData.difficulty === 'Medium' ? 'bg-amber-100 text-amber-900' :
                    'bg-red-100 text-red-900'
                  }`}>
                  {currentData.difficulty}
                </span>
              </div>
            )}
          </div>

          {/* Supported Countries - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Supported Destination Countries
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={currentData.supportedCountries.join(', ')}
                  onChange={(e) => handleCountriesChange(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
                  placeholder="Enter countries separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple countries with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentData.supportedCountries.map((country: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    {country}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status - EDITABLE */}
          <div>
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              Status
              {isEditing && <span className="text-xs text-blue-600 font-semibold">• Editable</span>}
            </div>
            {isEditing ? (
              <select
                value={currentData.riskLevel}
                onChange={(e) => handleFieldChange('riskLevel', e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            ) : (
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${currentData.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                currentData.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                {currentData.riskLevel} Risk
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Facts - Read-only */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Quick Facts</h2>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-semibold flex items-center gap-1">
            <Eye size={10} />
            READ-ONLY
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-semibold mb-1">Work Rights</div>
            <div className="text-sm text-blue-900 font-semibold">{currentData.workRights}</div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-xs text-emerald-700 font-semibold mb-1">Dependents</div>
            <div className="text-sm text-emerald-900 font-semibold">
              {currentData.dependentsAllowed ? 'Yes (Dependent visa available)' : 'No'}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-700 font-semibold mb-1">Renewal</div>
            <div className="text-sm text-purple-900 font-semibold">
              {currentData.renewalPossible ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 2: ELIGIBILITY & RULES - ✅ PROPER EDIT MODE
// ============================================

export const VisaEligibilityTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { eligibilityRules, setEligibilityRules, addActivityLog } = context;

  // Local edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedRules, setEditedRules] = useState(eligibilityRules);
  const [originalRules, setOriginalRules] = useState(eligibilityRules);

  // Enter Edit Mode
  const handleStartEdit = () => {
    setOriginalRules({ ...eligibilityRules });
    setEditedRules({ ...eligibilityRules });
    setIsEditing(true);
    toast.info('📝 Edit mode enabled - modify eligibility rules');
  };

  // Cancel - Revert
  const handleCancel = () => {
    setEditedRules({ ...originalRules });
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  // Save - Persist
  const handleSave = () => {
    setEligibilityRules(editedRules);
    setIsEditing(false);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Eligibility Rules',
      summary: 'Modified eligibility criteria',
    });

    toast.success('✅ Eligibility rules updated successfully');
  };

  const handleNationalitiesChange = (value: string) => {
    const items = value.split(',').map(s => s.trim()).filter(Boolean);
    setEditedRules({ ...editedRules, nationalities: items });
  };

  const handleDestinationsChange = (value: string) => {
    const items = value.split(',').map(s => s.trim()).filter(Boolean);
    setEditedRules({ ...editedRules, destinations: items });
  };

  const handleStudentStatusChange = (value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean);
    setEditedRules({ ...editedRules, studentStatus: items });
  };

  const handleExclusionsChange = (value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean);
    setEditedRules({ ...editedRules, exclusions: items });
  };

  const currentRules = isEditing ? editedRules : eligibilityRules;

  return (
    <div className="space-y-6">
      {/* Edit Mode Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Eligibility Rules</h2>
            {isEditing && (
              <span className="flex items-center gap-1.5 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 font-semibold">
                <Edit3 size={12} />
                Editing Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={handleStartEdit}
                size="sm"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Edit3 size={14} />
                Edit Rules
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <X size={14} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save size={14} />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rules Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Allowed Nationalities */}
          <div className={`p-4 rounded-lg border ${isEditing ? 'bg-purple-50 border-purple-300' : 'bg-blue-50 border-blue-200'}`}>
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Globe size={16} className="text-blue-600" />
              Allowed Nationalities
              {isEditing && <span className="text-xs text-blue-600">• Editable</span>}
            </h3>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={currentRules.nationalities.join(', ')}
                  onChange={(e) => handleNationalitiesChange(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Enter nationalities separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentRules.nationalities.map((item: string, idx: number) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Destination Countries */}
          <div className={`p-4 rounded-lg border ${isEditing ? 'bg-purple-50 border-purple-300' : 'bg-emerald-50 border-emerald-200'}`}>
            <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Flag size={16} className="text-emerald-600" />
              Destination Countries
              {isEditing && <span className="text-xs text-blue-600">• Editable</span>}
            </h3>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={currentRules.destinations.join(', ')}
                  onChange={(e) => handleDestinationsChange(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  placeholder="Enter countries separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentRules.destinations.map((item: string, idx: number) => (
                  <span key={idx} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Age Range & Student Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${isEditing ? 'bg-purple-50 border-purple-300' : 'bg-purple-50 border-purple-200'}`}>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Age Range
                {isEditing && <span className="text-xs text-blue-600 ml-2">• Editable</span>}
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Minimum Age</label>
                    <input
                      type="number"
                      value={currentRules.ageMin}
                      onChange={(e) => setEditedRules({ ...editedRules, ageMin: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Maximum Age (optional)</label>
                    <input
                      type="number"
                      value={currentRules.ageMax || ''}
                      onChange={(e) => setEditedRules({ ...editedRules, ageMax: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-3 py-1.5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                      placeholder="No maximum"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {currentRules.ageMin}+ years {currentRules.ageMax ? `(max ${currentRules.ageMax})` : '(no max)'}
                </p>
              )}
            </div>

            <div className={`p-4 rounded-lg border ${isEditing ? 'bg-purple-50 border-purple-300' : 'bg-amber-50 border-amber-200'}`}>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                Student Status
                {isEditing && <span className="text-xs text-blue-600 ml-2">• Editable</span>}
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    rows={3}
                    value={currentRules.studentStatus.join('\n')}
                    onChange={(e) => handleStudentStatusChange(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                    placeholder="One requirement per line"
                  />
                  <p className="text-xs text-gray-500 mt-1">One per line</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {currentRules.studentStatus.map((status: string, idx: number) => (
                    <p key={idx} className="text-xs text-gray-700">• {status}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Exclusions */}
          {(isEditing || currentRules.exclusions.length > 0) && (
            <div className={`p-4 rounded-lg border ${isEditing ? 'bg-purple-50 border-purple-300' : 'bg-red-50 border-red-200'}`}>
              <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <XOctagon size={16} className="text-red-600" />
                Special Exclusions
                {isEditing && <span className="text-xs text-blue-600">• Editable</span>}
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    rows={3}
                    value={currentRules.exclusions.join('\n')}
                    onChange={(e) => handleExclusionsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                    placeholder="One exclusion per line"
                  />
                  <p className="text-xs text-gray-500 mt-1">One per line</p>
                </div>
              ) : (
                <ul className="space-y-1">
                  {currentRules.exclusions.map((exclusion: string, idx: number) => (
                    <li key={idx} className="text-xs text-red-800">• {exclusion}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 3: REQUIRED DOCUMENTS - ✅ PROPER EDIT MODE
// ============================================

export const VisaDocumentsTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { documents, setDocuments, addActivityLog } = context;

  // Local edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedDocs, setEditedDocs] = useState<Document[]>(documents);
  const [originalDocs, setOriginalDocs] = useState<Document[]>(documents);

  // Modal states for Add/Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [formData, setFormData] = useState({ name: '', required: true, notes: '' });

  // Enter Edit Mode
  const handleStartEdit = () => {
    setOriginalDocs([...documents]);
    setEditedDocs([...documents]);
    setIsEditing(true);
    toast.info('📝 Edit mode enabled - manage documents');
  };

  // Cancel - Revert
  const handleCancel = () => {
    setEditedDocs([...originalDocs]);
    setIsEditing(false);
    toast.info('Changes cancelled');
  };

  // Save - Persist
  const handleSave = () => {
    setDocuments(editedDocs);
    setIsEditing(false);

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Required Documents',
      summary: 'Modified document requirements',
    });

    toast.success('✅ Documents updated successfully');
  };

  // Add Document
  const handleOpenAddModal = () => {
    setFormData({ name: '', required: true, notes: '' });
    setShowAddModal(true);
  };

  const handleAddDocument = () => {
    if (!formData.name.trim()) {
      toast.error('Document name is required');
      return;
    }

    const newDoc: Document = {
      id: Date.now().toString(),
      name: formData.name,
      required: formData.required,
      notes: formData.notes,
    };

    setEditedDocs([...editedDocs, newDoc]);
    setShowAddModal(false);
    toast.success('Document added');
  };

  // Edit Document
  const handleOpenEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({ name: doc.name, required: doc.required, notes: doc.notes });
    setShowEditModal(true);
  };

  const handleUpdateDocument = () => {
    if (!formData.name.trim() || !editingDoc) {
      toast.error('Document name is required');
      return;
    }

    setEditedDocs(editedDocs.map(d =>
      d.id === editingDoc.id
        ? { ...d, name: formData.name, required: formData.required, notes: formData.notes }
        : d
    ));

    setShowEditModal(false);
    setEditingDoc(null);
    toast.success('Document updated');
  };

  // Delete Document
  const handleDeleteDocument = (id: string) => {
    setEditedDocs(editedDocs.filter(d => d.id !== id));
    toast.success('Document removed');
  };

  const currentDocs = isEditing ? editedDocs : documents;

  return (
    <div className="space-y-6">
      {/* Edit Mode Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">Required Documents</h2>
            {isEditing && (
              <span className="flex items-center gap-1.5 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300 font-semibold">
                <Edit3 size={12} />
                Editing Mode
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={handleStartEdit}
                size="sm"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Edit3 size={14} />
                Manage Documents
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <X size={14} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save size={14} />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Document Checklist</h3>
          </div>
          {isEditing && (
            <Button
              onClick={handleOpenAddModal}
              size="sm"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus size={14} />
              Add Document
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {currentDocs.map((doc: Document, index: number) => (
            <div
              key={doc.id}
              className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${isEditing
                ? 'bg-purple-50 border-purple-200 hover:border-purple-400'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${doc.required
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700'
                  }`}>
                  {index + 1}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-900">{doc.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${doc.required
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {doc.required ? 'Required' : 'Optional'}
                    </span>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => handleOpenEditModal(doc)}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-purple-300 hover:bg-purple-100"
                      >
                        <Edit3 size={12} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteDocument(doc.id)}
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 border-red-300 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  )}
                </div>
                {doc.notes && (
                  <p className="text-xs text-gray-600">{doc.notes}</p>
                )}
              </div>
            </div>
          ))}

          {currentDocs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No documents configured</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus size={18} className="text-blue-600" />
              Add New Document
            </DialogTitle>
            <DialogDescription>
              Add a new required or optional document to the checklist
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Valid Passport"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirement Type
              </label>
              <select
                value={formData.required ? 'required' : 'optional'}
                onChange={(e) => setFormData({ ...formData, required: e.target.value === 'required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="required">Required</option>
                <option value="optional">Optional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes / Validation Requirements
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Valid for at least 6 months beyond intended stay"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} className="bg-blue-600 hover:bg-blue-700">
              Add Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 size={18} className="text-purple-600" />
              Edit Document
            </DialogTitle>
            <DialogDescription>
              Update document information
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Valid Passport"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requirement Type
              </label>
              <select
                value={formData.required ? 'required' : 'optional'}
                onChange={(e) => setFormData({ ...formData, required: e.target.value === 'required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="required">Required</option>
                <option value="optional">Optional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes / Validation Requirements
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Valid for at least 6 months beyond intended stay"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDocument} className="bg-purple-600 hover:bg-purple-700">
              Update Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ============================================
// REMAINING TABS - EXPORTED AS-IS (NO CHANGES NEEDED)
// ============================================

// These tabs don't need edit functionality per requirements
export { VisaProcessTab, VisaFeesTab, VisaAnalyticsTab, VisaNotesTab, VisaActivityLogTab } from './VisaDetailTabs_ReadOnly';
