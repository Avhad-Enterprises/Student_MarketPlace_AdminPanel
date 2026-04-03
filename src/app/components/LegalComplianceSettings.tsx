'use client';

import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, 
    FileText, 
    Scale, 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    Save, 
    Globe, 
    Lock,
    Shield,
    Activity,
    CheckCircle
} from 'lucide-react';
import { generalSettingsService, GeneralSetting } from '../../services/generalSettingsService';
import { systemSettingsService, SystemSettings } from '@/services/systemSettingsService';
import { toast } from 'sonner';

interface ComplianceStatus {
    key: string;
    label: string;
    status: 'Complete' | 'Missing' | 'Draft';
    isRequired: boolean;
}

const LegalComplianceSettings: React.FC = () => {
    const [settings, setSettings] = useState<GeneralSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form States
    const [privacyPolicy, setPrivacyPolicy] = useState('');
    const [termsOfUse, setTermsOfUse] = useState('');
    const [gdprEnabled, setGdprEnabled] = useState(false);
    
    // Platform Identity
    const [platformName, setPlatformName] = useState('');
    const [supportEmail, setSupportEmail] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const data = await generalSettingsService.getAll();
            setSettings(data);
            
            // Map settings to local state
            const pp = data.find(s => s.key === 'privacy_policy')?.value || '';
            const tou = data.find(s => s.key === 'terms_of_use')?.value || '';
            const gdpr = data.find(s => s.key === 'gdpr_enabled')?.value === 'true';
            
            setPrivacyPolicy(pp);
            setTermsOfUse(tou);
            setGdprEnabled(gdpr);

            // Fetch System Settings
            const sysRes = await systemSettingsService.getSystemSettings();
            setPlatformName(sysRes.data?.platform_name || '');
            setSupportEmail(sysRes.data?.support_email || '');
        } catch (error) {
            toast.error('Failed to load legal settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await generalSettingsService.bulkUpdate([
                { key: 'privacy_policy', value: privacyPolicy, group_name: 'legal' },
                { key: 'terms_of_use', value: termsOfUse, group_name: 'legal' },
                { key: 'gdpr_enabled', value: gdprEnabled.toString(), group_name: 'compliance' }
            ]);

            // Save System Settings
            await systemSettingsService.updateSystemSettings({
                platform_name: platformName,
                support_email: supportEmail
            } as any);

            toast.success('Legal and Compliance settings updated');
            fetchSettings();
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const getComplianceChecklist = (): ComplianceStatus[] => [
        { key: 'privacy_policy', label: 'Privacy Policy', status: privacyPolicy.length > 100 ? 'Complete' : privacyPolicy.length > 0 ? 'Draft' : 'Missing', isRequired: true },
        { key: 'terms_of_use', label: 'Terms of Use', status: termsOfUse.length > 100 ? 'Complete' : termsOfUse.length > 0 ? 'Draft' : 'Missing', isRequired: true },
        { key: 'gdpr_enabled', label: 'GDPR Enforcement', status: gdprEnabled ? 'Complete' : 'Missing', isRequired: true }
    ];

    const readinessScore = () => {
        const checks = getComplianceChecklist();
        const completed = checks.filter(c => c.status === 'Complete').length;
        return Math.round((completed / checks.length) * 100);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <CheckCircle2 className="w-10 h-10 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">Analyzing compliance readiness...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1250px] mx-auto pb-20 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Readiness Card */}
            <div className="bg-[#0f172b] rounded-[32px] p-10 mb-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <ShieldCheck size={180} className="text-white" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <Activity size={14} />
                                Launch Readiness Audit
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Legal & Compliance Readiness</h1>
                            <p className="text-slate-400 max-w-xl text-lg font-medium">
                                Ensure your platform satisfies all legal requirements and data protection regulations before going live.
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-w-[240px] text-center">
                            <div className="text-5xl font-black text-white mb-2">{readinessScore()}%</div>
                            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Readiness Score</div>
                            <div className="mt-6 w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                                    style={{ width: `${readinessScore()}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Legal Documents */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0f172b]">Legal Agreements</h2>
                                <p className="text-slate-400 font-medium text-sm">Draft your public legal documents</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-[#334155]">Privacy Policy</label>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                        privacyPolicy.length > 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {privacyPolicy.length} characters
                                    </span>
                                </div>
                                <textarea
                                    className="w-full min-h-[300px] bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                                    placeholder="Enter Privacy Policy content..."
                                    value={privacyPolicy}
                                    onChange={(e) => setPrivacyPolicy(e.target.value)}
                                />
                                <p className="text-[12px] text-slate-400 flex items-center gap-1.5 font-medium">
                                    <Info size={14} /> Supports plain text or HTML formatting. Ensure data collection methods are disclosed.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-[#334155]">Terms of Use</label>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                        termsOfUse.length > 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                        {termsOfUse.length} characters
                                    </span>
                                </div>
                                <textarea
                                    className="w-full min-h-[300px] bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-indigo-500 transition-all resize-none shadow-inner"
                                    placeholder="Enter Terms of Use content..."
                                    value={termsOfUse}
                                    onChange={(e) => setTermsOfUse(e.target.value)}
                                />
                                <p className="text-[12px] text-slate-400 flex items-center gap-1.5 font-medium">
                                    <Info size={14} /> Define user responsibilities, limitations of liability, and governing law.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Protection */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0f172b]">Compliance Enforcement</h2>
                                <p className="text-slate-400 font-medium text-sm">Global data protection standards</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-6 bg-[#f8fafc] rounded-2xl border border-slate-100">
                            <div className="space-y-1">
                                <h4 className="text-[15px] font-bold text-[#0f172b]">Global GDPR Enforcement</h4>
                                <p className="text-[13px] text-slate-400 font-medium">Automatically enforce strict data access and deletion rules across the system.</p>
                            </div>
                            <button
                                onClick={() => setGdprEnabled(!gdprEnabled)}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none ${
                                    gdprEnabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                                }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                                        gdprEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Platform Identity */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-10 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-8">
                            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0f172b]">Platform Identity</h2>
                                <p className="text-slate-400 font-medium text-sm">Public facing identity and contact info</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#334155]">Display Name</label>
                                <input
                                    className="w-full h-[60px] bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-6 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="Enter Platform Name"
                                    value={platformName}
                                    onChange={(e) => setPlatformName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-[#334155]">Support Contact Email</label>
                                <input
                                    className="w-full h-[60px] bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-6 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="support@example.com"
                                    value={supportEmail}
                                    onChange={(e) => setSupportEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Actions */}
                <div className="space-y-8">
                    {/* Readiness Checklist */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0f172b] mb-6 flex items-center gap-2">
                            <Scale size={20} className="text-indigo-600" />
                            Readiness Checklist
                        </h3>
                        
                        <div className="space-y-4">
                            {getComplianceChecklist().map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        {item.status === 'Complete' ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : item.status === 'Draft' ? (
                                            <AlertCircle size={18} className="text-amber-500" />
                                        ) : (
                                            <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-200" />
                                        )}
                                        <span className="text-[14px] font-bold text-slate-600">{item.label}</span>
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                        item.status === 'Complete' ? 'text-emerald-600' : 
                                        item.status === 'Draft' ? 'text-amber-600' : 'text-slate-400'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full h-[60px] bg-[#0f172b] hover:bg-[#1e293b] text-white rounded-2xl text-[15px] font-bold transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving Changes...' : 'Save Compliance Settings'}
                                <Save size={18} />
                            </button>
                            <p className="text-center text-[12px] text-slate-400 mt-4 font-medium uppercase tracking-widest">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute -bottom-6 -right-6 opacity-10">
                            <Globe size={120} />
                        </div>
                        <h3 className="text-lg font-bold mb-4 relative z-10 flex items-center gap-2">
                            <Info size={20} />
                            Compliance Tips
                        </h3>
                        <p className="text-indigo-100 text-[13px] font-medium leading-relaxed relative z-10">
                            GDPR requires that users can easily request data export or deletion. Ensure your support team is trained to handle these requests via the Audit Logs.
                        </p>
                        <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[12px] font-bold transition-all border border-white/20 relative z-10">
                            View GDPR Guidelines
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalComplianceSettings;
