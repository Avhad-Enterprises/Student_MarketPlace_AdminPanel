'use client';

import React, { useState } from 'react';
import { 
    Key, 
    Webhook, 
    Share2, 
    Server, 
    FileOutput, 
    Eye, 
    EyeOff, 
    RotateCcw, 
    ShieldCheck, 
    Zap, 
    Activity,
    CheckCircle2,
    RefreshCw,
    Play,
    FileJson,
    FileSpreadsheet,
    Database
} from 'lucide-react';
import { IntegrationSettings } from '../../services/integrationSettingsService';

interface Props {
    settings: IntegrationSettings;
    setSettings: React.Dispatch<React.SetStateAction<IntegrationSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
}

const IntegrationApiSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving }) => {
    const [showApiKey, setShowApiKey] = useState(false);
    const [showWebhookSecret, setShowWebhookSecret] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    const handleToggle = (field: keyof IntegrationSettings) => {
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof IntegrationSettings, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxGridUpdate = (field: 'webhook_events', value: string) => {
        const currentArray = JSON.parse(settings[field]);
        let newArray;
        if (currentArray.includes(value)) {
            newArray = currentArray.filter((item: string) => item !== value);
        } else {
            newArray = [...currentArray, value];
        }
        handleInputChange(field, JSON.stringify(newArray));
    };

    const handleTestConnection = () => {
        setIsTestingConnection(true);
        setTimeout(() => {
            setIsTestingConnection(false);
        }, 1500);
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
        <div className="flex items-center justify-between py-6 px-1 border-b border-gray-50 last:border-0">
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#334155]">{label}</p>
                <p className="text-[13px] text-slate-400 font-medium">{sublabel}</p>
            </div>
            <button
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    enabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );

    const InputField = ({ label, sublabel, value, onChange, type = "text", placeholder = "", rightElement = null }: { label: string, sublabel?: string, value: any, onChange: (val: any) => void, type?: string, placeholder?: string, rightElement?: React.ReactNode }) => (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400 font-medium mb-2">{sublabel}</span>}
            </div>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                />
                {rightElement && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );

    const SelectField = ({ label, sublabel, value, options, onChange }: { label: string, sublabel?: string, value: string, options: string[], onChange: (val: string) => void }) => (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400 font-medium mb-2">{sublabel}</span>}
            </div>
            <div className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 appearance-none text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all"
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Share2 size={16} />
                </div>
            </div>
        </div>
    );

    const webhookOptions = ['Student Created', 'Application Updated', 'Payment Completed', 'Visa Status Changed', 'Document Uploaded'];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. API Access & Keys */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="API Access & Keys" 
                        description="Configure API authentication and access control" 
                        icon={Key}
                    />
                    
                    <ToggleRow 
                        label="Enable Public API Access" 
                        sublabel="Allow external systems to access your API" 
                        enabled={settings.enable_public_api} 
                        onToggle={() => handleToggle('enable_public_api')} 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
                        <InputField 
                            label="API Key" 
                            value={settings.api_key} 
                            onChange={(val) => handleInputChange('api_key', val)} 
                            type={showApiKey ? 'text' : 'password'}
                            rightElement={
                                <>
                                    <button onClick={() => setShowApiKey(!showApiKey)} className="text-slate-400 hover:text-[#0f172b] transition-colors">
                                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    <button className="text-slate-400 hover:text-[#0f172b] transition-colors">
                                        <RotateCcw size={18} />
                                    </button>
                                </>
                            }
                        />
                        <SelectField 
                            label="API Key Rotation" 
                            value={settings.api_key_rotation} 
                            options={['Manual', 'Every 30 Days', 'Every 90 Days', 'Annually']} 
                            onChange={(val) => handleInputChange('api_key_rotation', val)} 
                        />
                        <InputField 
                            label="API Key Expiry (days)" 
                            value={settings.api_key_expiry_days} 
                            onChange={(val) => handleInputChange('api_key_expiry_days', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="API Rate Limit (requests/minute)" 
                            value={settings.api_rate_limit} 
                            onChange={(val) => handleInputChange('api_rate_limit', val)} 
                            type="number" 
                        />
                    </div>

                    <div className="mt-8 flex flex-col gap-2">
                        <span className="text-[14px] font-bold text-[#334155]">Allowed IP Whitelist</span>
                        <span className="text-[12px] text-slate-400 font-medium mb-1">Leave empty to allow all IPs</span>
                        <textarea 
                            value={settings.allowed_ip_whitelist}
                            onChange={(e) => handleInputChange('allowed_ip_whitelist', e.target.value)}
                            className="w-full min-h-[100px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all no-scrollbar"
                            placeholder="192.168.1.1, 10.0.0.1"
                        />
                    </div>

                    <div className="mt-8 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-[#0f172b]" />
                            <span className="text-[13px] font-bold text-[#334155]">API Usage Logs</span>
                            <span className="text-[13px] text-slate-400 font-medium">12,456 requests in the last 30 days</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">Active</span>
                    </div>
                </div>

                {/* 2. Webhook Configuration */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Webhook Configuration" 
                        description="Configure webhook endpoints and event notifications" 
                        icon={Webhook}
                    />
                    
                    <ToggleRow 
                        label="Enable Webhooks" 
                        sublabel="Send real-time event notifications" 
                        enabled={settings.enable_webhooks} 
                        onToggle={() => handleToggle('enable_webhooks')} 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
                        <InputField 
                            label="Webhook Endpoint URL" 
                            value={settings.webhook_endpoint_url} 
                            onChange={(val) => handleInputChange('webhook_endpoint_url', val)} 
                            placeholder="https://api.example.com/webhooks"
                        />
                        <InputField 
                            label="Webhook Secret Key" 
                            value={settings.webhook_secret_key} 
                            onChange={(val) => handleInputChange('webhook_secret_key', val)} 
                            type={showWebhookSecret ? 'text' : 'password'}
                            rightElement={
                                <button onClick={() => setShowWebhookSecret(!showWebhookSecret)} className="text-slate-400 hover:text-[#0f172b] transition-colors">
                                    {showWebhookSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                    </div>
                    
                    <div className="max-w-md mt-4">
                        <SelectField 
                            label="Retry Policy" 
                            value={settings.webhook_retry_policy} 
                            options={['Exponential Backoff', 'Immediate Retry', 'No Retry']} 
                            onChange={(val) => handleInputChange('webhook_retry_policy', val)} 
                        />
                    </div>

                    <div className="mt-10">
                        <div className="flex flex-col mb-6">
                            <span className="text-[14px] font-bold text-[#334155]">Event Selection</span>
                            <span className="text-[12px] text-slate-400 font-medium">Select which events trigger webhook notifications</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {webhookOptions.map((item) => (
                                <label 
                                    key={item} 
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                        JSON.parse(settings.webhook_events).includes(item) 
                                            ? 'bg-slate-50 border-slate-200 ring-2 ring-[#0f172b]/5' 
                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={JSON.parse(settings.webhook_events).includes(item)}
                                        onChange={() => handleCheckboxGridUpdate('webhook_events', item)}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                        JSON.parse(settings.webhook_events).includes(item) ? 'bg-[#0f172b] border-[#0f172b]' : 'bg-white border-slate-300'
                                    }`}>
                                        {JSON.parse(settings.webhook_events).includes(item) && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${JSON.parse(settings.webhook_events).includes(item) ? 'text-[#0f172b]' : 'text-slate-600'}`}>
                                        {item}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-[#0f172b]" />
                            <span className="text-[13px] font-bold text-[#334155]">Delivery Status</span>
                            <span className="text-[13px] text-slate-400 font-medium">Last delivery: 5 minutes ago</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">Active</span>
                    </div>
                </div>

                {/* 3. Third-Party Integrations */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Third-Party Integrations" 
                        description="Connect external service providers" 
                        icon={Share2}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Integration Provider" 
                            value={settings.integration_provider} 
                            options={['Stripe', 'PayPal', 'Salesforce', 'HubSpot']} 
                            onChange={(val) => handleInputChange('integration_provider', val)} 
                        />
                        <InputField 
                            label="API Credentials" 
                            value={settings.integration_credentials} 
                            onChange={(val) => handleInputChange('integration_credentials', val)} 
                            placeholder="Enter API key or credentials"
                        />
                    </div>
                    
                    <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-[#334155]">Connection Status</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-tighter">Connected</span>
                            </div>
                            <span className="text-[12px] text-slate-400 font-medium">Last checked: 2 minutes ago</span>
                        </div>
                        <button 
                            onClick={handleTestConnection}
                            disabled={isTestingConnection}
                            className="bg-[#0f172b] hover:bg-[#1e293b] text-white px-6 h-[44px] rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {isTestingConnection ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                            {isTestingConnection ? 'Testing...' : 'Test Connection'}
                        </button>
                    </div>
                </div>

                {/* 4. Internal Service Integrations */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Internal Service Integrations" 
                        description="Configure internal system service providers" 
                        icon={Server}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="AI Service Provider" 
                            value={settings.ai_service_provider} 
                            options={['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini']} 
                            onChange={(val) => handleInputChange('ai_service_provider', val)} 
                        />
                        <SelectField 
                            label="File Storage Provider" 
                            value={settings.file_storage_provider} 
                            options={['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage']} 
                            onChange={(val) => handleInputChange('file_storage_provider', val)} 
                        />
                        <SelectField 
                            label="Search Engine Provider" 
                            value={settings.search_engine_provider} 
                            options={['Elasticsearch', 'Algolia', 'Pinecone']} 
                            onChange={(val) => handleInputChange('search_engine_provider', val)} 
                        />
                        <SelectField 
                            label="Notification Service Provider" 
                            value={settings.notification_service_provider} 
                            options={['SendGrid', 'Postmark', 'Twilio']} 
                            onChange={(val) => handleInputChange('notification_service_provider', val)} 
                        />
                    </div>
                </div>

                {/* 5. Data Import / Export Controls */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <SectionHeader 
                        title="Data Import / Export Controls" 
                        description="Configure data import and export capabilities" 
                        icon={FileOutput}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Allow CSV Import" 
                            sublabel="Enable bulk data import via CSV" 
                            enabled={settings.allow_csv_import} 
                            onToggle={() => handleToggle('allow_csv_import')} 
                        />
                        <ToggleRow 
                            label="Allow Bulk Data Export" 
                            sublabel="Enable bulk data export" 
                            enabled={settings.allow_bulk_data_export} 
                            onToggle={() => handleToggle('allow_bulk_data_export')} 
                        />
                        <ToggleRow 
                            label="Scheduled Data Sync" 
                            sublabel="Automatic scheduled sync" 
                            enabled={settings.enable_scheduled_data_sync} 
                            onToggle={() => handleToggle('enable_scheduled_data_sync')} 
                        />
                        <SelectField 
                            label="Export Format" 
                            value={settings.export_format} 
                            options={['CSV', 'JSON', 'XML']} 
                            onChange={(val) => handleInputChange('export_format', val)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationApiSettings;
