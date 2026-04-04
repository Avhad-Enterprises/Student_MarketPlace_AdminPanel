'use client';

import React from 'react';
import { 
    HardDrive, 
    UploadCloud, 
    Zap, 
    ShieldCheck, 
    FolderTree, 
    CheckCircle2,
    Activity,
    ChevronDown,
    Search,
    FileText,
    Image,
    Film,
    FileArchive
} from 'lucide-react';
import { FileSettings } from '../../services/fileSettingsService';

interface Props {
    settings: FileSettings;
    setSettings: React.Dispatch<React.SetStateAction<FileSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
    readOnly?: boolean;
}

const FileAssetSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving, readOnly = false }) => {
    const canEdit = !readOnly;

    const handleToggle = (field: keyof FileSettings) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof FileSettings, value: any) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxGridUpdate = (field: 'allowed_file_types', value: string) => {
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

    const InputField = ({ label, sublabel, value, onChange, type = "text", placeholder = "", rightLabel = "" }: { label: string, sublabel?: string, value: any, onChange: (val: any) => void, type?: string, placeholder?: string, rightLabel?: string }) => (
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
                    disabled={!canEdit}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {rightLabel && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 font-bold text-[12px]">
                        {rightLabel}
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
                    disabled={!canEdit}
                    className="w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 appearance-none text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                </div>
            </div>
        </div>
    );

    const fileFormats = [
        'PDF', 'DOC', 'DOCX', 'JPG', 'JPEG', 'PNG', 'GIF', 'MP4', 'MOV', 'ZIP'
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. Storage Configuration */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Storage Configuration" 
                        description="Configure file storage provider and capacity settings" 
                        icon={HardDrive}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Storage Provider" 
                            value={settings.storage_provider} 
                            options={['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage', 'DigitalOcean Spaces']} 
                            onChange={(val) => handleInputChange('storage_provider', val)} 
                        />
                        <SelectField 
                            label="Storage Region" 
                            value={settings.storage_region} 
                            options={['US East (N. Virginia)', 'US West (Oregon)', 'Europe (Ireland)', 'Asia Pacific (Mumbai)']} 
                            onChange={(val) => handleInputChange('storage_region', val)} 
                        />
                        <InputField 
                            label="Max Storage Limit (GB)" 
                            value={settings.max_storage_limit_gb} 
                            onChange={(val) => handleInputChange('max_storage_limit_gb', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="File Retention Period (days)" 
                            value={settings.file_retention_period_days} 
                            onChange={(val) => handleInputChange('file_retention_period_days', val)} 
                            type="number" 
                        />
                    </div>
                    
                    <div className="mt-2 mb-6">
                        <span className="text-[12px] text-slate-400 font-medium">Current usage: 45 GB (45%)</span>
                    </div>

                    <div className="mt-8 border-t border-gray-50 pt-8">
                        <ToggleRow 
                            label="Auto Cleanup Rules" 
                            sublabel="Automatically delete expired files" 
                            enabled={settings.enable_auto_cleanup} 
                            onToggle={() => handleToggle('enable_auto_cleanup')} 
                        />
                    </div>
                </div>

                {/* 2. Upload Rules */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Upload Rules" 
                        description="Configure file upload restrictions and limits" 
                        icon={UploadCloud}
                    />
                    
                    <div className="mb-10">
                        <div className="flex flex-col mb-6">
                            <span className="text-[14px] font-bold text-[#334155]">Allowed File Types</span>
                            <span className="text-[12px] text-slate-400 font-medium">Select which file types can be uploaded</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {fileFormats.map((item) => (
                                <label 
                                    key={item} 
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                                        !canEdit ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                                    } ${
                                        JSON.parse(settings.allowed_file_types).includes(item) 
                                            ? 'bg-slate-50 border-slate-200 ring-2 ring-[#0f172b]/5' 
                                            : 'bg-white border-slate-100 hover:border-slate-200'
                                    }`}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={JSON.parse(settings.allowed_file_types).includes(item)}
                                        onChange={() => handleCheckboxGridUpdate('allowed_file_types', item)}
                                        disabled={!canEdit}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                        JSON.parse(settings.allowed_file_types).includes(item) ? 'bg-[#0f172b] border-[#0f172b]' : 'bg-white border-slate-300'
                                    }`}>
                                        {JSON.parse(settings.allowed_file_types).includes(item) && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${JSON.parse(settings.allowed_file_types).includes(item) ? 'text-[#0f172b]' : 'text-slate-600'}`}>
                                        {item}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-6">
                        <InputField 
                            label="Max File Size (MB)" 
                            value={settings.max_file_size_mb} 
                            onChange={(val) => handleInputChange('max_file_size_mb', val)} 
                            type="number" 
                        />
                        <SelectField 
                            label="Duplicate File Handling" 
                            value={settings.duplicate_file_handling} 
                            options={['Rename (add suffix)', 'Overwrite', 'Skip/Error']} 
                            onChange={(val) => handleInputChange('duplicate_file_handling', val)} 
                        />
                        <InputField 
                            label="Image Upload Limit (MB)" 
                            value={settings.image_upload_limit_mb} 
                            onChange={(val) => handleInputChange('image_upload_limit_mb', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="Video Upload Limit (MB)" 
                            value={settings.video_upload_limit_mb} 
                            onChange={(val) => handleInputChange('video_upload_limit_mb', val)} 
                            type="number" 
                        />
                    </div>
                    <div className="max-w-md mt-4">
                        <InputField 
                            label="Document Upload Limit (MB)" 
                            value={settings.document_upload_limit_mb} 
                            onChange={(val) => handleInputChange('document_upload_limit_mb', val)} 
                            type="number" 
                        />
                    </div>
                </div>

                {/* 3. Asset Optimization */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Asset Optimization" 
                        description="Configure automatic file processing and optimization" 
                        icon={Zap}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        <ToggleRow 
                            label="Auto Image Compression" 
                            sublabel="Compress images on upload" 
                            enabled={settings.enable_image_compression} 
                            onToggle={() => handleToggle('enable_image_compression')} 
                        />
                        <ToggleRow 
                            label="Thumbnail Generation" 
                            sublabel="Auto-generate image thumbnails" 
                            enabled={settings.enable_thumbnail_generation} 
                            onToggle={() => handleToggle('enable_thumbnail_generation')} 
                        />
                        <ToggleRow 
                            label="Document Preview Generation" 
                            sublabel="Generate PDF previews" 
                            enabled={settings.enable_document_preview} 
                            onToggle={() => handleToggle('enable_document_preview')} 
                        />
                        <ToggleRow 
                            label="Virus Scan on Upload" 
                            sublabel="Scan files for malware" 
                            enabled={settings.enable_virus_scan} 
                            onToggle={() => handleToggle('enable_virus_scan')} 
                        />
                        <ToggleRow 
                            label="File Encryption" 
                            sublabel="Encrypt files at rest" 
                            enabled={settings.enable_file_encryption} 
                            onToggle={() => handleToggle('enable_file_encryption')} 
                        />
                    </div>
                </div>

                {/* 4. File Access & Security */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="File Access & Security" 
                        description="Configure file access permissions and security settings" 
                        icon={ShieldCheck}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Default File Visibility" 
                            value={settings.default_file_visibility} 
                            options={['Private (authentication required)', 'Public', 'Role-Based']} 
                            onChange={(val) => handleInputChange('default_file_visibility', val)} 
                        />
                        <InputField 
                            label="Temporary Link Expiry (hours)" 
                            value={settings.temp_link_expiry_hours} 
                            onChange={(val) => handleInputChange('temp_link_expiry_hours', val)} 
                            type="number" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4 items-end">
                        <ToggleRow 
                            label="Role-Based File Access" 
                            sublabel="Control access by user role" 
                            enabled={settings.enable_role_based_access} 
                            onToggle={() => handleToggle('enable_role_based_access')} 
                        />
                        <ToggleRow 
                            label="Temporary Download Links" 
                            sublabel="Generate time-limited links" 
                            enabled={settings.enable_temp_download_links} 
                            onToggle={() => handleToggle('enable_temp_download_links')} 
                        />
                    </div>

                    <div className="mt-10 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-[#3b82f6]" />
                            <span className="text-[13px] font-bold text-[#334155]">File Access Logs</span>
                            <span className="text-[13px] text-slate-400 font-medium">3,245 file accesses in last 30 days</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider">Tracking Active</span>
                    </div>
                </div>

                {/* 5. Media Library Management */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <SectionHeader 
                        title="Media Library Management" 
                        description="Configure media library organization and features" 
                        icon={FolderTree}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Folder Structure Rules" 
                            sublabel="Organize files in folders" 
                            enabled={settings.enable_folder_structure} 
                            onToggle={() => handleToggle('enable_folder_structure')} 
                        />
                        <ToggleRow 
                            label="Asset Tagging Enabled" 
                            sublabel="Tag files for organization" 
                            enabled={settings.enable_asset_tagging} 
                            onToggle={() => handleToggle('enable_asset_tagging')} 
                        />
                        <ToggleRow 
                            label="File Versioning" 
                            sublabel="Keep file version history" 
                            enabled={settings.enable_file_versioning} 
                            onToggle={() => handleToggle('enable_file_versioning')} 
                        />
                        <ToggleRow 
                            label="Archive Old Assets" 
                            sublabel="Move unused files to archive" 
                            enabled={settings.enable_archive_old_assets} 
                            onToggle={() => handleToggle('enable_archive_old_assets')} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileAssetSettings;
