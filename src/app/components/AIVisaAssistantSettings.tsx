import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AIVisaAssistantSettingsProps {
    onBack?: () => void;
}

export const AIVisaAssistantSettings: React.FC<AIVisaAssistantSettingsProps> = ({ onBack }) => {
    // AI Behavior Configuration
    const [enableAIVisaAssistant, setEnableAIVisaAssistant] = useState(true);
    const [aiMode, setAIMode] = useState('balanced');
    const [riskSensitivityLevel, setRiskSensitivityLevel] = useState('medium');
    const [confidenceThreshold, setConfidenceThreshold] = useState(75);
    const [escalationTriggerThreshold, setEscalationTriggerThreshold] = useState(60);

    // Prompt & Response Control
    const [defaultPromptTemplate, setDefaultPromptTemplate] = useState(
        'Analyze the student profile and provide a comprehensive visa assessment. Consider academic background, financial situation, English proficiency, work experience, and destination country requirements. Provide recommendations for countries with the highest visa success probability.'
    );
    const [allowDynamicCountryPromptInjection, setAllowDynamicCountryPromptInjection] = useState(true);
    const [allowDocumentContextInjection, setAllowDocumentContextInjection] = useState(true);
    const [allowFinancialDataInjection, setAllowFinancialDataInjection] = useState(false);
    const [enableResponseExplanationMode, setEnableResponseExplanationMode] = useState(true);

    // Safety & Guardrails
    const [blockUnverifiedStudentData, setBlockUnverifiedStudentData] = useState(true);
    const [requireManualReviewHighRisk, setRequireManualReviewHighRisk] = useState(true);
    const [logAllAIDecisions, setLogAllAIDecisions] = useState(true);
    const [enableAIAuditTrail, setEnableAIAuditTrail] = useState(true);
    const [enableHumanApprovalRequired, setEnableHumanApprovalRequired] = useState(false);

    const handleSave = () => {
        if (confidenceThreshold < 0 || confidenceThreshold > 100) {
            toast.error('Confidence threshold must be between 0 and 100');
            return;
        }

        if (escalationTriggerThreshold < 0 || escalationTriggerThreshold > 100) {
            toast.error('Escalation trigger threshold must be between 0 and 100');
            return;
        }

        toast.success('AI Visa Assistant settings saved successfully');
    };

    return (
        <div className="w-full px-4 sm:px-8 lg:px-10 py-6 md:py-10 bg-gray-50 min-h-screen">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#62748e] hover:text-[#0e042f] transition-colors mb-4"
                    >
                        <ChevronLeft size={20} />
                        <span className="font-medium">Back to Settings</span>
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0f172b] mb-2">AI Visa Assistant Settings</h1>
                            <p className="text-[#62748e]">Configure AI behavior, prompts, and safety controls for visa recommendations</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 h-12 rounded-xl bg-[#0e042f] text-white hover:bg-[#1a0c4a] transition-colors font-medium"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Card 1: AI Behavior Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#0f172b] mb-1">AI Behavior Configuration</h2>
                        <p className="text-sm text-[#62748e]">Control how the AI assistant makes decisions and recommendations</p>
                    </div>

                    <div className="space-y-6">
                        {/* Enable AI Visa Assistant */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Enable AI Visa Assistant</p>
                                <p className="text-sm text-[#62748e]">Activate AI-powered visa recommendation and risk assessment</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableAIVisaAssistant}
                                    onChange={(e) => setEnableAIVisaAssistant(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* AI Mode */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172b] mb-2">
                                    AI Mode
                                </label>
                                <select
                                    value={aiMode}
                                    onChange={(e) => setAIMode(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0e042f] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                >
                                    <option value="conservative">Conservative - Prioritizes safety and proven outcomes</option>
                                    <option value="balanced">Balanced - Moderate risk tolerance with data-driven decisions</option>
                                    <option value="aggressive">Aggressive - Maximizes opportunities with higher risk acceptance</option>
                                </select>
                                <p className="text-xs text-[#62748e] mt-2">Controls how cautious the AI is in its recommendations</p>
                            </div>

                            {/* Risk Sensitivity Level */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172b] mb-2">
                                    Risk Sensitivity Level
                                </label>
                                <select
                                    value={riskSensitivityLevel}
                                    onChange={(e) => setRiskSensitivityLevel(e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-[#0e042f] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                >
                                    <option value="low">Low - Minimal risk flagging</option>
                                    <option value="medium">Medium - Balanced risk assessment</option>
                                    <option value="high">High - Strict risk evaluation</option>
                                </select>
                                <p className="text-xs text-[#62748e] mt-2">How sensitive the AI is to risk factors</p>
                            </div>

                            {/* Confidence Threshold */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172b] mb-2">
                                    Confidence Threshold (%)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={confidenceThreshold}
                                        onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0e042f]"
                                    />
                                    <input
                                        type="number"
                                        value={confidenceThreshold}
                                        onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                                        className="w-20 h-12 px-3 rounded-xl border border-gray-200 text-center focus:border-[#0e042f] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                        min="0"
                                        max="100"
                                    />
                                    <span className="text-sm text-[#62748e]">%</span>
                                </div>
                                <p className="text-xs text-[#62748e] mt-2">Minimum confidence level required for AI recommendations</p>
                            </div>

                            {/* Escalation Trigger Threshold */}
                            <div>
                                <label className="block text-sm font-medium text-[#0f172b] mb-2">
                                    Escalation Trigger Threshold (%)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={escalationTriggerThreshold}
                                        onChange={(e) => setEscalationTriggerThreshold(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0e042f]"
                                    />
                                    <input
                                        type="number"
                                        value={escalationTriggerThreshold}
                                        onChange={(e) => setEscalationTriggerThreshold(parseInt(e.target.value))}
                                        className="w-20 h-12 px-3 rounded-xl border border-gray-200 text-center focus:border-[#0e042f] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                        min="0"
                                        max="100"
                                    />
                                    <span className="text-sm text-[#62748e]">%</span>
                                </div>
                                <p className="text-xs text-[#62748e] mt-2">Risk score threshold that triggers human review</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Prompt & Response Control */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#0f172b] mb-1">Prompt & Response Control</h2>
                        <p className="text-sm text-[#62748e]">Configure AI prompt templates and data injection settings</p>
                    </div>

                    <div className="space-y-6">
                        {/* Default Prompt Template */}
                        <div>
                            <label className="block text-sm font-medium text-[#0f172b] mb-2">
                                Default Prompt Template
                            </label>
                            <textarea
                                value={defaultPromptTemplate}
                                onChange={(e) => setDefaultPromptTemplate(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0e042f] focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                                placeholder="Enter the default AI prompt template..."
                            />
                            <p className="text-xs text-[#62748e] mt-2">Base prompt used for all AI visa assessments</p>
                        </div>

                        {/* Allow Dynamic Country Prompt Injection */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Allow Dynamic Country Prompt Injection</p>
                                <p className="text-sm text-[#62748e]">Inject country-specific requirements and rules into AI prompts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowDynamicCountryPromptInjection}
                                    onChange={(e) => setAllowDynamicCountryPromptInjection(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Allow Document Context Injection */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Allow Document Context Injection</p>
                                <p className="text-sm text-[#62748e]">Include student document data in AI analysis context</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowDocumentContextInjection}
                                    onChange={(e) => setAllowDocumentContextInjection(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Allow Financial Data Injection */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Allow Financial Data Injection</p>
                                <p className="text-sm text-[#62748e]">Include student financial information in AI assessment</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allowFinancialDataInjection}
                                    onChange={(e) => setAllowFinancialDataInjection(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Enable Response Explanation Mode */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Enable Response Explanation Mode</p>
                                <p className="text-sm text-[#62748e]">AI provides detailed explanations for all recommendations</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableResponseExplanationMode}
                                    onChange={(e) => setEnableResponseExplanationMode(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Card 3: Safety & Guardrails */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-[#0f172b] mb-1">Safety & Guardrails</h2>
                        <p className="text-sm text-[#62748e]">Configure safety controls and compliance requirements for AI operations</p>
                    </div>

                    <div className="space-y-4">
                        {/* Block Unverified Student Data */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Block Unverified Student Data</p>
                                <p className="text-sm text-[#62748e]">Prevent AI from processing student profiles with unverified information</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={blockUnverifiedStudentData}
                                    onChange={(e) => setBlockUnverifiedStudentData(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Require Manual Review for High-Risk Cases */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Require Manual Review for High-Risk Cases</p>
                                <p className="text-sm text-[#62748e]">Flag high-risk assessments for human counsellor review before proceeding</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={requireManualReviewHighRisk}
                                    onChange={(e) => setRequireManualReviewHighRisk(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Log All AI Decisions */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Log All AI Decisions</p>
                                <p className="text-sm text-[#62748e]">Maintain comprehensive logs of all AI recommendations and decisions</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={logAllAIDecisions}
                                    onChange={(e) => setLogAllAIDecisions(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Enable AI Audit Trail */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Enable AI Audit Trail</p>
                                <p className="text-sm text-[#62748e]">Create detailed audit trails for compliance and quality assurance</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableAIAuditTrail}
                                    onChange={(e) => setEnableAIAuditTrail(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>

                        {/* Enable Human Approval Required */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-[#0f172b]">Enable Human Approval Required</p>
                                <p className="text-sm text-[#62748e]">Require human approval for all AI-generated recommendations</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enableHumanApprovalRequired}
                                    onChange={(e) => setEnableHumanApprovalRequired(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0e042f]"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
