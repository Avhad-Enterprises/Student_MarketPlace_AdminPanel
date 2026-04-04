'use client';

import React from 'react';
import { 
    Shield, 
    Lock, 
    Eye, 
    Trash2, 
    FileText, 
    Search, 
    AlertCircle, 
    Globe, 
    CheckCircle2,
    Database,
    Fingerprint,
    History,
    Bell,
    Scale
} from 'lucide-react';
import { ComplianceSettings } from '../../services/complianceSettingsService';

interface Props {
    settings: ComplianceSettings;
    setSettings: React.Dispatch<React.SetStateAction<ComplianceSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
    readOnly?: boolean;
}

const CompliancePrivacySettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving, readOnly = false }) => {
    const canEdit = !readOnly;

    const handleToggle = (field: keyof ComplianceSettings) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof ComplianceSettings, value: any) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const SectionHeader = ({ title, description, icon: Icon }: { title: string, description: string, icon: any }) => (
        <div className="mb-10 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                    <Icon size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#0f172b]">{title}</h2>
            </div>
            <p className="text-slate-400 font-medium text-[14px] ml-11">{description}</p>
        </div>
    );

    const ToggleRow = ({ label, sublabel, enabled, onToggle }: { label: string, sublabel: string, enabled: boolean, onToggle: () => void }) => (
        <div className={`flex items-center justify-between py-6 px-1 border-b border-gray-50 last:border-0 ${!canEdit ? 'opacity-70' : ''}`}>
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#334155]">{label}</p>
                <p className="text-[13px] text-slate-400 font-medium">{sublabel}</p>
            </div>
            <button
                onClick={onToggle}
                disabled={!canEdit}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    enabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                } ${!canEdit ? 'cursor-not-allowed' : ''}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const InputField = ({ label, sublabel, value, onChange, type = "text", placeholder = "" }: { label: string, sublabel?: string, value: any, onChange: (val: any) => void, type?: string, placeholder?: string }) => (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400 font-medium mb-2">{sublabel}</span>}
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                placeholder={placeholder}
                disabled={!canEdit}
                className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. Data Protection Rules */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Data Protection Rules" 
                        description="Configure data protection and privacy regulations compliance" 
                        icon={Shield}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Enable GDPR Mode" 
                            sublabel="Comply with European data protection" 
                            enabled={settings.gdpr_mode} 
                            onToggle={() => handleToggle('gdpr_mode')} 
                        />
                        <ToggleRow 
                            label="Enable CCPA Mode" 
                            sublabel="California privacy compliance" 
                            enabled={settings.ccpa_mode} 
                            onToggle={() => handleToggle('ccpa_mode')} 
                        />
                        <ToggleRow 
                            label="Right to be Forgotten" 
                            sublabel="Allow users to request data deletion" 
                            enabled={settings.right_to_be_forgotten} 
                            onToggle={() => handleToggle('right_to_be_forgotten')} 
                        />
                        <ToggleRow 
                            label="Data Portability" 
                            sublabel="Allow users to export their data" 
                            enabled={settings.data_portability} 
                            onToggle={() => handleToggle('data_portability')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4 items-end">
                        <InputField 
                            label="Data Retention Period (days)" 
                            sublabel="How long to keep user data after deletion request"
                            value={settings.data_retention_period} 
                            onChange={(val) => handleInputChange('data_retention_period', val)} 
                            type="number" 
                        />
                        <ToggleRow 
                            label="Anonymize Deleted Records" 
                            sublabel="Keep anonymized data for analytics" 
                            enabled={settings.anonymize_deleted} 
                            onToggle={() => handleToggle('anonymize_deleted')} 
                        />
                    </div>
                </div>

                {/* 2. Consent & Privacy */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Consent & Privacy" 
                        description="Configure user consent and privacy preferences" 
                        icon={Fingerprint}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Require Explicit Consent" 
                            sublabel="Users must opt-in for data processing" 
                            enabled={settings.require_explicit_consent} 
                            onToggle={() => handleToggle('require_explicit_consent')} 
                        />
                        <ToggleRow 
                            label="Enable Cookie Consent" 
                            sublabel="Show cookie consent banner" 
                            enabled={settings.cookie_consent} 
                            onToggle={() => handleToggle('cookie_consent')} 
                        />
                        <ToggleRow 
                            label="Enable Marketing Opt-in" 
                            sublabel="Require consent for marketing emails" 
                            enabled={settings.marketing_opt_in} 
                            onToggle={() => handleToggle('marketing_opt_in')} 
                        />
                        <ToggleRow 
                            label="Require Age Verification" 
                            sublabel="Verify user age before signup" 
                            enabled={settings.age_verification_required} 
                            onToggle={() => handleToggle('age_verification_required')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mt-6">
                        <InputField 
                            label="Privacy Policy URL" 
                            value={settings.privacy_policy_url} 
                            onChange={(val) => handleInputChange('privacy_policy_url', val)} 
                            placeholder="https://example.com/privacy"
                        />
                        <InputField 
                            label="Minimum Age" 
                            value={settings.minimum_age} 
                            onChange={(val) => handleInputChange('minimum_age', val)} 
                            type="number" 
                        />
                    </div>
                </div>

                {/* 3. Document Compliance */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Document Compliance" 
                        description="Configure document handling and compliance rules" 
                        icon={Lock}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Require Document Encryption" 
                            sublabel="Encrypt all stored documents" 
                            enabled={settings.document_encryption} 
                            onToggle={() => handleToggle('document_encryption')} 
                        />
                        <ToggleRow 
                            label="Enable Document Watermarking" 
                            sublabel="Add watermarks to sensitive documents" 
                            enabled={settings.document_watermarking} 
                            onToggle={() => handleToggle('document_watermarking')} 
                        />
                        <ToggleRow 
                            label="Enable Version Control" 
                            sublabel="Track document version history" 
                            enabled={settings.version_control} 
                            onToggle={() => handleToggle('version_control')} 
                        />
                        <ToggleRow 
                            label="Enable Compliance Tagging" 
                            sublabel="Tag documents by compliance type" 
                            enabled={settings.compliance_tagging} 
                            onToggle={() => handleToggle('compliance_tagging')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4 items-end">
                        <InputField 
                            label="Document Retention Period (years)" 
                            sublabel="Legal requirement for document retention"
                            value={settings.document_retention_years} 
                            onChange={(val) => handleInputChange('document_retention_years', val)} 
                            type="number" 
                        />
                        <ToggleRow 
                            label="Enable Automatic Expiry" 
                            sublabel="Auto-delete after retention period" 
                            enabled={settings.automatic_expiry} 
                            onToggle={() => handleToggle('automatic_expiry')} 
                        />
                    </div>
                </div>

                {/* 4. Audit & Activity Logs */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Audit & Activity Logs" 
                        description="Configure system audit logging and activity tracking" 
                        icon={History}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Enable Audit Logging" 
                            sublabel="Track all system activities" 
                            enabled={settings.enable_audit_logging} 
                            onToggle={() => handleToggle('enable_audit_logging')} 
                        />
                        <ToggleRow 
                            label="Log Data Access" 
                            sublabel="Track who accesses sensitive data" 
                            enabled={settings.log_data_access} 
                            onToggle={() => handleToggle('log_data_access')} 
                        />
                        <ToggleRow 
                            label="Log Data Modifications" 
                            sublabel="Track all data changes" 
                            enabled={settings.log_data_modifications} 
                            onToggle={() => handleToggle('log_data_modifications')} 
                        />
                        <ToggleRow 
                            label="Log User Authentication" 
                            sublabel="Track login and logout events" 
                            enabled={settings.log_user_authentication} 
                            onToggle={() => handleToggle('log_user_authentication')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4 items-end">
                        <InputField 
                            label="Audit Log Retention (days)" 
                            sublabel="How long to keep audit logs"
                            value={settings.audit_log_retention_days} 
                            onChange={(val) => handleInputChange('audit_log_retention_days', val)} 
                            type="number" 
                        />
                        <ToggleRow 
                            label="Enable Real-Time Alerts" 
                            sublabel="Alert on suspicious activities" 
                            enabled={settings.real_time_alerts} 
                            onToggle={() => handleToggle('real_time_alerts')} 
                        />
                    </div>
                </div>

                {/* 5. Regulatory Modes */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <SectionHeader 
                        title="Regulatory Modes" 
                        description="Configure compliance frameworks and regulatory standards" 
                        icon={Scale}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-bold text-[#334155]">Primary Compliance Framework</span>
                            <div className="relative">
                                <select 
                                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] appearance-none focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={settings.primary_framework}
                                    onChange={(e) => handleInputChange('primary_framework', e.target.value)}
                                    disabled={!canEdit}
                                >
                                    <option>GDPR (European Union)</option>
                                    <option>CCPA (California)</option>
                                    <option>HIPAA (United States)</option>
                                    <option>Custom Framework</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Globe size={16} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <span className="text-[14px] font-bold text-[#334155]">Data Residency Region</span>
                            <div className="relative">
                                <select 
                                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] appearance-none focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    value={settings.data_residency}
                                    onChange={(e) => handleInputChange('data_residency', e.target.value)}
                                    disabled={!canEdit}
                                >
                                    <option>European Union</option>
                                    <option>United States</option>
                                    <option>Asia Pacific</option>
                                    <option>Middle East</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <Database size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-8">
                        <ToggleRow 
                            label="SOC 2 Compliance Mode" 
                            sublabel="Enable SOC 2 Type II compliance" 
                            enabled={settings.soc2_compliance} 
                            onToggle={() => handleToggle('soc2_compliance')} 
                        />
                        <ToggleRow 
                            label="ISO 27001 Compliance" 
                            sublabel="Information security management" 
                            enabled={settings.iso27001_compliance} 
                            onToggle={() => handleToggle('iso27001_compliance')} 
                        />
                        <ToggleRow 
                            label="HIPAA Compliance" 
                            sublabel="Healthcare data protection (US)" 
                            enabled={settings.hipaa_compliance} 
                            onToggle={() => handleToggle('hipaa_compliance')} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompliancePrivacySettings;
