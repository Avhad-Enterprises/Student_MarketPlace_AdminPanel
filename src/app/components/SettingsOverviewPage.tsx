'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Bot,
    Shield,
    Bell,
    Globe,
    Save,
    CheckCircle2,
    Lock as LockIcon,
    Mail,
    Smartphone,
    Loader2,
    Building2,
    UserCheck,
    Scale,
    Brain,
    DollarSign,
    Languages,
    Plug,
    Folder,
    FileText,
    Users as UsersIcon,
    ChevronLeft,
    CheckCircle,
    Palette,
    Server,
    Briefcase,
    ExternalLink,
    Upload,
    Image as ImageIcon,
    Search,
    Plus,
    Edit,
    RotateCcw,
    Trash2,
    Filter,
    UserPlus,
    ChevronRight,
    Users as UsersIconSmall,
    HardDrive,
    ShieldCheck
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { AssistantSetup } from './AssistantSetup';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { systemSettingsService, SystemSettings, NotificationSetting } from '@/services/systemSettingsService';
import { serviceCountrySettingsService, ServiceCountrySettings } from '@/services/serviceCountrySettingsService';
import { comparisonRulesService, ComparisonRules } from '@/services/comparisonRulesService';
import { aiVisaSettingsService, AiVisaSettings } from '@/services/aiVisaSettingsService';
import { authService } from '@/services/authService';
import rbacService from '@/services/rbacService';
import { AIVisaAssistantSettings } from './AIVisaAssistantSettings';
import CommunicationsSettings from './CommunicationsSettings';
import { communicationSettingsService, CommunicationSettings } from '@/services/communicationSettingsService';
import { deliverySafetySettingsService, DeliverySafetySettings } from '@/services/deliverySafetySettingsService';
import DeliverySafetySettingsComp from './DeliverySafetySettings';
import NotificationAlertSettings from './NotificationAlertSettings';
import { adminNotificationSettingsService, AdminNotificationSettings } from '@/services/adminNotificationSettingsService';
import CompliancePrivacySettings from './CompliancePrivacySettings';
import { complianceSettingsService, ComplianceSettings } from '@/services/complianceSettingsService';
import FinancePaymentSettings from './FinancePaymentSettings';
import { financeSettingsService, FinanceSettings } from '@/services/financeSettingsService';
import LocalizationRegionSettings from './LocalizationRegionSettings';
import { localizationSettingsService, LocalizationSettings } from '@/services/localizationSettingsService';
import IntegrationApiSettings from './IntegrationApiSettings';
import { integrationSettingsService, IntegrationSettings } from '@/services/integrationSettingsService';
import FileAssetSettings from './FileAssetSettings';
import { fileSettingsService, FileSettings } from '@/services/fileSettingsService';
import PolicyLegalSettings from './PolicyLegalSettings';
import PolicySettingsRoute from './PolicyLegalSettings';
import { policySettingsService, PolicyGlobalSettings } from '@/services/policySettingsService';
import AdvancedSystemSettings from './AdvancedSystemSettings';
import LegalComplianceSettings from './LegalComplianceSettings';

type SettingsView = 'grid' | 'detail';
type SettingsTab = 'general' | 'ai' | 'security' | 'people' | 'services_countries' | 'comparison_rules' | 'notifications' | 'communications' | 'delivery_safety' | 'compliance' | 'finance' | 'localization' | 'integrations' | 'files' | 'policies' | 'advanced' | 'legal_readiness' | 'placeholder';

interface Category {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'Configured' | 'Not Set' | 'Requires Attention';
    tab: SettingsTab;
}

export const SettingsOverviewPage: React.FC = () => {

    const [view, setView] = useState<SettingsView>('grid');
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [activeSubTab, setActiveSubTab] = useState('general');
    const [activeCategoryTitle, setActiveCategoryTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        platform_name: '',
        support_email: '',
        primary_currency: 'USD',
        legal_entity_name: '',
        organization_type: 'Marketplace',
        support_phone: '',
        timezone: 'UTC',
        primary_color: '#253154',
        accent_color: '#0a061d',
        logo_light: '',
        logo_dark: '',
        favicon: '',
        email_logo: '',
        tax_id: 'GST123456789',
        registration_number: 'CRN-2024-001',
        country_of_registration: 'United States',
        invoice_footer: 'Thank you for your business. For questions, contact support@globalvisa.com',
        multi_country_mode: true,
        multi_service_mode: true,
        allow_guest_enquiries: true,
        require_email_verification: true,
        require_phone_verification: false,
        // Security Rules
        password_min_length: 8,
        force_password_reset_days: 90,
        session_timeout_minutes: 30,
        require_special_chars: true,
        two_factor_required: false,
        ip_whitelist: '',
        // Login Policies
        max_login_attempts: 5,
        lockout_duration_minutes: 30,
        allow_concurrent_sessions: true,
        enable_sso: false,
        enable_google_login: true,
        // Advanced
        feature_flags: {
            betaAccess: false,
            aiFeatures: true,
            performanceTracing: false,
            newCheckout: false
        },
        api_logging_enabled: true,
        query_logging_enabled: false,
        system_log_retention_days: 30,
        // People & Identity
        manual_admin_approval: false,
        auto_approve_hours: 24,
        verification_expiry_days: 30,
        document_access_roles: ['Admin', 'Manager', 'Counselor'],
        mask_sensitive_documents: true,
        allow_document_download: true,
        watermark_documents: true,
        // KYC Settings
        kyc_required_booking: true,
        kyc_required_loan: true,
        kyc_required_visa: true,
        kyc_document_types: ['Passport', 'National ID', 'Address Proof'],
        // Data Visibility Rules
        hide_phone_from_experts: true,
        hide_email_from_counselors: false,
        allow_cross_department_access: false,
        log_identity_changes: true,
    });

    const [serviceCountrySettings, setServiceCountrySettings] = useState<ServiceCountrySettings>({
        enable_service_activation_by_country: true,
        default_active_services: ['Visa Counseling', 'Loan Assistance', 'Insurance'],
        auto_enable_new_services: true,
        allow_service_customization_by_country: true,
        service_visibility_mode: 'Country-based',
        default_destination_country: 'United States',
        default_currency_per_country: 'USD',
        default_visa_type_per_country: 'F-1 Student Visa',
        default_intake_mapping: 'Fall',
        risk_category_per_country: 'Medium Risk',
        auto_escalation_high_risk: true,
        default_university_status: 'Active',
        ranking_source_type: 'QS World University Rankings',
        default_comparison_weight: 50,
        auto_approve_listed_universities: false,
        allow_manual_ranking_override: true,
        default_app_deadline_buffer: 30,
        auto_assign_counselor_on_activation: true,
        require_doc_before_service_activation: true,
        allow_multi_service_parallel: true
    });

    const [comparisonRules, setComparisonRules] = useState<ComparisonRules>({
        enable_country_scoring: true,
        country_scoring_parameters: ['Tuition Cost', 'Visa Success Rate', 'PR Probability', 'Living Cost', 'Employment Opportunity', 'Risk Index'],
        country_weight_distribution: {
            'Tuition Cost': 15,
            'Visa Success Rate': 25,
            'PR Probability': 20,
            'Living Cost': 15,
            'Employment Opportunity': 15,
            'Risk Index': 10
        },
        allow_manual_score_override: true,
        enable_university_ranking_engine: true,
        university_weight_configuration: {
            'QS Rank': 30,
            'Acceptance Rate': 20,
            'Placement %': 25,
            'Tuition': 15,
            'Location': 10
        },
        min_eligibility_threshold_required: true,
        enable_smart_matching: true,
        auto_suggest_top_5_countries: true,
        auto_suggest_top_10_universities: true,
        exclude_high_risk_options: true,
        allow_counselor_override_matching: true
    });
    const [aiSettings, setAiSettings] = useState<AiVisaSettings>({
        enable_ai_assistant: true,
        ai_mode: 'Balanced',
        risk_sensitivity: 'Medium',
        confidence_threshold: 60,
        escalation_threshold: 60,
        prompt_template: 'Analyze the student profile and provide a comprehensive visa assessment. Consider academic background, financial situation, English proficiency, work experience, and destination country requirements. Provide recommendations for countries with the highest visa success probability.',
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
    const [communicationSettings, setCommunicationSettings] = useState<CommunicationSettings>({
        email_provider: 'SendGrid',
        api_key: '',
        webhook_url: '',
        ip_pool_name: 'main-pool',
        connection_status: 'connected',
        last_synced: new Date().toISOString(),
        email_settings: {
            daily_limit: 50000,
            retry_logic: true,
            tracking_enabled: true,
        },
        campaign_defaults: {
            default_from_name: 'Support Team',
            default_from_email: 'support@globalvisa.com',
            unsubscribe_link: true,
        },
        default_from_name: 'Global Visa Services',
        default_from_email: 'noreply@globalvisa.com',
        reply_to_email: 'support@globalvisa.com',
        email_footer_text: 'Global Visa Services | 123 Main Street, Suite 100 | support@globalvisa.com',
        email_signature: 'Best regards, Global Visa Services Team',
        enable_notifications: true,
        enable_auto_status_emails: true,
        enable_campaign_tracking: true,
        domain_verification_status: 'verified',
        default_campaign_owner: 'Marketing Team',
        default_lead_source_tag: 'Website',
        default_attribution_model: 'Last-touch',
        campaign_auto_expiry_days: 90,
        enable_conversion_tracking: true,
        verified_domains: 'globalvisa.com, app.globalvisa.com',
        dkim_status: 'Verified',
        spf_status: 'Verified',
        sender_name_list: 'Global Visa Services, Support Team, Marketing Team',
        default_sender_name: 'Global Visa Services',
    });
    const [deliverySafetySettings, setDeliverySafetySettings] = useState<DeliverySafetySettings>({
        api_requests_per_minute: 100,
        login_attempts_per_hour: 5,
        booking_creation_limit_per_user: 10,
        form_submissions_per_ip: 20,
        file_upload_limit_mb: 50,
        enable_captcha: true,
        block_tor_nodes: false,
        honeypot_enabled: true,
        pii_masking: true,
        auto_deletion_days: 365,
        mfa_required: false,
        session_concurrency: 3,
        real_time_alerts: true,
        security_logs_retention_days: 90,
        block_disposable_emails: true,
        auto_block_failed_logins: true,
        auto_flag_suspicious: true,
        suspicious_threshold_count: 3,
        auto_lock_duration_mins: 30,
        auto_delete_inactive_days: 730,
        encrypt_documents: true,
        session_timeout_mins: 30,
        password_reset_days: 90,
        allow_multiple_sessions: false,
        ip_whitelist: '',
        enable_activity_logging: true,
        enable_admin_logs: true,
        enable_ip_tracking: true,
        enable_ai_logs: true,
    });
    const [adminNotificationSettings, setAdminNotificationSettings] = useState<AdminNotificationSettings>({
        alert_high_risk_student: true,
        alert_visa_rejection: true,
        alert_payment_failure: true,
        alert_expert_over_capacity: true,
        alert_recipient_roles: ['Admin', 'Manager'],
        enable_student_email_notifications: true,
        enable_booking_reminders: true,
        enable_deadline_reminders: true,
        enable_invoice_reminders: true,
        escalate_lead_hours: 24,
        escalate_booking_hours: 48,
        escalation_role: 'Senior Manager',
        escalation_email: 'escalation@company.com',
        channel_email: true,
        channel_sms: false,
        channel_in_app: true,
    });
    const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
        gdpr_mode: true,
        ccpa_mode: false,
        right_to_be_forgotten: true,
        data_portability: true,
        data_retention_period: 365,
        anonymize_deleted: true,
        require_explicit_consent: true,
        cookie_consent: true,
        marketing_opt_in: true,
        age_verification_required: false,
        privacy_policy_url: 'https://example.com/privacy',
        minimum_age: 16,
        document_encryption: true,
        document_watermarking: false,
        version_control: true,
        compliance_tagging: true,
        document_retention_years: 7,
        automatic_expiry: true,
        enable_audit_logging: true,
        log_data_access: true,
        log_data_modifications: true,
        log_user_authentication: true,
        audit_log_retention_days: 730,
        real_time_alerts: true,
        primary_framework: 'GDPR (European Union)',
        data_residency: 'European Union',
        soc2_compliance: false,
        iso27001_compliance: false,
        hipaa_compliance: false,
    });
    const [financeSettings, setFinanceSettings] = useState<FinanceSettings>({
        primary_currency: 'USD - US Dollar',
        secondary_currency: 'EUR - Euro',
        exchange_rate_provider: 'Open Exchange Rates',
        exchange_rate_frequency: 'Daily',
        auto_update_exchange_rates: true,
        enable_multi_currency: true,
        enable_credit_card: true,
        enable_debit_card: true,
        enable_bank_transfer: true,
        enable_paypal: false,
        enable_stripe: true,
        enable_apple_pay: false,
        enable_google_pay: false,
        default_payment_gateway: 'Stripe',
        invoice_prefix: 'INV',
        invoice_number_format: 'Sequential (INV-0001, INV-0002)',
        starting_invoice_number: 1000,
        invoice_due_period_days: 30,
        late_payment_fee_percent: 2.0,
        enable_auto_invoicing: true,
        enable_late_payment_fees: false,
        invoice_footer_text: 'Thank you for your business',
        enable_refunds: true,
        refund_approval_required: true,
        allow_partial_refunds: true,
        refund_window_days: 14,
        auto_refund_under_amount: 100.0,
        refund_processing_time_days: 5,
        require_approval_over_amount: 5000.0,
        fiscal_year_start_month: 'January',
        default_tax_rate: 0.0,
        enable_budget_tracking: true,
        enable_expense_reporting: true,
        enable_tax_calculation: true,
        enable_financial_reporting: true,
    });
    const [localizationSettings, setLocalizationSettings] = useState<LocalizationSettings>({
        default_language: 'English',
        fallback_language: 'English',
        enable_multi_language: true,
        auto_detect_language: true,
        enable_rtl_support: false,
        supported_languages: '["English", "Spanish", "French"]',
        default_timezone: 'UTC',
        date_format: 'MM/DD/YYYY (US)',
        time_format: '12-hour (1:30 PM)',
        first_day_of_week: 'Sunday',
        auto_timezone_detection: true,
        primary_region: 'North America',
        region_based_pricing: false,
        region_based_content: true,
        regional_compliance_mode: true,
        operating_regions: '["North America", "Europe"]',
        number_format: 'US (1,234.56)',
        phone_number_format: 'International (+1-555-123-4567)',
        address_format: 'US Format',
        name_format: 'First Last (Western)',
        decimal_separator: 'Period (.)',
        thousands_separator: 'Comma (,)',
    });
    const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings>({
        enable_public_api: true,
        api_key: 'sk_test_51Mz...',
        api_key_rotation: 'Manual',
        api_key_expiry_days: 90,
        api_rate_limit: 1000,
        allowed_ip_whitelist: '192.168.1.1, 10.0.0.1',
        enable_webhooks: true,
        webhook_endpoint_url: 'https://api.example.com/webhooks',
        webhook_secret_key: 'whsec_...',
        webhook_retry_policy: 'Exponential Backoff',
        webhook_events: '["Student Created", "Payment Completed"]',
        integration_provider: 'Stripe',
        integration_credentials: '',
        ai_service_provider: 'OpenAI GPT-4',
        file_storage_provider: 'AWS S3',
        search_engine_provider: 'Elasticsearch',
        notification_service_provider: 'SendGrid',
        allow_csv_import: true,
        allow_bulk_data_export: true,
        enable_scheduled_data_sync: false,
        export_format: 'CSV',
    });
    const [fileSettings, setFileSettings] = useState<FileSettings>({
        storage_provider: 'AWS S3',
        storage_region: 'US East (N. Virginia)',
        max_storage_limit_gb: 100,
        file_retention_period_days: 365,
        enable_auto_cleanup: true,
        allowed_file_types: '["PDF", "DOC", "DOCX", "JPG", "JPEG", "PNG", "GIF", "MP4", "MOV", "ZIP"]',
        max_file_size_mb: 10,
        duplicate_file_handling: 'Rename (add suffix)',
        image_upload_limit_mb: 50,
        video_upload_limit_mb: 500,
        document_upload_limit_mb: 20,
        enable_image_compression: true,
        enable_thumbnail_generation: true,
        enable_document_preview: true,
        enable_virus_scan: true,
        enable_file_encryption: false,
        default_file_visibility: 'Private (authentication required)',
        temp_link_expiry_hours: 24,
        enable_role_based_access: true,
        enable_temp_download_links: true,
        enable_folder_structure: true,
        enable_asset_tagging: true,
        enable_file_versioning: false,
        enable_archive_old_assets: true,
    });
    const [policyGlobalSettings, setPolicyGlobalSettings] = useState<PolicyGlobalSettings>({
        enable_reacceptance: true,
        enable_consent_timestamp: true,
        log_retention_months: 24,
        legal_contact_email: 'legal@example.com',
    });
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    
    // User Management state
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isSubmittingUser, setIsSubmittingUser] = useState(false);
    const [newUser, setNewUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: ''
    });

    // Edit User state
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    // Roles state
    const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
    const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
    const [isSubmittingRole, setIsSubmittingRole] = useState(false);
    const [newRole, setNewRole] = useState({
        name: '',
        description: '',
        permissions: {}
    });
    const [editingRole, setEditingRole] = useState<any>(null);

    // Matrix state
    const [selectedRoleIdForMatrix, setSelectedRoleIdForMatrix] = useState<string>('');
    const [isSavingPermission, setIsSavingPermission] = useState(false);

    const PERMISSION_MODULES = [
        'Dashboard', 'Students', 'Services', 'Bookings', 'Finance', 'Reports', 'Settings'
    ];
    const PERMISSION_ACTIONS = [
        'VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'EXPORT'
    ];


    useEffect(() => {
        fetchSettings();
    }, []);

    const getPermissionCount = (permissions: any) => {
        if (!permissions) return 0;
        let perms = permissions;
        if (typeof perms === 'string') {
            try {
                perms = JSON.parse(perms);
            } catch (e) { return 0; }
        }
        if (perms.all) return 41;
        let count = 0;
        Object.values(perms).forEach((val: any) => {
            if (Array.isArray(val)) count += val.length;
        });
        return count;
    };

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            console.log('Fetching system settings...');
            const sysRes = await systemSettingsService.getSystemSettings();
            setSystemSettings(prev => ({ ...prev, ...sysRes.data }));
            console.log('System settings loaded');

            console.log('Fetching notification settings...');
            const notifyRes = await systemSettingsService.getNotificationSettings();
            setNotificationSettings(notifyRes.data);
            console.log('Notification settings loaded');

            console.log('Fetching service country settings...');
            const scRes = await serviceCountrySettingsService.getSettings();
            setServiceCountrySettings(prev => ({ ...prev, ...scRes }));
            console.log('Service country settings loaded');

            console.log('Fetching comparison rules...');
            const compRes = await comparisonRulesService.getRules();
            setComparisonRules(prev => ({ ...prev, ...compRes }));
            console.log('Comparison rules loaded');

            console.log('Fetching AI settings...');
            const aiRes = await aiVisaSettingsService.getSettings();
            setAiSettings(prev => ({ ...prev, ...aiRes }));
            console.log('AI settings loaded');

            console.log('Fetching communication settings...');
            const commRes = await communicationSettingsService.getSettings();
            setCommunicationSettings(prev => ({ ...prev, ...commRes }));
            console.log('Communication settings loaded');

            console.log('Fetching delivery & safety settings...');
            const dsRes = await deliverySafetySettingsService.getSettings();
            setDeliverySafetySettings(prev => ({ ...prev, ...dsRes }));
            console.log('Delivery & safety settings loaded');

            console.log('Fetching admin notification settings...');
            const adminNotifyRes = await adminNotificationSettingsService.getSettings();
            setAdminNotificationSettings(prev => ({ ...prev, ...adminNotifyRes }));
            console.log('Admin notification settings loaded');

            console.log('Fetching compliance settings...');
            const compPrivacyRes = await complianceSettingsService.getSettings();
            setComplianceSettings(prev => ({ ...prev, ...compPrivacyRes }));
            console.log('Compliance settings loaded');

            console.log('Fetching finance settings...');
            const financeRes = await financeSettingsService.getSettings();
            setFinanceSettings(prev => ({ ...prev, ...financeRes }));
            console.log('Finance settings loaded');

            console.log('Fetching localization settings...');
            const locRes = await localizationSettingsService.getSettings();
            setLocalizationSettings(prev => ({ ...prev, ...locRes }));
            console.log('Localization settings loaded');

            console.log('Fetching integration settings...');
            const intRes = await integrationSettingsService.getSettings();
            setIntegrationSettings(prev => ({ ...prev, ...intRes }));
            console.log('Integration settings loaded');

            console.log('Fetching file settings...');
            const fileRes = await fileSettingsService.getSettings();
            setFileSettings(prev => ({ ...prev, ...fileRes }));
            console.log('File settings loaded');

            console.log('Fetching policy settings...');
            const policyRes = await policySettingsService.getGlobalSettings();
            setPolicyGlobalSettings(prev => ({ ...prev, ...policyRes }));
            console.log('Policy settings loaded');

            console.log('Fetching users...');
            const usersRes = await rbacService.api.getUsers();
            setUsers(usersRes);
            console.log('Users loaded');

            console.log('Fetching roles...');
            const rolesRes = await rbacService.api.getRoles();
            setRoles(rolesRes);
            
            // Auto-select first role for Permission Matrix if none selected
            if (rolesRes && rolesRes.length > 0) {
                setSelectedRoleIdForMatrix(rolesRes[0].id);
            }
            
            console.log('Roles loaded');

        } catch (error: any) {
            console.error('Failed to fetch settings:', error);
            const errorDetail = error.response ? `${error.response.status} ${error.response.statusText} at ${error.config?.url}` : error.message;
            toast.error(`Failed to load settings: ${errorDetail}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSystem = async () => {
        setIsSaving(true);
        try {
            if (activeTab === 'services_countries') {
                const { id, created_at, updated_at, ...cleanSettings } = serviceCountrySettings as any;
                await serviceCountrySettingsService.updateSettings(cleanSettings);
                toast.success('Service & Country defaults updated successfully');
            } else if (activeTab === 'comparison_rules') {
                const { id, created_at, updated_at, ...cleanSettings } = comparisonRules as any;
                await comparisonRulesService.updateRules(cleanSettings);
                toast.success('Comparison rules updated successfully');
            } else if (activeTab === 'ai') {
                const { id, updated_at, ...cleanSettings } = aiSettings as any;
                await aiVisaSettingsService.updateSettings(cleanSettings);
                toast.success('AI Visa Assistant settings updated successfully');
            } else if (activeTab === 'communications') {
                const { id, updated_at, ...cleanSettings } = communicationSettings as any;
                await communicationSettingsService.updateSettings(cleanSettings);
                toast.success('Communication settings updated successfully');
            } else if (activeTab === 'delivery_safety') {
                const { id, updated_at, ...cleanSettings } = deliverySafetySettings as any;
                await deliverySafetySettingsService.updateSettings(cleanSettings);
                toast.success('Delivery & safety settings updated successfully');
            } else if (activeTab === 'notifications') {
                const { id, updated_at, ...cleanSettings } = adminNotificationSettings as any;
                await adminNotificationSettingsService.updateSettings(cleanSettings);
                toast.success('Admin notification settings updated successfully');
            } else if (activeTab === 'compliance') {
                const { id, created_at, updated_at, ...cleanSettings } = complianceSettings as any;
                await complianceSettingsService.updateSettings(cleanSettings);
                toast.success('Compliance & Privacy settings updated successfully');
            } else if (activeTab === 'finance') {
                const { id, created_at, updated_at, ...cleanSettings } = financeSettings as any;
                await financeSettingsService.updateSettings(cleanSettings);
                toast.success('Finance & Payment settings updated successfully');
            } else if (activeTab === 'localization') {
                const { id, created_at, updated_at, ...cleanSettings } = localizationSettings as any;
                await localizationSettingsService.updateSettings(cleanSettings);
                toast.success('Localization & Region settings updated successfully');
            } else if (activeTab === 'integrations') {
                const { id, created_at, updated_at, ...cleanSettings } = integrationSettings as any;
                await integrationSettingsService.updateSettings(cleanSettings);
                toast.success('Integrations & API settings updated successfully');
            } else if (activeTab === 'files') {
                const { id, created_at, updated_at, ...cleanSettings } = fileSettings as any;
                await fileSettingsService.updateSettings(cleanSettings);
                toast.success('Files & Assets settings updated successfully');
            } else if (activeTab === 'policies') {
                const { id, created_at, updated_at, ...cleanSettings } = policyGlobalSettings as any;
                await policySettingsService.updateGlobalSettings(cleanSettings);
                toast.success('Policies & Legal settings updated successfully');
            } else {
                const { id, created_at, updated_at, ...cleanSettings } = systemSettings as any;
                await systemSettingsService.updateSystemSettings(cleanSettings);
                toast.success('System settings updated successfully');
            }
        } catch (error: any) {
            console.error('Failed to update system settings:', error);
            // Show the exact error message from the backend if available
            const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || error.message;
            toast.error(`Failed to update system settings: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleNotification = async (key: string, enabled: boolean) => {
        try {
            await systemSettingsService.updateNotificationSetting(key, enabled);
            setNotificationSettings(prev =>
                prev.map(n => n.key === key ? { ...n, enabled } : n)
            );
            toast.success('Notification preference updated');
        } catch (error) {
            toast.error('Failed to update notification setting');
        }
    };

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setIsUpdatingPassword(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Failed to update password';
            toast.error(errorMsg);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.first_name || !newUser.email || !newUser.role_id) {
            toast.error('Please fill required fields');
            return;
        }
        setIsSubmittingUser(true);
        try {
            await rbacService.api.createUser(newUser);
            toast.success('User created successfully');
            setIsAddUserModalOpen(false);
            setNewUser({
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                role_id: ''
            });
            fetchSettings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmittingUser(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await rbacService.api.deleteUser(id);
            toast.success('User deleted successfully');
            fetchSettings();
        } catch (error: any) {
            toast.error('Failed to delete user');
        }
    };

    const handleEditUser = (user: any) => {
        setEditingUser({
            ...user,
            first_name: user.full_name?.split(' ')[0] || user.first_name || '',
            last_name: user.full_name?.split(' ').slice(1).join(' ') || user.last_name || '',
            status: user.account_status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'
        });
        setIsEditUserModalOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!editingUser.first_name || !editingUser.email || !editingUser.role_id) {
            toast.error('Please fill required fields');
            return;
        }
        setIsUpdatingUser(true);
        try {
            // Sanitise payload for backend
            const updatePayload = {
                first_name: editingUser.first_name,
                last_name: editingUser.last_name,
                full_name: `${editingUser.first_name} ${editingUser.last_name}`.trim(),
                email: editingUser.email,
                role_id: editingUser.role_id,
                account_status: editingUser.status === 'Active' ? 'active' : 'inactive'
            };
            
            await rbacService.api.updateUser(editingUser.id, updatePayload);
            toast.success('User updated successfully');
            setIsEditUserModalOpen(false);
            fetchSettings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        } finally {
            setIsUpdatingUser(false);
        }
    };

    // Role Handlers
    const handleCreateRole = async () => {
        if (!newRole.name) {
            toast.error('Please enter a role name');
            return;
        }
        setIsSubmittingRole(true);
        try {
            await rbacService.api.createRole(newRole);
            toast.success('Role created successfully');
            setIsAddRoleModalOpen(false);
            setNewRole({ name: '', description: '', permissions: {} });
            fetchSettings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create role');
        } finally {
            setIsSubmittingRole(false);
        }
    };

    const handleEditRole = (role: any) => {
        setEditingRole({ ...role });
        setIsEditRoleModalOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!editingRole.name) {
            toast.error('Please enter a role name');
            return;
        }
        setIsSubmittingRole(true);
        try {
            // Sanitise payload for backend
            const updatePayload = {
                name: editingRole.name,
                description: editingRole.description,
                permissions: editingRole.permissions
            };
            
            await rbacService.api.updateRole(editingRole.id, updatePayload);
            toast.success('Role updated successfully');
            setIsEditRoleModalOpen(false);
            fetchSettings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update role');
        } finally {
            setIsSubmittingRole(false);
        }
    };

    const handleDeleteRole = async (id: string) => {
        if (!confirm('Are you sure you want to delete this role? This will affect all users assigned to it.')) return;
        try {
            await rbacService.api.deleteRole(id);
            toast.success('Role deleted successfully');
            fetchSettings();
        } catch (error: any) {
            toast.error('Failed to delete role');
        }
    };

    const handlePermissionToggle = async (module: string, action: string) => {
        const role = roles.find(r => r.id === selectedRoleIdForMatrix);
        if (!role) return;

        const lowModule = module.toLowerCase();
        const lowAction = action.toLowerCase();
        
        // Ensure structure exists
        const currentPermissions = { ...(role.permissions || {}) };
        if (!currentPermissions[lowModule]) {
            currentPermissions[lowModule] = {};
        }

        // Toggle
        currentPermissions[lowModule][lowAction] = !currentPermissions[lowModule][lowAction];

        setIsSavingPermission(true);
        try {
            await rbacService.api.updateRole(role.id, {
                permissions: currentPermissions
            });
            // Update local state immediately for snappy UI
            setRoles(prev => prev.map(r => r.id === role.id ? { ...r, permissions: currentPermissions } : r));
            toast.success(`${action} permission for ${module} updated`);
        } catch (error: any) {
            toast.error('Failed to update permission');
        } finally {
            setIsSavingPermission(false);
        }
    };

    const categories: Category[] = [
        {
            id: 'legal-ready',
            title: 'Legal & Compliance Readiness',
            description: 'Platform legal documents, GDPR enforcement, launch readiness audit, system identity',
            icon: ShieldCheck,
            status: 'Requires Attention',
            tab: 'legal_readiness'
        },
        {
            id: 'org-identity',
            title: 'Organization & Identity',
            description: 'Organization profile, branding (logo, colors), domain & environment settings',
            icon: Building2,
            status: 'Configured',
            tab: 'policies'
        },
        {
            id: 'users-access',
            title: 'Users, Roles & Access',
            description: 'User management, role definitions, permission policies, login & security rules',
            icon: UsersIcon,
            status: 'Configured',
            tab: 'security'
        },

        {
            id: 'people-identity',
            title: 'People & Identity System',
            description: 'Student identity logic, verification states, document access controls',
            icon: UserCheck,
            status: 'Not Set',
            tab: 'people'
        },
        {
            id: 'services-countries',
            title: 'Services, Countries & Defaults',
            description: 'Service defaults, country availability rules, university defaults, comparison behavior',
            icon: Globe,
            status: 'Configured',
            tab: 'services_countries'
        },
        {
            id: 'comparison-rules',
            title: 'Comparison Rules',
            description: 'Define how countries and universities are compared, scored, weighted, and ranked across the platform.',
            icon: Scale,
            status: 'Configured',
            tab: 'comparison_rules'
        },
        {
            id: 'ai-settings',
            title: 'AI Visa Assistant Settings',
            description: 'Prompt templates, country rule logic, scoring weights, risk thresholds, escalation rules, AI safety guardrails',
            icon: Brain,
            status: 'Requires Attention',
            tab: 'ai'
        },
        {
            id: 'communications',
            title: 'Communications & Campaigns',
            description: 'Sender identities, email domains, message templates, campaign defaults',
            icon: Mail,
            status: 'Configured',
            tab: 'communications'
        },
        {
            id: 'delivery-controls',
            title: 'Delivery & Safety Controls',
            description: 'Rate limits, quiet hours, abuse prevention, suppression rules',
            icon: Shield,
            status: 'Configured',
            tab: 'delivery_safety'
        },
        {
            id: 'notifications',
            title: 'Notifications & Alerts',
            description: 'Admin alerts, system notifications, failure alerts',
            icon: Bell,
            status: 'Configured',
            tab: 'notifications'
        },
        {
            id: 'compliance',
            title: 'Compliance & Privacy',
            description: 'GDPR & consent management, data retention rules, audit logs, user data requests',
            icon: LockIcon,
            status: 'Requires Attention',
            tab: 'compliance'
        },
        {
            id: 'finance',
            title: 'Finance & Payments',
            description: 'Payment gateways, currency settings, pricing rules, tax rules',
            icon: DollarSign,
            status: 'Configured',
            tab: 'finance'
        },
        {
            id: 'localization',
            title: 'Localization & Regions',
            description: 'Languages, regions, timezones, formatting rules',
            icon: Languages,
            status: 'Not Set',
            tab: 'localization'
        },
        {
            id: 'integrations',
            title: 'Integrations & APIs',
            description: 'API keys, webhooks, third-party integrations',
            icon: Plug,
            status: 'Configured',
            tab: 'integrations'
        },
        {
            id: 'files',
            title: 'Files & Assets',
            description: 'Media library, document storage, upload limits',
            icon: Folder,
            status: 'Configured',
            tab: 'files'
        },
        {
            id: 'legal',
            title: 'Policies & Legal',
            description: 'Terms of Use, Privacy Policy, affiliate disclosures, disclaimer management',
            icon: FileText,
            status: 'Not Set',
            tab: 'policies'
        },
        {
            id: 'advanced',
            title: 'Advanced & System',
            description: 'Feature flags, environment configuration, system logs, maintenance mode',
            icon: Server,
            status: 'Configured',
            tab: 'advanced'
        }
    ];

    const handleTabChange = (tabId: SettingsTab) => {
        setActiveTab(tabId);
        const category = categories.find(c => c.tab === tabId);
        if (category) setActiveCategoryTitle(category.title);
        
        // Use the useEffect for sub-tab resetting
        setView('detail');
    };

    const handleConfigure = (category: Category) => {
        setActiveTab(category.tab);
        setActiveCategoryTitle(category.title);
        // Reset sub-tab based on category
        if (category.tab === 'general') setActiveSubTab('general');
        else if (category.tab === 'security') setActiveSubTab('users');
        else if (category.tab === 'people') setActiveSubTab('identity_verification');
        else setActiveSubTab('placeholder');
        setView('detail');
    };


    const tabs = [
        { id: 'general', label: 'General Settings', icon: Globe },
        { id: 'ai', label: 'AI Assistant', icon: Bot },
        { id: 'security', label: 'Security & Access', icon: Shield },
        { id: 'people', label: 'People & Identity', icon: UserCheck },
        { id: 'services_countries', label: 'Services & Countries', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'compliance', label: 'Compliance & Privacy', icon: Shield },
        { id: 'finance', label: 'Finance & Payments', icon: DollarSign },
        { id: 'localization', label: 'Localization & Regions', icon: Languages },
        { id: 'integrations', label: 'Integrations & APIs', icon: Plug },
        { id: 'files', label: 'Files & Assets', icon: HardDrive },
        { id: 'policies', label: 'Policies & Legal', icon: Scale },
        { id: 'legal_readiness', label: 'Launch Readiness', icon: ShieldCheck },
        { id: 'advanced', label: 'Advanced & System', icon: Server },
    ];


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mx-4">
                    <Loader2 className="w-10 h-10 text-[#0f172b] animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Loading settings...</p>
                </div>
            );
        }

        if (view === 'grid') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-12">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8a3ffc] to-[#6929c4] text-white shadow-lg shadow-purple-200 group-hover:scale-105 transition-transform">
                                    <cat.icon size={28} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight border ${
                                    cat.status === 'Configured' ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]' :
                                    cat.status === 'Requires Attention' ? 'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]' :
                                    'bg-[#f8fafc] text-[#64748b] border-[#e2e8f0]'
                                }`}>
                                    {cat.status === 'Configured' && <CheckCircle size={12} />}
                                    {cat.status === 'Requires Attention' && <div className="w-1.5 h-1.5 rounded-full bg-[#92400e]" />}
                                    {cat.status === 'Not Set' && <div className="w-1.5 h-1.5 rounded-full bg-[#64748b]" />}
                                    {cat.status}
                                </div>
                            </div>
                            
                            <h3 className="text-[22px] font-bold text-[#0f172b] mb-3 leading-tight transition-colors group-hover:text-[#6929c4]">{cat.title}</h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed mb-8 flex-1">{cat.description}</p>
                            
                            <Button 
                                onClick={() => handleConfigure(cat)}
                                className="w-full bg-[#0a061d] hover:bg-[#1a1438] text-white h-[52px] rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                            >
                                Configure <SettingsIcon size={16} />
                            </Button>
                        </div>
                    ))}
                </div>
            );
        }

        // Detail view
        return (
            <div className="px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <button 
                            onClick={() => setView('grid')}
                            className="flex items-center gap-2 text-[#64748b] hover:text-[#0f172b] mb-4 font-bold text-sm transition-all hover:-translate-x-1"
                        >
                            <ChevronLeft size={18} /> BACK TO SETTINGS
                        </button>
                        <h2 className="text-[34px] font-extrabold text-[#0f172b] tracking-tight">{activeCategoryTitle}</h2>
                        <p className="text-[#64748b] text-[17px] mt-1 font-medium">
                            {activeTab === 'people' 
                                ? 'Manage users, roles, and identity verification settings'
                                : activeTab === 'notifications'
                                    ? ''
                                    : activeTab === 'compliance'
                                        ? 'Configure GDPR, data protection, consent, and audit log rules'
                                        : activeTab === 'finance'
                                            ? 'Configure financial settings, payment methods, and billing rules'
                                            : activeTab === 'localization'
                                                ? 'Configure languages, regions, timezones, and formatting rules'
                                                : activeTab === 'integrations'
                                                    ? 'Configure API keys, webhooks, and third-party service connections'
                                                    : activeTab === 'files'
                                                        ? 'Configure storage providers, upload rules, and asset optimization'
                                                        : activeTab === 'policies'
                                                            ? 'Manage legal policies, terms, privacy, and compliance rules'
                                                            : 'Configure organization profile, branding, and system preferences'}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={['general', 'people', 'services_countries', 'comparison_rules', 'notifications', 'ai', 'communications', 'delivery_safety', 'compliance', 'finance', 'localization', 'integrations', 'files', 'policies', 'advanced'].includes(activeTab) ? handleSaveSystem : undefined}
                            disabled={isSaving}
                            className="bg-[#0a061d] hover:bg-[#1a1438] text-white px-8 h-[54px] rounded-[18px] text-[15px] font-bold shadow-xl shadow-purple-950/10 transition-all active:scale-95 flex items-center gap-2.5"
                        >
                            {isSaving ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </div>


                {activeTab === 'placeholder' ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SettingsIcon size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0f172b] mb-2">Module Coming Soon</h3>
                        <p className="text-gray-500 max-w-md mx-auto">This configuration module is currently under development and will be available in a future update.</p>
                        <Button variant="outline" onClick={() => setView('grid')} className="mt-8 rounded-xl h-11 px-8">Return to Grid</Button>
                    </div>
                ) : (
                    <>
                        {activeTab === 'ai' && (
                            <AIVisaAssistantSettings 
                                settings={aiSettings} 
                                setSettings={setAiSettings} 
                            />
                        )}
                        {activeTab === 'communications' && (
                            <CommunicationsSettings 
                                settings={communicationSettings} 
                                setSettings={setCommunicationSettings} 
                            />
                        )}
                        {activeTab === 'delivery_safety' && (
                            <DeliverySafetySettingsComp 
                                settings={deliverySafetySettings} 
                                setSettings={setDeliverySafetySettings} 
                            />
                        )}
                        {activeTab === 'compliance' && (
                            <CompliancePrivacySettings 
                                settings={complianceSettings} 
                                setSettings={setComplianceSettings} 
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'finance' && (
                            <FinancePaymentSettings 
                                settings={financeSettings} 
                                setSettings={setFinanceSettings} 
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'localization' && (
                            <LocalizationRegionSettings 
                                settings={localizationSettings} 
                                setSettings={setLocalizationSettings} 
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'integrations' && (
                            <IntegrationApiSettings 
                                settings={integrationSettings} 
                                setSettings={setIntegrationSettings} 
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'files' && (
                            <FileAssetSettings 
                                settings={fileSettings} 
                                setSettings={setFileSettings} 
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'policies' && (
                            <PolicyLegalSettings 
                                globalSettings={policyGlobalSettings} 
                                setGlobalSettings={setPolicyGlobalSettings} 
                                onSaveGlobal={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'advanced' && (
                            <AdvancedSystemSettings
                                settings={systemSettings}
                                setSettings={setSystemSettings}
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                {/* Sub-Navigation */}
                                <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
                                    {[
                                        { id: 'general', label: 'General', icon: Building2 },
                                        { id: 'branding', label: 'Branding', icon: Palette },
                                        { id: 'domain', label: 'Domain & Environment', icon: Globe },
                                        { id: 'business', label: 'Business Details', icon: Briefcase },
                                        { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
                                    ].map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setActiveSubTab(sub.id)}
                                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                                activeSubTab === sub.id
                                                    ? 'bg-[#0a061d] text-white shadow-lg'
                                                    : 'text-gray-500 hover:text-[#0f172b] hover:bg-gray-50'
                                            }`}
                                        >
                                            <sub.icon size={18} />
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>

                                {activeSubTab === 'general' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="max-w-[1000px]">
                                            <div className="mb-12">
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">General Information</h2>
                                                <p className="text-gray-500 text-[16px]">Basic organization details and contact information</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Organization Name <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={systemSettings.platform_name}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="Enter organization name"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Legal Entity Name <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={systemSettings.legal_entity_name || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, legal_entity_name: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="e.g. Global Visa Services Pvt Ltd"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Organization Type <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            value={systemSettings.organization_type || 'Marketplace'}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, organization_type: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white appearance-none cursor-pointer text-[16px] font-medium pr-12"
                                                        >
                                                            <option value="Marketplace">Marketplace</option>
                                                            <option value="Agency">Agency</option>
                                                            <option value="Consultancy">Consultancy</option>
                                                            <option value="Institution">Institution</option>
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <ChevronLeft size={20} className="-rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Support Email <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="email"
                                                        value={systemSettings.support_email}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, support_email: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="e.g. support@globalvisa.com"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Support Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={systemSettings.support_phone || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, support_phone: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="+1-555-0100"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Timezone <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            value={systemSettings.timezone || 'UTC'}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white appearance-none cursor-pointer text-[16px] font-medium pr-12"
                                                        >
                                                            <option value="UTC">UTC (Universal Coordinated Time)</option>
                                                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                                                            <option value="IST">IST (Indian Standard Time)</option>
                                                            <option value="EST">EST (Eastern Standard Time)</option>
                                                            <option value="PST">PST (Pacific Standard Time)</option>
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <ChevronLeft size={20} className="-rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Default Currency <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            value={systemSettings.primary_currency}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, primary_currency: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white appearance-none cursor-pointer text-[16px] font-medium pr-12"
                                                        >
                                                            <option value="USD">USD - US Dollar</option>
                                                            <option value="GBP">GBP - British Pound</option>
                                                            <option value="EUR">EUR - Euro</option>
                                                            <option value="INR">INR - Indian Rupee</option>
                                                            <option value="AUD">AUD - Australian Dollar</option>
                                                            <option value="CAD">CAD - Canadian Dollar</option>
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <ChevronLeft size={20} className="-rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'branding' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                            <div className="mb-12">
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Branding & Visual Identity</h2>
                                                <p className="text-gray-500 text-[16px]">Upload logos and customize brand colors</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                                {/* Logo Light */}
                                                <div className="space-y-4">
                                                    <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Logo (Light Version)</label>
                                                    <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 text-center hover:border-[#6929c4] transition-all cursor-pointer group bg-gray-50/30">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                            <Upload size={20} className="text-gray-400 group-hover:text-[#6929c4]" />
                                                        </div>
                                                        <p className="text-sm font-bold text-[#0f172b]">Click to upload</p>
                                                        <p className="text-[12px] text-gray-400 mt-1">PNG, JPG or SVG</p>
                                                    </div>
                                                </div>

                                                {/* Logo Dark */}
                                                <div className="space-y-4">
                                                    <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Logo (Dark Version)</label>
                                                    <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 text-center hover:border-[#6929c4] transition-all cursor-pointer group bg-gray-50/30">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                            <Upload size={20} className="text-gray-400 group-hover:text-[#6929c4]" />
                                                        </div>
                                                        <p className="text-sm font-bold text-[#0f172b]">Click to upload</p>
                                                        <p className="text-[12px] text-gray-400 mt-1">PNG, JPG or SVG</p>
                                                    </div>
                                                </div>

                                                {/* Favicon */}
                                                <div className="space-y-4">
                                                    <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Favicon</label>
                                                    <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-8 text-center hover:border-[#6929c4] transition-all cursor-pointer group bg-gray-50/30">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                                            <Upload size={20} className="text-gray-400 group-hover:text-[#6929c4]" />
                                                        </div>
                                                        <p className="text-sm font-bold text-[#0f172b]">Click to upload</p>
                                                        <p className="text-[12px] text-gray-400 mt-1">ICO or PNG (32x32)</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                                                {/* Primary Color */}
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Primary Color</label>
                                                    <div className="flex items-center gap-4">
                                                        <div 
                                                            className="w-14 h-14 rounded-2xl border border-gray-100 shadow-sm"
                                                            style={{ backgroundColor: systemSettings.primary_color }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={systemSettings.primary_color}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                                                            className="flex-1 h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all font-mono text-[16px]"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Accent Color */}
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Accent Color</label>
                                                    <div className="flex items-center gap-4">
                                                        <div 
                                                            className="w-14 h-14 rounded-2xl border border-gray-100 shadow-sm"
                                                            style={{ backgroundColor: systemSettings.accent_color }}
                                                        />
                                                        <input
                                                            type="text"
                                                            value={systemSettings.accent_color}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                                                            className="flex-1 h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all font-mono text-[16px]"
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Email Header Logo */}
                                            <div className="space-y-4 mb-16">
                                                <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Email Header Logo</label>
                                                <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-12 text-center hover:border-[#6929c4] transition-all cursor-pointer group bg-gray-50/30">
                                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                                                        <Upload size={24} className="text-gray-400 group-hover:text-[#6929c4]" />
                                                    </div>
                                                    <p className="text-[17px] font-bold text-[#0f172b]">Click to upload email logo</p>
                                                    <p className="text-[13px] text-gray-400 mt-1 font-medium">Recommended size: 600x200px</p>
                                                </div>
                                            </div>

                                            {/* Preview Section */}
                                            <div className="pt-12 border-t border-gray-100">
                                                <h3 className="text-xl font-bold text-[#0f172b] mb-8 uppercase tracking-widest text-[14px]">Preview</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    {/* Sidebar Preview */}
                                                    <div className="space-y-4">
                                                        <p className="text-[12px] font-bold text-gray-400 ml-1 uppercase">Sidebar Preview</p>
                                                        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 aspect-square flex flex-col items-center justify-center">
                                                            <div 
                                                                className="w-full h-[120px] rounded-2xl flex items-center justify-center mb-4 transition-all"
                                                                style={{ backgroundColor: systemSettings.primary_color }}
                                                            >
                                                                <span className="text-white font-black tracking-tighter text-2xl opacity-50 uppercase">Logo</span>
                                                            </div>
                                                            <div className="w-1/2 h-2 bg-gray-200 rounded-full mb-3" />
                                                            <div className="w-2/3 h-2 bg-gray-200 rounded-full mb-3" />
                                                            <div className="w-1/3 h-2 bg-gray-200 rounded-full" />
                                                        </div>
                                                    </div>

                                                    {/* Button Preview */}
                                                    <div className="space-y-4">
                                                        <p className="text-[12px] font-bold text-gray-400 ml-1 uppercase">Button Preview</p>
                                                        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 aspect-square flex flex-col items-center justify-center gap-4">
                                                            <button 
                                                                className="w-full h-14 rounded-2xl text-white font-bold text-[15px] transition-all"
                                                                style={{ backgroundColor: systemSettings.primary_color }}
                                                            >
                                                                Primary Button
                                                            </button>
                                                            <button 
                                                                className="w-full h-14 rounded-2xl text-white font-bold text-[15px] transition-all"
                                                                style={{ backgroundColor: systemSettings.accent_color }}
                                                            >
                                                                Accent Button
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Email Preview */}
                                                    <div className="space-y-4">
                                                        <p className="text-[12px] font-bold text-gray-400 ml-1 uppercase">Email Preview</p>
                                                        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 aspect-square flex flex-col">
                                                            <div 
                                                                className="w-full h-[60px] rounded-t-2xl flex items-center justify-center mb-4 transition-all"
                                                                style={{ backgroundColor: systemSettings.primary_color }}
                                                            >
                                                                <span className="text-white font-bold text-[10px] tracking-widest uppercase opacity-40">Email Header</span>
                                                            </div>
                                                            <div className="px-2 space-y-3">
                                                                <div className="w-full h-1.5 bg-gray-200 rounded-full" />
                                                                <div className="w-full h-1.5 bg-gray-200 rounded-full" />
                                                                <div className="w-2/3 h-1.5 bg-gray-200 rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'domain' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                            <div className="mb-12">
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Domain & Environment Configuration</h2>
                                                <p className="text-gray-500 text-[16px]">Configure domain settings and environment variables</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Primary Domain <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={systemSettings.primary_domain || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, primary_domain: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="e.g. yourdomain.com"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Subdomain</label>
                                                    <input
                                                        type="text"
                                                        value={systemSettings.subdomain || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, subdomain: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="e.g. app"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Staging Domain</label>
                                                    <input
                                                        type="text"
                                                        value={systemSettings.staging_domain || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, staging_domain: e.target.value }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="e.g. staging.yourdomain.com"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Environment <span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <select
                                                            value={systemSettings.environment || 'Production'}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, environment: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white appearance-none cursor-pointer text-[16px] font-medium pr-12"
                                                        >
                                                            <option value="Production">Production</option>
                                                            <option value="Staging">Staging</option>
                                                            <option value="Development">Development</option>
                                                        </select>
                                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <ChevronLeft size={20} className="-rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-gray-100">
                                                <h3 className="text-[15px] font-bold text-[#0f172b] mb-6 uppercase tracking-wider">Maintenance Mode</h3>
                                                <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all group">
                                                    <div>
                                                        <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Enable Maintenance Mode</h3>
                                                        <p className="text-sm text-gray-500">When enabled, users will see a maintenance page</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer scale-125 mr-4">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={systemSettings.maintenance_mode || false}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6929c4]"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'business' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                            <div className="mb-12">
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Business & Legal Details</h2>
                                                <p className="text-gray-500 text-[16px]">Company registration and tax information</p>
                                            </div>

                                            <div className="space-y-10">
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Registered Address <span className="text-red-500">*</span></label>
                                                    <textarea
                                                        value={systemSettings.registered_address || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, registered_address: e.target.value }))}
                                                        rows={3}
                                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium resize-none"
                                                        placeholder="Enter full registered office address"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                    <div className="group">
                                                        <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">GST / Tax ID</label>
                                                        <input
                                                            type="text"
                                                            value={systemSettings.tax_id || ''}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, tax_id: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                            placeholder="e.g. GST123456789"
                                                        />
                                                    </div>

                                                    <div className="group">
                                                        <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Company Registration Number</label>
                                                        <input
                                                            type="text"
                                                            value={systemSettings.registration_number || ''}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, registration_number: e.target.value }))}
                                                            className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                            placeholder="e.g. CRN-2024-001"
                                                        />
                                                    </div>

                                                    <div className="group">
                                                        <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Country of Registration <span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <select
                                                                value={systemSettings.country_of_registration || 'United States'}
                                                                onChange={(e) => setSystemSettings(prev => ({ ...prev, country_of_registration: e.target.value }))}
                                                                className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white appearance-none cursor-pointer text-[16px] font-medium pr-12"
                                                            >
                                                                <option value="United States">United States</option>
                                                                <option value="United Kingdom">United Kingdom</option>
                                                                <option value="India">India</option>
                                                                <option value="Australia">Australia</option>
                                                                <option value="Canada">Canada</option>
                                                            </select>
                                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                                <ChevronLeft size={20} className="-rotate-90" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Invoice Footer Text</label>
                                                    <textarea
                                                        value={systemSettings.invoice_footer || ''}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, invoice_footer: e.target.value }))}
                                                        rows={3}
                                                        className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium resize-none"
                                                        placeholder="Add a footer message for your invoices..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'preferences' && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                            <div className="mb-12">
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">System Preferences</h2>
                                                <p className="text-gray-500 text-[16px]">Configure platform behavior and user requirements</p>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { 
                                                        id: 'multi_country_mode', 
                                                        title: 'Enable Multi-Country Mode', 
                                                        description: 'Allow services across multiple countries' 
                                                    },
                                                    { 
                                                        id: 'multi_service_mode', 
                                                        title: 'Enable Multi-Service Mode', 
                                                        description: 'Allow multiple service types per student' 
                                                    },
                                                    { 
                                                        id: 'allow_guest_enquiries', 
                                                        title: 'Allow Guest Enquiries', 
                                                        description: 'Let users submit enquiries without registration' 
                                                    },
                                                    { 
                                                        id: 'require_email_verification', 
                                                        title: 'Require Email Verification', 
                                                        description: 'Users must verify email before accessing platform' 
                                                    },
                                                    { 
                                                        id: 'require_phone_verification', 
                                                        title: 'Require Phone Verification', 
                                                        description: 'Users must verify phone number before accessing platform' 
                                                    }
                                                ].map((pref) => (
                                                    <div key={pref.id} className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all group">
                                                        <div className="max-w-[70%]">
                                                            <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">{pref.title}</h3>
                                                            <p className="text-sm text-gray-500">{pref.description}</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer scale-125 mr-4">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={!!(systemSettings as any)[pref.id]}
                                                                onChange={(e) => setSystemSettings(prev => ({ ...prev, [pref.id]: e.target.checked }))}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6929c4]"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab !== 'general' && activeSubTab !== 'branding' && activeSubTab !== 'domain' && activeSubTab !== 'business' && activeSubTab !== 'preferences' && (
                                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <SettingsIcon size={48} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-[22px] font-bold text-[#0f172b] mb-3">Sub-Module Coming Soon</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto text-[16px] leading-relaxed">The {activeSubTab.charAt(0).toUpperCase() + activeSubTab.slice(1)} configuration for Organization & Identity is currently under development.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Sub-Navigation */}
                                <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
                                    {[
                                        { id: 'users', label: 'Users', icon: UsersIconSmall },
                                        { id: 'roles', label: 'Roles', icon: UserCheck },
                                        { id: 'permissions', label: 'Permissions Matrix', icon: Shield },
                                        { id: 'security_rules', label: 'Security Rules', icon: LockIcon },
                                        { id: 'login_policies', label: 'Login Policies', icon: RotateCcw }
                                    ].map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setActiveSubTab(sub.id)}
                                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                                activeSubTab === sub.id
                                                    ? 'bg-[#0a061d] text-white shadow-lg'
                                                    : 'text-gray-500 hover:text-[#0f172b] hover:bg-gray-50'
                                            }`}
                                        >
                                            <sub.icon size={18} />
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>

                                {activeSubTab === 'users' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">User Management</h2>
                                                <p className="text-gray-500 text-[16px]">Manage platform users and their access</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="outline" className="h-[52px] px-8 rounded-2xl font-bold border-gray-200 hover:bg-gray-50 text-gray-700 flex items-center gap-2 transition-all active:scale-95">
                                                    <Mail size={18} /> Invite User
                                                </Button>
                                                <Button 
                                                    onClick={() => setIsAddUserModalOpen(true)}
                                                    className="h-[52px] px-8 rounded-2xl font-bold bg-[#0a061d] hover:bg-[#1a1438] text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/10"
                                                >
                                                    <Plus size={18} /> Add User
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="relative mb-8">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                                <Search size={22} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search users by name, email, or role..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full h-[64px] pl-16 pr-6 rounded-2xl border border-gray-100 focus:border-purple-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 text-[16px] bg-gray-50/30 font-medium"
                                            />
                                        </div>

                                        <div className="overflow-x-auto -mx-10 md:-mx-14">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-100/80">
                                                         <th className="text-left py-6 px-10 md:px-14 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">User ID</th>
                                                         <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Name</th>
                                                         <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Email</th>
                                                         <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Role</th>
                                                         <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Status</th>
                                                         <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Last Login</th>
                                                         <th className="text-right py-6 px-10 md:px-14 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Actions</th>
                                                     </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {users.filter(u => (u.full_name || u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || (u.role_name || u.role || '').toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                                                        <tr key={user.id} className="group hover:bg-gray-50/80 transition-all duration-200">
                                                            <td className="py-8 px-10 md:px-14">
                                                                <span className="text-[15px] font-extrabold text-[#0f172b] tracking-tight">{user.id.substring(0, 8)}</span>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[16px] font-bold text-[#0f172b] leading-tight mb-0.5">{user.full_name || user.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <span className="text-[15px] text-[#64748b] font-medium">{user.email}</span>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <div className="flex items-center">
                                                                    {!(user.role_name || user.role) ? (
                                                                        <div className="flex flex-col items-center justify-center border border-gray-100 bg-[#f8fafc] rounded-2xl px-4 py-2 min-w-[80px]">
                                                                            <span className="text-[11px] font-bold text-gray-400 leading-none">No</span>
                                                                            <span className="text-[11px] font-bold text-gray-400 leading-none mt-0.5">Role</span>
                                                                        </div>
                                                                    ) : (
                                                                        <span className={`px-4 py-2 rounded-2xl text-[12px] font-bold tracking-tight border ${
                                                                            (user.role_name || user.role) === 'Super Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                            (user.role_name || user.role) === 'Manager' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                                            (user.role_name || user.role) === 'Counselor' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                            'bg-gray-50 text-gray-600 border-gray-200'
                                                                        }`}>
                                                                            {user.role_name || user.role}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <div className={`p-1 rounded-full w-fit ${
                                                                    user.account_status?.toLowerCase() === 'active' ? 'bg-blue-50' : 'bg-gray-50'
                                                                }`}>
                                                                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                                                                        user.account_status?.toLowerCase() === 'active' ? 'bg-blue-400' : 'bg-gray-300'
                                                                    }`} />
                                                                </div>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <span className="text-[14px] text-gray-400 font-medium">{user.lastLogin || '-'}</span>
                                                            </td>
                                                            <td className="py-8 px-10 md:px-14 text-right">
                                                                <div className="flex items-center justify-end gap-3">
                                                                    <button 
                                                                        onClick={() => handleEditUser(user)}
                                                                        className="p-2 text-gray-300 hover:text-[#6929c4] transition-colors" 
                                                                        title="Edit User"
                                                                    >
                                                                        <Edit size={19} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => toast.info('Password reset triggered for ' + user.email)}
                                                                        className="p-2 text-gray-300 hover:text-blue-500 transition-colors" 
                                                                        title="Reset Password"
                                                                    >
                                                                        <RotateCcw size={19} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors" 
                                                                        title="Delete User"
                                                                    >
                                                                        <Trash2 size={19} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'roles' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Role Management</h2>
                                                <p className="text-gray-500 text-[16px]">Define roles and assign permissions</p>
                                            </div>
                                            <Button 
                                                onClick={() => setIsAddRoleModalOpen(true)}
                                                className="h-[52px] px-8 rounded-2xl font-bold bg-[#0a061d] hover:bg-[#1a1438] text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/10"
                                            >
                                                <Plus size={18} /> Create Role
                                            </Button>
                                        </div>

                                        <div className="overflow-x-auto -mx-10 md:-mx-14">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-100/80">
                                                        <th className="text-left py-6 px-10 md:px-14 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Role Name</th>
                                                        <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Description</th>
                                                        <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Users</th>
                                                        <th className="text-left py-6 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Permissions</th>
                                                        <th className="text-right py-6 px-10 md:px-14 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.05em]">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {roles.map((role) => (
                                                        <tr key={role.id} className="group hover:bg-gray-50/80 transition-all duration-200">
                                                            <td className="py-8 px-10 md:px-14">
                                                                <span className="text-[16px] font-extrabold text-[#0f172b] tracking-tight">{role.name}</span>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <span className="text-[15px] text-[#64748b] font-medium max-w-md line-clamp-1">{role.description}</span>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                                                                    {role.usersCount || 0} users
                                                                </span>
                                                            </td>
                                                            <td className="py-8 px-4">
                                                                <span className="px-4 py-1.5 rounded-full text-[12px] font-bold bg-green-50 text-green-600 border border-green-100">
                                                                    {getPermissionCount(role.permissions)} permissions
                                                                </span>
                                                            </td>
                                                            <td className="py-8 px-10 md:px-14 text-right">
                                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => handleEditRole(role)}
                                                                        className="p-2.5 text-gray-400 hover:text-[#6929c4] hover:bg-purple-50 rounded-xl transition-all" 
                                                                        title="Edit Role"
                                                                    >
                                                                        <Edit size={19} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteRole(role.id)}
                                                                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                                                                        title="Delete Role"
                                                                    >
                                                                        <Trash2 size={19} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'permissions' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Permissions Matrix</h2>
                                                <p className="text-gray-500 text-[16px]">Configure module-level permissions for each role</p>
                                            </div>
                                            <div className="min-w-[280px]">
                                                <Label className="text-[12px] font-bold text-[#64748b] uppercase tracking-[0.1em] mb-3 ml-1 block">Selected Role</Label>
                                                <Select 
                                                    value={selectedRoleIdForMatrix} 
                                                    onValueChange={setSelectedRoleIdForMatrix}
                                                >
                                                    <SelectTrigger className="h-[58px] rounded-2xl border-gray-200 bg-gray-50/30 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 font-bold text-[#0f172b] px-6">
                                                        <SelectValue placeholder="Select a role to configure" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-gray-100 shadow-2xl p-2">
                                                        {roles.map(role => (
                                                            <SelectItem key={role.id} value={role.id} className="cursor-pointer font-bold py-4 rounded-xl focus:bg-purple-50 focus:text-[#6929c4] transition-colors">
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {!selectedRoleIdForMatrix ? (
                                            <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-[48px] bg-gray-50/20">
                                                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center mx-auto mb-8 border border-gray-50">
                                                    <Shield size={40} className="text-gray-200" />
                                                </div>
                                                <h3 className="text-[20px] font-bold text-[#0f172b] mb-3">Initialize Configuration</h3>
                                                <p className="text-gray-400 max-w-sm mx-auto text-[15px] leading-relaxed">Please select a role from the dropdown above to view and modify its access permissions across all modules.</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto -mx-10 md:-mx-14">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-100/80">
                                                            <th className="text-left py-8 px-10 md:px-14 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.08em]">Module</th>
                                                            {PERMISSION_ACTIONS.map(action => (
                                                                <th key={action} className="text-center py-8 px-4 text-[13px] font-bold text-[#64748b] uppercase tracking-[0.08em]">
                                                                    {action}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {PERMISSION_MODULES.map(module => (
                                                            <tr key={module} className="group hover:bg-gray-50/50 transition-all duration-300">
                                                                <td className="py-8 px-10 md:px-14">
                                                                    <span className="text-[17px] font-bold text-[#0f172b] tracking-tight group-hover:text-[#6929c4] transition-colors">{module}</span>
                                                                </td>
                                                                {PERMISSION_ACTIONS.map(action => {
                                                                    const role = roles.find(r => r.id === selectedRoleIdForMatrix);
                                                                    const isEnabled = role?.permissions?.[module.toLowerCase()]?.[action.toLowerCase()];
                                                                    return (
                                                                        <td key={action} className="py-8 px-4 text-center">
                                                                            <button
                                                                                onClick={() => handlePermissionToggle(module, action)}
                                                                                disabled={isSavingPermission}
                                                                                className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center mx-auto relative transform active:scale-90 ${
                                                                                    isEnabled 
                                                                                        ? 'bg-[#0f172b] shadow-lg shadow-purple-900/10' 
                                                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                                                }`}
                                                                            >
                                                                                {isEnabled && <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />}
                                                                                {isSavingPermission && <Loader2 className="w-4 h-4 text-white animate-spin absolute" />}
                                                                            </button>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeSubTab === 'security_rules' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Security Rules</h2>
                                            <p className="text-gray-500 text-[16px]">Configure password policies and session security</p>
                                        </div>

                                        <div className="space-y-12">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Password Minimum Length</label>
                                                    <input
                                                        type="number"
                                                        value={systemSettings.password_min_length || 8}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, password_min_length: parseInt(e.target.value) }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="8"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Force Password Reset (days)</label>
                                                    <input
                                                        type="number"
                                                        value={systemSettings.force_password_reset_days || 90}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, force_password_reset_days: parseInt(e.target.value) }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="90"
                                                    />
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Session Timeout (minutes)</label>
                                                    <input
                                                        type="number"
                                                        value={systemSettings.session_timeout_minutes || 30}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, session_timeout_minutes: parseInt(e.target.value) }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="30"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all group">
                                                    <div>
                                                        <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Require Special Characters</h3>
                                                        <p className="text-sm text-gray-500">Passwords must contain special characters</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer scale-125 mr-4">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={!!systemSettings.require_special_chars}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, require_special_chars: e.target.checked }))}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f172b]"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all group">
                                                    <div>
                                                        <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">2FA Required</h3>
                                                        <p className="text-sm text-gray-500">Require two-factor authentication for all users</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer scale-125 mr-4">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={!!systemSettings.two_factor_required}
                                                            onChange={(e) => setSystemSettings(prev => ({ ...prev, two_factor_required: e.target.checked }))}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f172b]"></div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="group">
                                                <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">IP Whitelist</label>
                                                <textarea
                                                    value={systemSettings.ip_whitelist || ''}
                                                    onChange={(e) => setSystemSettings(prev => ({ ...prev, ip_whitelist: e.target.value }))}
                                                    rows={4}
                                                    className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium resize-none shadow-inner"
                                                    placeholder="Enter IP addresses, one per line (e.g., 192.168.1.1)"
                                                />
                                            </div>

                                            <div className="pt-6 border-t border-gray-50 flex justify-end">
                                                <Button 
                                                    onClick={handleSaveSystem}
                                                    disabled={isSaving}
                                                    className="h-[58px] px-12 rounded-2xl font-bold bg-[#0f172b] hover:bg-[#1a2340] text-white flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-purple-950/10 min-w-[200px]"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <Loader2 size={18} className="animate-spin" />
                                                            Saving Rules...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Shield size={18} />
                                                            Apply Security Policies
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'login_policies' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Login Policies</h2>
                                            <p className="text-gray-500 text-[16px]">Configure login attempts and authentication methods</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-12 text-center border border-gray-100">
                                            <RotateCcw size={48} className="text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-bold text-[#0f172b]">Login Policy Settings Coming Soon</h3>
                                            <p className="text-gray-500">Advanced login security controls are currently under development.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'people' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Sub-Navigation */}
                                <div className="bg-white rounded-[24px] p-1.5 border border-gray-100 shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar">
                                    {[
                                        { id: 'identity_verification', label: 'Identity Verification', icon: UserCheck },
                                        { id: 'account_lifecycle', label: 'Account Lifecycle', icon: RotateCcw },
                                        { id: 'document_access', label: 'Document Access Rules', icon: FileText },
                                        { id: 'kyc_settings', label: 'KYC Settings', icon: Shield },
                                        { id: 'data_visibility', label: 'Data Visibility', icon: LockIcon }
                                    ].map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => setActiveSubTab(sub.id)}
                                            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                                activeSubTab === sub.id
                                                    ? 'bg-[#0a061d] text-white shadow-lg'
                                                    : 'text-gray-500 hover:text-[#0f172b] hover:bg-gray-50'
                                            }`}
                                        >
                                            <sub.icon size={18} />
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>

                                {activeSubTab === 'identity_verification' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Identity Verification Settings</h2>
                                            <p className="text-gray-500 text-[16px]">Configure verification requirements for new students</p>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                {[
                                                    { 
                                                        id: 'require_email_verification', 
                                                        title: 'Email Verification Required', 
                                                        description: 'Students must verify their email address' 
                                                    },
                                                    { 
                                                        id: 'require_phone_verification', 
                                                        title: 'Phone Verification Required', 
                                                        description: 'Students must verify their phone number' 
                                                    },
                                                    { 
                                                        id: 'manual_admin_approval', 
                                                        title: 'Manual Admin Approval Required', 
                                                        description: 'Admin must manually approve each student' 
                                                    }
                                                ].map((policy) => (
                                                    <div key={policy.id} className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all group">
                                                        <div className="max-w-[70%]">
                                                            <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">{policy.title}</h3>
                                                            <p className="text-sm text-gray-500">{policy.description}</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer scale-125 mr-4">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={!!(systemSettings as any)[policy.id]}
                                                                onChange={(e) => setSystemSettings(prev => ({ ...prev, [policy.id]: e.target.checked }))}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0f172b]"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-6">
                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Auto Approve After (hours)</label>
                                                    <input
                                                        type="number"
                                                        value={systemSettings.auto_approve_hours || 24}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, auto_approve_hours: parseInt(e.target.value) || 0 }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-100 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="24"
                                                    />
                                                    <p className="text-[11px] text-gray-400 mt-2 ml-1 italic">Set to 0 to disable auto-approval</p>
                                                </div>

                                                <div className="group">
                                                    <label className="block text-[13px] font-bold text-[#64748b] mb-3 ml-1 uppercase tracking-wider">Verification Expiry (days)</label>
                                                    <input
                                                        type="number"
                                                        value={systemSettings.verification_expiry_days || 365}
                                                        onChange={(e) => setSystemSettings(prev => ({ ...prev, verification_expiry_days: parseInt(e.target.value) || 0 }))}
                                                        className="w-full h-[58px] px-6 rounded-2xl border border-gray-100 focus:border-[#6929c4] focus:ring-4 focus:ring-purple-50 outline-none transition-all placeholder:text-gray-300 bg-gray-50/30 focus:bg-white text-[16px] font-medium"
                                                        placeholder="365"
                                                    />
                                                    <p className="text-[11px] text-gray-400 mt-2 ml-1 italic">Identity verification validity period</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'account_lifecycle' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                            <div>
                                                <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Account Lifecycle States</h2>
                                                <p className="text-gray-500 text-[16px]">Define and manage student account states</p>
                                            </div>
                                            <Button className="bg-[#0a061d] hover:bg-[#1a1438] text-white px-6 h-12 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-900/10 transition-all active:scale-95">
                                                <Plus size={18} />
                                                Add State
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { id: 'state_draft', title: 'Draft', description: 'Initial state when profile is created', color: '#94a3b8', initial: 'D' },
                                                { id: 'state_pending', title: 'Pending Verification', description: 'Awaiting email/phone verification', color: '#f59e0b', initial: 'P', active: true },
                                                { id: 'state_active', title: 'Active', description: 'Verified and active account', color: '#10b981', initial: 'A' },
                                                { id: 'state_suspended', title: 'Suspended', description: 'Temporarily suspended account', color: '#ef4444', initial: 'S' },
                                                { id: 'state_rejected', title: 'Rejected', description: 'Application rejected', color: '#dc2626', initial: 'R' },
                                                { id: 'state_archived', title: 'Archived', description: 'Archived or closed account', color: '#6b7280', initial: 'A' }
                                            ].map((state) => (
                                                <div 
                                                    key={state.id} 
                                                    className={`group relative flex items-center justify-between p-6 bg-white rounded-[24px] border ${
                                                        state.active ? 'border-[#1a1438] ring-1 ring-[#1a1438]' : 'border-gray-100/60'
                                                    } hover:border-purple-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300`}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        {/* Avatar/Initial Box */}
                                                        <div 
                                                            className="w-[52px] h-[52px] rounded-[18px] flex items-center justify-center text-white text-lg font-bold shadow-sm"
                                                            style={{ backgroundColor: state.color }}
                                                        >
                                                            {state.initial}
                                                        </div>

                                                        {/* Content */}
                                                        <div className="space-y-1">
                                                            <h3 className="text-[17px] font-bold text-[#0f172b] tracking-tight">{state.title}</h3>
                                                            <p className="text-[14px] text-gray-500 leading-relaxed font-medium">{state.description}</p>
                                                            
                                                            {/* Color Indicator */}
                                                            <div className="flex items-center gap-2 pt-1">
                                                                <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: state.color }} />
                                                                <span className="text-[12px] font-mono text-gray-400 uppercase tracking-tighter">{state.color}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-white hover:text-[#0f172b] border border-transparent hover:border-gray-200 transition-all duration-200 hover:shadow-sm">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all duration-200 hover:shadow-sm">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'document_access' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Document Access Rules</h2>
                                            <p className="text-gray-500 text-[16px]">Control who can view and download student documents</p>
                                        </div>

                                        <div className="space-y-12">
                                            {/* Role Access Grid */}
                                            <div className="space-y-6">
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-6">Who can view student documents</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {['Admin', 'Manager', 'Counselor', 'Expert', 'Finance Team'].map((role) => (
                                                        <div 
                                                            key={role} 
                                                            className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-purple-100 transition-all cursor-pointer group"
                                                            onClick={() => {
                                                                const currentRoles = systemSettings.document_access_roles || [];
                                                                const newRoles = currentRoles.includes(role)
                                                                    ? currentRoles.filter(r => r !== role)
                                                                    : [...currentRoles, role];
                                                                setSystemSettings(prev => ({ ...prev, document_access_roles: newRoles }));
                                                            }}
                                                        >
                                                            <Checkbox 
                                                                id={`role-${role}`} 
                                                                checked={(systemSettings.document_access_roles || []).includes(role)}
                                                                onCheckedChange={() => {}} // Handled by div onClick
                                                                className="scale-125 border-gray-300 data-[state=checked]:bg-[#0a061d] data-[state=checked]:border-[#0a061d]"
                                                            />
                                                            <label 
                                                                htmlFor={`role-${role}`}
                                                                className="text-[16px] font-bold text-[#0f172b] cursor-pointer"
                                                            >
                                                                {role}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Configuration Settings */}
                                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                                {[
                                                    { 
                                                        id: 'mask_sensitive_documents', 
                                                        title: 'Mask Sensitive Documents', 
                                                        description: 'Partially hide sensitive information in documents' 
                                                    },
                                                    { 
                                                        id: 'allow_document_download', 
                                                        title: 'Allow Document Download', 
                                                        description: 'Users can download documents to their device' 
                                                    },
                                                    { 
                                                        id: 'watermark_documents', 
                                                        title: 'Watermark Documents', 
                                                        description: 'Add watermark with user info when viewing documents' 
                                                    }
                                                ].map((setting) => (
                                                    <div 
                                                        key={setting.id} 
                                                        className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[28px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all duration-300"
                                                    >
                                                        <div>
                                                            <h4 className="text-[17px] font-bold text-[#0f172b] mb-1">{setting.title}</h4>
                                                            <p className="text-sm text-gray-500 font-medium">{setting.description}</p>
                                                        </div>
                                                        <Switch 
                                                            checked={!!(systemSettings as any)[setting.id]}
                                                            onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, [setting.id]: checked }))}
                                                            className="data-[state=checked]:bg-[#1a1438] data-[state=unchecked]:bg-gray-200"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'kyc_settings' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">KYC Settings</h2>
                                            <p className="text-gray-500 text-[16px]">Configure Know Your Customer requirements</p>
                                        </div>

                                        <div className="space-y-12">
                                            {/* KYC Required Before */}
                                            <div className="space-y-6">
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-6">KYC Required Before</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { id: 'kyc_required_booking', title: 'Booking', description: 'Students must complete KYC before booking services' },
                                                        { id: 'kyc_required_loan', title: 'Loan Application', description: 'Students must complete KYC before applying for loans' },
                                                        { id: 'kyc_required_visa', title: 'Visa Application', description: 'Students must complete KYC before visa applications' }
                                                    ].map((item) => (
                                                        <div 
                                                            key={item.id} 
                                                            className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[28px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all duration-300"
                                                        >
                                                            <div>
                                                                <h4 className="text-[17px] font-bold text-[#0f172b] mb-1">{item.title}</h4>
                                                                <p className="text-sm text-gray-500 font-medium">{item.description}</p>
                                                            </div>
                                                            <Switch 
                                                                checked={!!(systemSettings as any)[item.id]}
                                                                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, [item.id]: checked }))}
                                                                className="data-[state=checked]:bg-[#1a1438] data-[state=unchecked]:bg-gray-200"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Required KYC Documents */}
                                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                                <h3 className="text-[15px] font-bold text-[#0f172b] mb-4">Required KYC Document Types</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {['Passport', 'National ID', 'Address Proof', 'Birth Certificate', 'Education Documents'].map((doc) => (
                                                        <div 
                                                            key={doc} 
                                                            className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-purple-100 transition-all cursor-pointer group"
                                                            onClick={() => {
                                                                const currentDocs = systemSettings.kyc_document_types || [];
                                                                const newDocs = currentDocs.includes(doc)
                                                                    ? currentDocs.filter(d => d !== doc)
                                                                    : [...currentDocs, doc];
                                                                setSystemSettings(prev => ({ ...prev, kyc_document_types: newDocs }));
                                                            }}
                                                        >
                                                            <Checkbox 
                                                                id={`doc-${doc}`} 
                                                                checked={(systemSettings.kyc_document_types || []).includes(doc)}
                                                                onCheckedChange={() => {}} // Handled by div onClick
                                                                className="scale-125 border-2 border-[#1a1438]/20 bg-white data-[state=checked]:bg-[#1a1438] data-[state=checked]:border-[#1a1438]"
                                                            />
                                                            <label 
                                                                htmlFor={`doc-${doc}`}
                                                                className="text-[16px] font-bold text-[#1a1438] cursor-pointer"
                                                            >
                                                                {doc}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab === 'data_visibility' && (
                                    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="mb-12">
                                            <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Data Visibility Rules</h2>
                                            <p className="text-gray-500 text-[16px]">Control what information different roles can access</p>
                                        </div>

                                        <div className="space-y-6">
                                            {[
                                                { 
                                                    id: 'hide_phone_from_experts', 
                                                    title: 'Hide Phone from Experts', 
                                                    description: 'Experts cannot see student phone numbers' 
                                                },
                                                { 
                                                    id: 'hide_email_from_counselors', 
                                                    title: 'Hide Email from Counselors', 
                                                    description: 'Counselors cannot see student email addresses' 
                                                },
                                                { 
                                                    id: 'allow_cross_department_access', 
                                                    title: 'Allow Cross-Department Access', 
                                                    description: 'Users can access data from other departments' 
                                                },
                                                { 
                                                    id: 'log_identity_changes', 
                                                    title: 'Log Identity Changes', 
                                                    description: 'Track all changes to student identity information' 
                                                }
                                            ].map((rule) => (
                                                <div 
                                                    key={rule.id} 
                                                    className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[28px] border border-gray-100 hover:bg-white hover:border-purple-100 transition-all duration-300"
                                                >
                                                    <div>
                                                        <h4 className="text-[17px] font-bold text-[#0f172b] mb-1">{rule.title}</h4>
                                                        <p className="text-sm text-gray-500 font-medium">{rule.description}</p>
                                                    </div>
                                                    <Switch 
                                                        checked={!!(systemSettings as any)[rule.id]}
                                                        onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, [rule.id]: checked }))}
                                                        className="data-[state=checked]:bg-[#1a1438] data-[state=unchecked]:bg-gray-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Privacy & Compliance Note */}
                                        <div className="mt-12 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/60 flex items-start gap-5">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-blue-100/40 shrink-0 mt-1">
                                                <Shield className="text-blue-500" size={22} />
                                            </div>
                                            <div>
                                                <h4 className="text-[17px] font-bold text-blue-900 mb-2">Privacy & Compliance Note</h4>
                                                <p className="text-[15px] text-blue-800/70 leading-relaxed font-medium">
                                                    These visibility rules help maintain data privacy and comply with regulations. All access is logged for audit purposes.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSubTab !== 'identity_verification' && activeSubTab !== 'account_lifecycle' && activeSubTab !== 'document_access' && activeSubTab !== 'kyc_settings' && activeSubTab !== 'data_visibility' && (
                                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <SettingsIcon size={48} className="text-gray-300" />
                                        </div>
                                        <h3 className="text-[22px] font-bold text-[#0f172b] mb-3">Module Coming Soon</h3>
                                        <p className="text-gray-500 max-w-sm mx-auto text-[16px] leading-relaxed">
                                            The {(activeSubTab || '').split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} configuration for People & Identity is currently under development.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'services_countries' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Service Availability Rules */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Service Availability Rules</h2>
                                        <p className="text-gray-500 text-[16px]">Control how services are activated and managed across regions</p>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Enable Service Activation by Country</h3>
                                                <p className="text-sm text-gray-500">Allow services to be enabled/disabled per country</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.enable_service_activation_by_country}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, enable_service_activation_by_country: val }))}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Active Services</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                    'Visa Counseling', 'Loan Assistance', 'Insurance', 'SIM Card', 
                                                    'Forex', 'Housing', 'Tax Services'
                                                ].map((service) => (
                                                    <div key={service} className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all">
                                                        <Checkbox 
                                                            id={`service-${service}`}
                                                            checked={(serviceCountrySettings.default_active_services || []).includes(service)}
                                                            onCheckedChange={(checked) => {
                                                                const current = serviceCountrySettings.default_active_services || [];
                                                                const updated = checked 
                                                                    ? [...current, service]
                                                                    : current.filter((s: string) => s !== service);
                                                                setServiceCountrySettings(prev => ({ ...prev, default_active_services: updated }));
                                                            }}
                                                        />
                                                        <label htmlFor={`service-${service}`} className="text-[15px] font-semibold text-[#1a1438] cursor-pointer selection:bg-none">
                                                            {service}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Auto-Enable New Services</h3>
                                                <p className="text-sm text-gray-500">Automatically activate new services when added to the platform</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.auto_enable_new_services}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, auto_enable_new_services: val }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Allow Service Customization per Country</h3>
                                                <p className="text-sm text-gray-500">Enable country-specific service configuration overrides</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.allow_service_customization_by_country}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, allow_service_customization_by_country: val }))}
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Service Visibility Mode</label>
                                            <Select 
                                                value={serviceCountrySettings.service_visibility_mode || 'Country-based'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, service_visibility_mode: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200 focus:ring-4 focus:ring-purple-50">
                                                    <SelectValue placeholder="Select visibility mode" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="Country-based" className="py-3 px-4 focus:bg-purple-50">Country-based - Services vary by country</SelectItem>
                                                    <SelectItem value="Global" className="py-3 px-4 focus:bg-purple-50">Global - All services available everywhere</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Controls how services are displayed across the platform</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Country Default Rules */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Country Default Rules</h2>
                                        <p className="text-gray-500 text-[16px]">Set default configurations for country specific behavior</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Destination Country</label>
                                            <Select 
                                                value={serviceCountrySettings.default_destination_country || 'United States'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, default_destination_country: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="United States">United States</SelectItem>
                                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                                    <SelectItem value="Canada">Canada</SelectItem>
                                                    <SelectItem value="Australia">Australia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Default country pre-selected for new students</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Currency per Country</label>
                                            <Select 
                                                value={serviceCountrySettings.default_currency_per_country || 'USD'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, default_currency_per_country: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Currency used for pricing in selected country</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Visa Type per Country</label>
                                            <Select 
                                                value={serviceCountrySettings.default_visa_type_per_country || 'F-1 Student Visa'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, default_visa_type_per_country: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="F-1 Student Visa">F-1 Student Visa (USA)</SelectItem>
                                                    <SelectItem value="Tier 4 Student Visa">Tier 4 Student Visa (UK)</SelectItem>
                                                    <SelectItem value="Study Permit">Study Permit (Canada)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Most common visa type for students</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Intake Mapping</label>
                                            <Select 
                                                value={serviceCountrySettings.default_intake_mapping || 'Fall'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, default_intake_mapping: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="Fall">Fall - September</SelectItem>
                                                    <SelectItem value="Winter">Winter - January</SelectItem>
                                                    <SelectItem value="Spring">Spring - May</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Primary intake period for universities</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Risk Category per Country</label>
                                            <Select 
                                                value={serviceCountrySettings.risk_category_per_country || 'Medium Risk'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, risk_category_per_country: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="Low Risk">Low Risk</SelectItem>
                                                    <SelectItem value="Medium Risk">Medium Risk</SelectItem>
                                                    <SelectItem value="High Risk">High Risk</SelectItem>
                                                    <SelectItem value="Very High Risk">Very High Risk</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Default risk level for visa applications</p>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                        <div>
                                            <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Auto Escalation Required for High Risk Countries</h3>
                                            <p className="text-sm text-gray-500">Automatically escalate cases from high risk countries for review</p>
                                        </div>
                                        <Switch 
                                            checked={serviceCountrySettings.auto_escalation_high_risk}
                                            onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, auto_escalation_high_risk: val }))}
                                        />
                                    </div>
                                </div>

                                {/* University Defaults */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">University Defaults</h2>
                                        <p className="text-gray-500 text-[16px]">Configure default university settings and ranking behavior</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default University Status</label>
                                            <Select 
                                                value={serviceCountrySettings.default_university_status || 'Active'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, default_university_status: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                    <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Status applied to newly added universities</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Ranking Source Type</label>
                                            <Select 
                                                value={serviceCountrySettings.ranking_source_type || 'QS World University Rankings'}
                                                onValueChange={(val) => setServiceCountrySettings(prev => ({ ...prev, ranking_source_type: val }))}
                                            >
                                                <SelectTrigger className="h-[58px] rounded-2xl border-gray-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-gray-100 shadow-2xl">
                                                    <SelectItem value="QS World University Rankings">QS World University Rankings</SelectItem>
                                                    <SelectItem value="Times Higher Education">Times Higher Education</SelectItem>
                                                    <SelectItem value="ARWU">ARWU (Shanghai Ranking)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-[12px] text-gray-500 ml-1">Primary source for university rankings</p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Comparison Weight</label>
                                            <Input 
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={serviceCountrySettings.default_comparison_weight || 50}
                                                onChange={(e) => setServiceCountrySettings(prev => ({ ...prev, default_comparison_weight: parseInt(e.target.value) }))}
                                                className="h-[58px] rounded-2xl border-gray-200"
                                            />
                                            <p className="text-[12px] text-gray-500 ml-1">Weight used in comparison algorithms (0-100)</p>
                                        </div>
                                    </div>

                                    <div className="mt-12 space-y-6">
                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Auto-Approve Listed Universities</h3>
                                                <p className="text-sm text-gray-500">Automatically approve universities from recognized ranking sources</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.auto_approve_listed_universities}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, auto_approve_listed_universities: val }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Allow Manual Ranking Override</h3>
                                                <p className="text-sm text-gray-500">Enable counsellors to manually override automatic rankings</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.allow_manual_ranking_override}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, allow_manual_ranking_override: val }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Operational Defaults */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Operational Defaults</h2>
                                        <p className="text-gray-500 text-[16px]">Configure operational rules and automation settings</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Default Application Deadline Buffer (Days)</label>
                                            <Input 
                                                type="number"
                                                value={serviceCountrySettings.default_app_deadline_buffer || 30}
                                                onChange={(e) => setServiceCountrySettings(prev => ({ ...prev, default_app_deadline_buffer: parseInt(e.target.value) }))}
                                                className="h-[58px] rounded-2xl border-gray-200"
                                            />
                                            <p className="text-[12px] text-gray-500 ml-1">Days before deadline to stop accepting applications</p>
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Auto-Assign Counsellor on Service Activation</h3>
                                                <p className="text-sm text-gray-500">Automatically assign a counsellor when a student activates a service</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.auto_assign_counselor_on_activation}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, auto_assign_counselor_on_activation: val }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Require Document Before Service Activation</h3>
                                                <p className="text-sm text-gray-500">Students must upload required documents before activating services</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.require_doc_before_service_activation}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, require_doc_before_service_activation: val }))}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Allow Multi-Service Parallel Processing</h3>
                                                <p className="text-sm text-gray-500">Enable students to activate and process multiple services simultaneously</p>
                                            </div>
                                            <Switch 
                                                checked={serviceCountrySettings.allow_multi_service_parallel}
                                                onCheckedChange={(val) => setServiceCountrySettings(prev => ({ ...prev, allow_multi_service_parallel: val }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'comparison_rules' && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Country Scoring Logic */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Country Scoring Logic</h2>
                                        <p className="text-gray-500 text-[16px]">Configure how countries are evaluated and scored for recommendations</p>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Enable Country Scoring</h3>
                                                <p className="text-sm text-gray-500">Activate automatic country scoring based on defined parameters</p>
                                            </div>
                                            <Switch 
                                                checked={comparisonRules.enable_country_scoring}
                                                onCheckedChange={(val) => setComparisonRules(prev => ({ ...prev, enable_country_scoring: val }))}
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Scoring Parameters</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {['Tuition Cost', 'Visa Success Rate', 'PR Probability', 'Living Cost', 'Employment Opportunity', 'Risk Index'].map((param) => (
                                                    <div key={param} className="flex items-center gap-3 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all">
                                                        <Checkbox 
                                                            id={`param-${param}`}
                                                            checked={comparisonRules.country_scoring_parameters.includes(param)}
                                                            onCheckedChange={(checked) => {
                                                                const current = comparisonRules.country_scoring_parameters;
                                                                const updated = checked 
                                                                    ? [...current, param]
                                                                    : current.filter(p => p !== param);
                                                                setComparisonRules(prev => ({ ...prev, country_scoring_parameters: updated }));
                                                            }}
                                                        />
                                                        <label htmlFor={`param-${param}`} className="text-[15px] font-semibold text-[#1a1438] cursor-pointer">
                                                            {param}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-10 pt-4">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Weight Distribution</label>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
                                                    <span className="text-xs font-bold uppercase tracking-widest">Total:</span>
                                                    <span className="text-[15px] font-black">{Object.values(comparisonRules.country_weight_distribution).reduce((a, b) => a + b, 0)}%</span>
                                                </div>
                                            </div>
                                            <div className="grid gap-8">
                                                {Object.entries(comparisonRules.country_weight_distribution).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-10 group">
                                                        <span className="text-[15px] font-bold text-[#475569] w-48 transition-colors group-hover:text-purple-600">{key}</span>
                                                        <div className="flex-1">
                                                            <Slider 
                                                                value={[value]} 
                                                                max={100} 
                                                                step={1}
                                                                onValueChange={([val]) => setComparisonRules(prev => ({
                                                                    ...prev,
                                                                    country_weight_distribution: { ...prev.country_weight_distribution, [key]: val }
                                                                }))}
                                                            />
                                                        </div>
                                                        <div className="w-20 relative">
                                                            <Input 
                                                                type="number" 
                                                                value={value} 
                                                                onChange={(e) => {
                                                                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                                                    setComparisonRules(prev => ({
                                                                        ...prev,
                                                                        country_weight_distribution: { ...prev.country_weight_distribution, [key]: val }
                                                                    }));
                                                                }}
                                                                className="h-11 rounded-xl text-center pr-6 font-bold"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Allow Manual Score Override</h3>
                                                <p className="text-sm text-gray-500">Enable counsellors to manually adjust country scores</p>
                                            </div>
                                            <Switch 
                                                checked={comparisonRules.allow_manual_score_override}
                                                onCheckedChange={(val) => setComparisonRules(prev => ({ ...prev, allow_manual_score_override: val }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* University Ranking Logic */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">University Ranking Logic</h2>
                                        <p className="text-gray-500 text-[16px]">Define parameters and weights for university ranking calculations</p>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Enable University Ranking Engine</h3>
                                                <p className="text-sm text-gray-500">Activate automatic university ranking based on defined criteria</p>
                                            </div>
                                            <Switch 
                                                checked={comparisonRules.enable_university_ranking_engine}
                                                onCheckedChange={(val) => setComparisonRules(prev => ({ ...prev, enable_university_ranking_engine: val }))}
                                            />
                                        </div>

                                        <div className="space-y-10 pb-4">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-[13px] font-bold text-[#64748b] ml-1 uppercase tracking-wider">Ranking Parameters - Weight Configuration</label>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
                                                    <span className="text-xs font-bold uppercase tracking-widest">Total:</span>
                                                    <span className="text-[15px] font-black">{Object.values(comparisonRules.university_weight_configuration).reduce((a, b) => a + b, 0)}%</span>
                                                </div>
                                            </div>
                                            <div className="grid gap-8">
                                                {Object.entries(comparisonRules.university_weight_configuration).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-10 group">
                                                        <span className="text-[15px] font-bold text-[#475569] w-48 transition-colors group-hover:text-purple-600">{key}</span>
                                                        <div className="flex-1">
                                                            <Slider 
                                                                value={[value]} 
                                                                max={100} 
                                                                step={1}
                                                                onValueChange={([val]) => setComparisonRules(prev => ({
                                                                    ...prev,
                                                                    university_weight_configuration: { ...prev.university_weight_configuration, [key]: val }
                                                                }))}
                                                            />
                                                        </div>
                                                        <div className="w-20 relative">
                                                            <Input 
                                                                type="number" 
                                                                value={value} 
                                                                onChange={(e) => {
                                                                    const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                                                    setComparisonRules(prev => ({
                                                                        ...prev,
                                                                        university_weight_configuration: { ...prev.university_weight_configuration, [key]: val }
                                                                    }));
                                                                }}
                                                                className="h-11 rounded-xl text-center pr-6 font-bold"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-8 bg-gray-50/50 rounded-3xl border border-gray-100 group">
                                            <div>
                                                <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">Minimum Eligibility Threshold Required</h3>
                                                <p className="text-sm text-gray-500">Only rank universities where student meets minimum eligibility criteria</p>
                                            </div>
                                            <Switch 
                                                checked={comparisonRules.min_eligibility_threshold_required}
                                                onCheckedChange={(val) => setComparisonRules(prev => ({ ...prev, min_eligibility_threshold_required: val }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Matching Engine Rules */}
                                <div className="bg-white rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 p-10 md:p-14">
                                    <div className="mb-12">
                                        <h2 className="text-[26px] font-bold text-[#0f172b] mb-2">Matching Engine Rules</h2>
                                        <p className="text-gray-500 text-[16px]">Configure automatic matching and recommendation behavior</p>
                                    </div>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'enable_smart_matching', title: 'Enable Smart Matching', desc: 'Activate AI-powered student-university matching algorithm' },
                                            { id: 'auto_suggest_top_5_countries', title: 'Auto-Suggest Top 5 Countries', desc: 'Automatically recommend top 5 countries based on student profile' },
                                            { id: 'auto_suggest_top_10_universities', title: 'Auto-Suggest Top 10 Universities', desc: 'Automatically recommend top 10 universities based on scoring' },
                                            { id: 'exclude_high_risk_options', title: 'Exclude High-Risk Options', desc: 'Automatically filter out high-risk countries and universities from recommendations' },
                                            { id: 'allow_counselor_override_matching', title: 'Allow Counsellor Override', desc: 'Enable counsellors to manually override automated recommendations' }
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-8 bg-gray-50/50 hover:bg-white hover:shadow-md rounded-3xl border border-gray-100 group transition-all">
                                                <div>
                                                    <h3 className="text-[17px] font-bold text-[#0f172b] mb-1">{item.title}</h3>
                                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                                </div>
                                                <Switch 
                                                    checked={(comparisonRules as any)[item.id]}
                                                    onCheckedChange={(val) => setComparisonRules(prev => ({ ...prev, [item.id]: val }))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'notifications' && (
                            <NotificationAlertSettings 
                                settings={adminNotificationSettings}
                                setSettings={setAdminNotificationSettings}
                                onSave={handleSaveSystem}
                                isSaving={isSaving}
                            />
                        )}
                    </>
                )}
            </div>
        );
        
        return null; // Fallback to satisfy typing and prevent undefined renders
    };

    return (
        <div className="w-full py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header - Only show in grid view */}
                {view === 'grid' && (
                    <div className="mb-12 px-4">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#1a1438] to-[#0f172b] rounded-[22px] flex items-center justify-center shadow-2xl shadow-purple-950/20 border border-white/5">
                                <SettingsIcon size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-[40px] font-bold text-[#0f172b] leading-none mb-1">Settings</h1>
                                <p className="text-[17px] text-gray-500">Configure and manage all system settings</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>

                <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="px-8 pt-8 pb-4">
                            <DialogTitle className="text-2xl font-bold text-[#0f172b]">Add New User</DialogTitle>
                            <p className="text-gray-500 text-sm">Create a new platform user and assign them a role.</p>
                        </DialogHeader>
                        
                        <div className="px-8 py-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</Label>
                                    <Input 
                                        placeholder="John"
                                        value={newUser.first_name}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                                        className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</Label>
                                    <Input 
                                        placeholder="Doe"
                                        value={newUser.last_name}
                                        onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                                        className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</Label>
                                <Input 
                                    type="email"
                                    placeholder="john@example.com"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                                    className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Role</Label>
                                <Select 
                                    onValueChange={(val) => setNewUser(prev => ({ ...prev, role_id: val }))}
                                    value={newUser.role_id}
                                >
                                    <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Password</Label>
                                <Input 
                                    type="password"
                                    placeholder="Set a password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                                    className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                />
                                <p className="text-[11px] text-gray-400 ml-1">Default is 'password123' if left blank.</p>
                            </div>
                        </div>

                        <DialogFooter className="bg-gray-50 px-8 py-6 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="h-12 px-6 rounded-xl font-bold border-gray-200 text-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateUser}
                                disabled={isSubmittingUser}
                                className="h-12 px-8 rounded-xl font-bold bg-[#0a061d] hover:bg-[#1a1438] text-white flex items-center gap-2 shadow-lg shadow-purple-900/10"
                            >
                                {isSubmittingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={18} />}
                                Create User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditUserModalOpen} onOpenChange={setIsEditUserModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="px-8 pt-8 pb-4">
                            <DialogTitle className="text-2xl font-bold text-[#0f172b]">Edit User</DialogTitle>
                            <p className="text-gray-500 text-sm">Update platform user details and role.</p>
                        </DialogHeader>
                        
                        {editingUser && (
                            <div className="px-8 py-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</Label>
                                        <Input 
                                            placeholder="John"
                                            value={editingUser.first_name}
                                            onChange={(e) => setEditingUser((prev: any) => ({ ...prev, first_name: e.target.value }))}
                                            className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</Label>
                                        <Input 
                                            placeholder="Doe"
                                            value={editingUser.last_name}
                                            onChange={(e) => setEditingUser((prev: any) => ({ ...prev, last_name: e.target.value }))}
                                            className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</Label>
                                    <Input 
                                        type="email"
                                        placeholder="john@example.com"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser((prev: any) => ({ ...prev, email: e.target.value }))}
                                        className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Role</Label>
                                    <Select 
                                        onValueChange={(val) => setEditingUser((prev: any) => ({ ...prev, role_id: val }))}
                                        value={editingUser.role_id}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                            {roles.map(role => (
                                                <SelectItem key={role.id} value={role.id} className="cursor-pointer">
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Status</Label>
                                    <Select 
                                        onValueChange={(val) => setEditingUser((prev: any) => ({ ...prev, status: val }))}
                                        value={editingUser.status}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                            <SelectItem value="Active" className="cursor-pointer">Active</SelectItem>
                                            <SelectItem value="Inactive" className="cursor-pointer">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="bg-gray-50 px-8 py-6 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditUserModalOpen(false)}
                                className="h-12 px-6 rounded-xl font-bold border-gray-200 text-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleUpdateUser}
                                disabled={isUpdatingUser}
                                className="h-12 px-8 rounded-xl font-bold bg-[#6929c4] hover:bg-[#5a21a8] text-white flex items-center gap-2 shadow-lg shadow-purple-900/10"
                            >
                                {isUpdatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isAddRoleModalOpen} onOpenChange={setIsAddRoleModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="px-8 pt-8 pb-4">
                            <DialogTitle className="text-2xl font-bold text-[#0f172b]">Add New Role</DialogTitle>
                            <p className="text-gray-500 text-sm">Create a new system role and define its scope.</p>
                        </DialogHeader>
                        
                        <div className="px-8 py-6 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Role Name</Label>
                                <Input 
                                    placeholder="e.g. Finance Manager"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                                    className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</Label>
                                <textarea 
                                    placeholder="Describe the responsibilities of this role..."
                                    value={newRole.description}
                                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        <DialogFooter className="bg-gray-50 px-8 py-6 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsAddRoleModalOpen(false)}
                                className="h-12 px-6 rounded-xl font-bold border-gray-200 text-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateRole}
                                disabled={isSubmittingRole}
                                className="h-12 px-8 rounded-xl font-bold bg-[#0a061d] hover:bg-[#1a1438] text-white flex items-center gap-2 shadow-lg shadow-purple-900/10"
                            >
                                {isSubmittingRole ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={18} />}
                                Create Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditRoleModalOpen} onOpenChange={setIsEditRoleModalOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="px-8 pt-8 pb-4">
                            <DialogTitle className="text-2xl font-bold text-[#0f172b]">Edit Role</DialogTitle>
                            <p className="text-gray-500 text-sm">Update role name and description.</p>
                        </DialogHeader>
                        
                        {editingRole && (
                            <div className="px-8 py-6 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Role Name</Label>
                                    <Input 
                                        placeholder="e.g. Finance Manager"
                                        value={editingRole.name}
                                        onChange={(e) => setEditingRole((prev: any) => ({ ...prev, name: e.target.value }))}
                                        className="h-12 rounded-xl border-gray-200 focus:border-purple-200 focus:ring-purple-50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</Label>
                                    <textarea 
                                        placeholder="Describe the responsibilities of this role..."
                                        value={editingRole.description}
                                        onChange={(e) => setEditingRole((prev: any) => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-200 focus:ring-4 focus:ring-purple-50 outline-none transition-all resize-none text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter className="bg-gray-50 px-8 py-6 gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsEditRoleModalOpen(false)}
                                className="h-12 px-6 rounded-xl font-bold border-gray-200 text-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleUpdateRole}
                                disabled={isSubmittingRole}
                                className="h-12 px-8 rounded-xl font-bold bg-[#6929c4] hover:bg-[#5a21a8] text-white flex items-center gap-2 shadow-lg shadow-purple-900/10"
                            >
                                {isSubmittingRole ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
