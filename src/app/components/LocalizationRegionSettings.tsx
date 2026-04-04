'use client';

import React from 'react';
import { 
    Languages, 
    Globe, 
    Clock, 
    Calendar, 
    MapPin, 
    Hash, 
    Phone, 
    Home, 
    User, 
    Variable, 
    CheckCircle2,
    Search
} from 'lucide-react';
import { LocalizationSettings } from '../../services/localizationSettingsService';

interface Props {
    settings: LocalizationSettings;
    setSettings: React.Dispatch<React.SetStateAction<LocalizationSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
    readOnly?: boolean;
}

const LocalizationRegionSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving, readOnly = false }) => {
    const canEdit = !readOnly;

    const handleToggle = (field: keyof LocalizationSettings) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof LocalizationSettings, value: any) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxGridUpdate = (field: 'supported_languages' | 'operating_regions', value: string) => {
        if (!canEdit) return;
        const currentArray = JSON.parse(settings[field]);
        let newArray;
        if (currentArray.includes(value)) {
            newArray = currentArray.filter((item: string) => item !== value);
        } else {
            newArray = [...currentArray, value];
        }
        handleInputChange(field, JSON.stringify(newArray));
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

    const ToggleRow = ({ label, sublabel, enabled, onToggle, disabled = false }: { label: string, sublabel: string, enabled: boolean, onToggle: () => void, disabled?: boolean }) => (
        <div className={`flex items-center justify-between py-6 px-1 border-b border-gray-50 last:border-0 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="space-y-1">
                <p className="text-[15px] font-bold text-[#334155]">{label}</p>
                <p className="text-[13px] text-slate-400 font-medium">{sublabel}</p>
            </div>
            <button
                onClick={disabled ? undefined : onToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                    enabled ? 'bg-[#0f172b]' : 'bg-slate-200'
                } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
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
                    disabled={!canEdit}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 appearance-none text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Clock size={16} />
                </div>
            </div>
        </div>
    );

    const CheckboxGrid = ({ items, selectedItems, onToggle }: { items: string[], selectedItems: string[], onToggle: (item: string) => void }) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {items.map((item) => (
                <label 
                    key={item} 
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        !canEdit ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                    } ${
                        selectedItems.includes(item) 
                            ? 'bg-slate-50 border-slate-200 ring-2 ring-[#0f172b]/5' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                >
                    <input 
                        type="checkbox" 
                        checked={selectedItems.includes(item)}
                        onChange={() => onToggle(item)}
                        disabled={!canEdit}
                        className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        selectedItems.includes(item) ? 'bg-[#0f172b] border-[#0f172b]' : 'bg-white border-slate-300'
                    }`}>
                        {selectedItems.includes(item) && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className={`text-[14px] font-semibold ${selectedItems.includes(item) ? 'text-[#0f172b]' : 'text-slate-600'}`}>
                        {item}
                    </span>
                </label>
            ))}
        </div>
    );

    const languages = [
        'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
        'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
    ];

    const regions = [
        'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa', 
        'Latin America', 'Australia & New Zealand'
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. Language Settings */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Language Settings" 
                        description="Configure language preferences and multi-language support" 
                        icon={Languages}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Default Language" 
                            value={settings.default_language} 
                            options={languages} 
                            onChange={(val) => handleInputChange('default_language', val)} 
                        />
                        <SelectField 
                            label="Fallback Language" 
                            value={settings.fallback_language} 
                            options={languages} 
                            onChange={(val) => handleInputChange('fallback_language', val)} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4">
                        <ToggleRow 
                            label="Enable Multi-Language" 
                            sublabel="Support multiple languages" 
                            enabled={settings.enable_multi_language} 
                            onToggle={() => handleToggle('enable_multi_language')} 
                        />
                        <ToggleRow 
                            label="Auto-Detect Language" 
                            sublabel="Detect user's browser language" 
                            enabled={settings.auto_detect_language} 
                            onToggle={() => handleToggle('auto_detect_language')} 
                        />
                        <ToggleRow 
                            label="Enable RTL Support" 
                            sublabel="Right-to-left language support" 
                            enabled={settings.enable_rtl_support} 
                            onToggle={() => handleToggle('enable_rtl_support')} 
                        />
                    </div>

                    <div className="mt-10">
                        <div className="flex flex-col mb-4">
                            <span className="text-[14px] font-bold text-[#334155]">Supported Languages</span>
                            <span className="text-[12px] text-slate-400 font-medium">Select which languages are available to users</span>
                        </div>
                        <CheckboxGrid 
                            items={languages} 
                            selectedItems={JSON.parse(settings.supported_languages)} 
                            onToggle={(item) => handleCheckboxGridUpdate('supported_languages', item)} 
                        />
                    </div>
                </div>

                {/* 2. Timezone & Date Format */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Timezone & Date Format" 
                        description="Configure timezone, date, and time display settings" 
                        icon={Clock}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Default Timezone" 
                            value={settings.default_timezone} 
                            options={['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Kolkata']} 
                            onChange={(val) => handleInputChange('default_timezone', val)} 
                        />
                        <SelectField 
                            label="Date Format" 
                            value={settings.date_format} 
                            options={['MM/DD/YYYY (US)', 'DD/MM/YYYY (UK)', 'YYYY-MM-DD']} 
                            onChange={(val) => handleInputChange('date_format', val)} 
                        />
                        <SelectField 
                            label="Time Format" 
                            value={settings.time_format} 
                            options={['12-hour (1:30 PM)', '24-hour (13:30)']} 
                            onChange={(val) => handleInputChange('time_format', val)} 
                        />
                        <SelectField 
                            label="First Day of Week" 
                            value={settings.first_day_of_week} 
                            options={['Sunday', 'Monday', 'Saturday']} 
                            onChange={(val) => handleInputChange('first_day_of_week', val)} 
                        />
                    </div>
                    
                    <div className="mt-4">
                        <ToggleRow 
                            label="Automatic Timezone Detection" 
                            sublabel="Detect user's timezone automatically" 
                            enabled={settings.auto_timezone_detection} 
                            onToggle={() => handleToggle('auto_timezone_detection')} 
                        />
                    </div>
                </div>

                {/* 3. Regional Operations */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Regional Operations" 
                        description="Configure operational regions and region-specific settings" 
                        icon={Globe}
                    />
                    
                    <div className="max-w-md mb-6">
                        <SelectField 
                            label="Primary Region" 
                            value={settings.primary_region} 
                            options={regions} 
                            onChange={(val) => handleInputChange('primary_region', val)} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        <ToggleRow 
                            label="Region-Based Pricing" 
                            sublabel="Different prices per region" 
                            enabled={settings.region_based_pricing} 
                            onToggle={() => handleToggle('region_based_pricing')} 
                        />
                        <ToggleRow 
                            label="Region-Based Content" 
                            sublabel="Customize content by region" 
                            enabled={settings.region_based_content} 
                            onToggle={() => handleToggle('region_based_content')} 
                        />
                        <ToggleRow 
                            label="Regional Compliance Mode" 
                            sublabel="Apply region-specific compliance" 
                            enabled={settings.regional_compliance_mode} 
                            onToggle={() => handleToggle('regional_compliance_mode')} 
                        />
                    </div>

                    <div className="mt-10">
                        <div className="flex flex-col mb-4">
                            <span className="text-[14px] font-bold text-[#334155]">Operating Regions</span>
                            <span className="text-[12px] text-slate-400 font-medium">Select regions where your service operates</span>
                        </div>
                        <CheckboxGrid 
                            items={regions} 
                            selectedItems={JSON.parse(settings.operating_regions)} 
                            onToggle={(item) => handleCheckboxGridUpdate('operating_regions', item)} 
                        />
                    </div>
                </div>

                {/* 4. Regional Formatting */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <SectionHeader 
                        title="Regional Formatting" 
                        description="Configure number, phone, address, and name formatting" 
                        icon={Variable}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Number Format" 
                            value={settings.number_format} 
                            options={['US (1,234.56)', 'EU (1.234,56)', 'India (1,23,456.78)']} 
                            onChange={(val) => handleInputChange('number_format', val)} 
                        />
                        <SelectField 
                            label="Phone Number Format" 
                            value={settings.phone_number_format} 
                            options={['International (+1-555-123-4567)', 'National (555-123-4567)']} 
                            onChange={(val) => handleInputChange('phone_number_format', val)} 
                        />
                        <SelectField 
                            label="Address Format" 
                            value={settings.address_format} 
                            options={['US Format', 'UK Format', 'Standard International']} 
                            onChange={(val) => handleInputChange('address_format', val)} 
                        />
                        <SelectField 
                            label="Name Format" 
                            value={settings.name_format} 
                            options={['First Last (Western)', 'Last First (Eastern)']} 
                            onChange={(val) => handleInputChange('name_format', val)} 
                        />
                        <SelectField 
                            label="Decimal Separator" 
                            value={settings.decimal_separator} 
                            options={['Period (.)', 'Comma (,)']} 
                            onChange={(val) => handleInputChange('decimal_separator', val)} 
                        />
                        <SelectField 
                            label="Thousands Separator" 
                            value={settings.thousands_separator} 
                            options={['Comma (,)', 'Period (.)', 'Space ( )']} 
                            onChange={(val) => handleInputChange('thousands_separator', val)} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocalizationRegionSettings;
