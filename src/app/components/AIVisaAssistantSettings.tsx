'use client';

import React from 'react';
import { 
    Bot, 
    Zap, 
    Shield, 
    AlertTriangle, 
    MessageSquare, 
    FileText, 
    Lock, 
    Eye, 
    History,
    CheckCircle2,
    Info,
    ChevronDown,
    Activity,
    Settings,
    FileCheck,
    BarChart3
} from 'lucide-react';
import { AiVisaSettings } from '../../services/aiVisaSettingsService';

interface Props {
    settings: AiVisaSettings;
    setSettings: React.Dispatch<React.SetStateAction<AiVisaSettings>>;
}

export const AIVisaAssistantSettings: React.FC<Props> = ({ settings, setSettings }) => {
    const handleChange = (field: keyof AiVisaSettings, value: any) => {
        setSettings((prev: AiVisaSettings) => ({ ...prev, [field]: value }));
    };

    const Toggle = ({ enabled, onChange, label, sublabel }: { enabled: boolean, onChange: (val: boolean) => void, label: string, sublabel?: string }) => (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all group">
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#0f172b] group-hover:text-[#6929c4] transition-colors">{label}</p>
                {sublabel && <p className="text-[13px] text-gray-400 font-medium">{sublabel}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    enabled ? 'bg-[#6929c4] shadow-[0_0_15px_rgba(105,41,196,0.2)]' : 'bg-gray-200 shadow-inner'
                }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-spring ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const Slider = ({ value, onChange, label, min = 0, max = 100, sublabel }: { value: number, onChange: (val: number) => void, label: string, min?: number, max?: number, sublabel?: string }) => (
        <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <label className="text-[14px] font-bold text-[#64748b] uppercase tracking-wider">{label}</label>
                    {sublabel && <p className="text-[12px] text-gray-400 mt-0.5">{sublabel}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-16 h-10 bg-gray-50 border border-gray-200 rounded-xl px-2 text-center font-bold text-[#0f172b] focus:border-[#6929c4] focus:bg-white outline-none transition-all"
                    />
                    <span className="text-gray-400 font-bold">%</span>
                </div>
            </div>
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden group">
                <div 
                    className="absolute h-full bg-gradient-to-r from-[#6929c4] to-[#8a3ffc] rounded-full transition-all duration-500 group-hover:brightness-110"
                    style={{ width: `${value}%` }}
                />
                <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    value={value} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* AI Behavior Configuration */}
            <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                            <Activity className="text-[#6929c4]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">AI Behavior Configuration</h2>
                            <p className="text-gray-400 font-medium">Control how the AI assistant makes decisions and recommendations</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                        <Toggle 
                            label="Enable AI Visa Assistant" 
                            sublabel="Activate AI-powered visa recommendation and risk assessment"
                            enabled={settings.enable_ai_assistant}
                            onChange={(val) => handleChange('enable_ai_assistant', val)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">AI Mode</label>
                            <div className="relative group">
                                <select 
                                    className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white appearance-none cursor-pointer text-[15px] font-bold pr-12 shadow-sm"
                                    value={settings.ai_mode}
                                    onChange={(e) => handleChange('ai_mode', e.target.value)}
                                >
                                    <option value="Balanced">Balanced - Moderate risk tolerance with data-driven decisions</option>
                                    <option value="Conservative">Conservative - Low risk tolerance, prioritizes compliance</option>
                                    <option value="Aggressive">Aggressive - High risk tolerance, focuses on opportunity</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6929c4] transition-colors pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Risk Sensitivity Level</label>
                            <div className="relative group">
                                <select 
                                    className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-white appearance-none cursor-pointer text-[15px] font-bold pr-12 shadow-sm"
                                    value={settings.risk_sensitivity}
                                    onChange={(e) => handleChange('risk_sensitivity', e.target.value)}
                                >
                                    <option value="Medium">Medium - Balanced risk assessment</option>
                                    <option value="Low">Low - Minimal scrutiny, focuses on basic criteria</option>
                                    <option value="High">High - Maximum scrutiny, identifies all potential flags</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#6929c4] transition-colors pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-4">
                        <Slider 
                            label="Confidence Threshold (%)" 
                            sublabel="Minimum confidence level required for AI recommendations"
                            value={settings.confidence_threshold}
                            onChange={(val) => handleChange('confidence_threshold', val)}
                        />
                        <Slider 
                            label="Escalation Trigger Threshold (%)" 
                            sublabel="Risk score threshold that triggers human review"
                            value={settings.escalation_threshold}
                            onChange={(val) => handleChange('escalation_threshold', val)}
                        />
                    </div>
                </div>
            </div>

            {/* Prompt & Response Control */}
            <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="text-blue-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Prompt & Response Control</h2>
                            <p className="text-gray-400 font-medium">Configure AI prompt templates and data injection settings</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Prompt Template</label>
                        <div className="relative">
                            <textarea 
                                className="w-full min-h-[160px] p-8 rounded-[32px] border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[15px] font-medium leading-relaxed resize-none shadow-inner"
                                placeholder="Enter base prompt for AI assessments..."
                                value={settings.prompt_template}
                                onChange={(e) => handleChange('prompt_template', e.target.value)}
                            />
                            <div className="absolute top-6 left-6 -z-10 bg-gradient-to-r from-purple-500/5 to-blue-500/5 blur-xl w-[calc(100%-48px)] h-[calc(100%-48px)]" />
                        </div>
                        <p className="text-[12px] text-gray-400 ml-1 font-medium">Base prompt used for all AI visa assessments.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm">
                            <Toggle 
                                label="Allow Dynamic Country Prompt Injection" 
                                sublabel="Inject country-specific requirements and rules into AI prompts"
                                enabled={settings.allow_country_injection}
                                onChange={(val) => handleChange('allow_country_injection', val)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-4" />
                            <Toggle 
                                label="Allow Document Context Injection" 
                                sublabel="Include student document data in AI analysis context"
                                enabled={settings.allow_document_injection}
                                onChange={(val) => handleChange('allow_document_injection', val)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-4" />
                            <Toggle 
                                label="Allow Financial Data Injection" 
                                sublabel="Include student financial information in AI assessment"
                                enabled={settings.allow_financial_injection}
                                onChange={(val) => handleChange('allow_financial_injection', val)}
                            />
                            <div className="h-[1px] bg-gray-100 mx-4" />
                            <Toggle 
                                label="Enable Response Explanation Mode" 
                                sublabel="AI provides detailed explanations for all recommendations"
                                enabled={settings.enable_response_explanations}
                                onChange={(val) => handleChange('enable_response_explanations', val)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Safety & Guardrails */}
            <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <Shield className="text-emerald-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-[24px] font-bold text-[#0f172b] tracking-tight">Safety & Guardrails</h2>
                            <p className="text-gray-400 font-medium">Configure safety controls and compliance requirements for AI operations</p>
                        </div>
                    </div>
                </div>

                <div className="p-2 bg-white rounded-3xl border border-gray-100/50 shadow-sm">
                    <Toggle 
                        label="Block Unverified Student Data" 
                        sublabel="Prevent AI from processing student profiles with unverified information"
                        enabled={settings.block_unverified_data}
                        onChange={(val) => handleChange('block_unverified_data', val)}
                    />
                    <div className="h-[1px] bg-gray-100 mx-4" />
                    <Toggle 
                        label="Require Manual Review for High-Risk Cases" 
                        sublabel="Flag high-risk assessments for human counsellor review before proceeding"
                        enabled={settings.require_manual_review}
                        onChange={(val) => handleChange('require_manual_review', val)}
                    />
                    <div className="h-[1px] bg-gray-100 mx-4" />
                    <Toggle 
                        label="Log All AI Decisions" 
                        sublabel="Maintain comprehensive logs of all AI recommendations and decisions"
                        enabled={settings.log_decisions}
                        onChange={(val) => handleChange('log_decisions', val)}
                    />
                    <div className="h-[1px] bg-gray-100 mx-4" />
                    <Toggle 
                        label="Enable AI Audit Trail" 
                        sublabel="Create detailed audit trails for compliance and quality assurance"
                        enabled={settings.enable_audit_trail}
                        onChange={(val) => handleChange('enable_audit_trail', val)}
                    />
                    <div className="h-[1px] bg-gray-100 mx-4" />
                    <Toggle 
                        label="Enable Human Approval Required" 
                        sublabel="Require human approval for all AI-generated recommendations"
                        enabled={settings.require_human_approval}
                        onChange={(val) => handleChange('require_human_approval', val)}
                    />
                </div>
            </div>
        </div>
    );
};


