'use client';

import React, { useState, useEffect } from 'react';
import { AIVisaAssistantSettings } from '@/app/components/AIVisaAssistantSettings';
import { AdminLayout } from '@/app/components/AdminLayout';
import { aiVisaSettingsService, AiVisaSettings } from '@/services/aiVisaSettingsService';
import { toast } from 'sonner';
import { Loader2, Save, Activity, Settings } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { PermissionGuard } from '@/app/components/common/PermissionGuard';

export default function AIVisaSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [settings, setSettings] = useState<AiVisaSettings>({
        enable_ai_assistant: true,
        ai_mode: 'Balanced',
        risk_sensitivity: 'Medium',
        confidence_threshold: 60,
        escalation_threshold: 60,
        prompt_template: '',
        allow_country_injection: true,
        allow_document_injection: true,
        allow_financial_injection: false,
        enable_response_explanations: true,
        block_unverified_data: true,
        require_manual_review: true,
        log_decisions: true,
        enable_audit_trail: true,
        require_human_approval: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await aiVisaSettingsService.getSettings();
            if (data) {
                setSettings(data);
                if (data.updated_at) {
                    setLastUpdated(new Date(data.updated_at).toLocaleString());
                }
            }
        } catch (error) {
            console.error('Failed to fetch AI Visa settings:', error);
            toast.error('Failed to load AI Visa settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { id, updated_at, ...cleanSettings } = settings as any;
            await aiVisaSettingsService.updateSettings(cleanSettings);
            toast.success('AI Visa Assistant settings updated successfully');
            setLastUpdated(new Date().toLocaleString());
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout activePage="ai-setup">
            <PermissionGuard module="ai-visa-assistant" action="view">
                <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-tr from-[#6929c4] to-[#8a3ffc] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/10 transition-transform hover:scale-105 duration-300">
                                    <Settings size={24} className="text-white" />
                                </div>
                                <h1 className="text-[32px] font-extrabold text-[#0f172b] tracking-tight">AI Visa Intelligence</h1>
                            </div>
                            <p className="text-gray-500 font-medium text-[16px] ml-1">Configure advanced AI parameters for visa assessment and risk analysis</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {lastUpdated && (
                                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100">
                                    <Activity size={16} className="text-[#6929c4]" />
                                    <span className="text-xs font-bold text-[#6929c4]">Last Synced: {lastUpdated}</span>
                                </div>
                            )}
                            <PermissionGuard module="ai-visa-assistant" action="edit">
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || isLoading}
                                    className="bg-[#0f172b] hover:bg-[#1a2340] text-white h-[58px] px-10 rounded-2xl font-bold flex items-center gap-3 transition-all hover:translate-y-[-2px] active:translate-y-0 shadow-xl shadow-purple-900/10"
                                >
                                    {isSaving ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <Save size={20} />
                                    )}
                                    Save Configuration
                                </Button>
                            </PermissionGuard>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm min-h-[500px]">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-purple-100 border-t-[#6929c4] rounded-full animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-[#6929c4] rounded-full animate-pulse" />
                                </div>
                            </div>
                            <p className="mt-6 text-[#64748b] font-bold text-[15px] tracking-wide animate-pulse uppercase">Initializing AI Module...</p>
                        </div>
                    ) : (
                        <AIVisaAssistantSettings settings={settings} setSettings={setSettings} />
                    )}
                </div>
            </PermissionGuard>
        </AdminLayout>
    );
}
