'use client';

import React from 'react';
import { 
    DollarSign, 
    CreditCard, 
    FileText, 
    RefreshCcw, 
    ArrowRightLeft, 
    ShieldCheck, 
    Percent, 
    Clock, 
    Trash2, 
    Globe, 
    Calendar,
    Briefcase,
    PieChart,
    BarChart3,
    CheckCircle2
} from 'lucide-react';
import { FinanceSettings } from '../../services/financeSettingsService';

interface Props {
    settings: FinanceSettings;
    setSettings: React.Dispatch<React.SetStateAction<FinanceSettings>>;
    onSave?: () => void;
    isSaving?: boolean;
    readOnly?: boolean;
}

const FinancePaymentSettings: React.FC<Props> = ({ settings, setSettings, onSave, isSaving, readOnly = false }) => {
    const canEdit = !readOnly;

    const handleToggle = (field: keyof FinanceSettings) => {
        if (!canEdit) return;
        setSettings((prev: any) => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleInputChange = (field: keyof FinanceSettings, value: any) => {
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

    const InputField = ({ label, sublabel, value, onChange, type = "text", placeholder = "", prefix = "" }: { label: string, sublabel?: string, value: any, onChange: (val: any) => void, type?: string, placeholder?: string, prefix?: string }) => (
        <div className="flex flex-col gap-2 py-4">
            <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#334155]">{label}</span>
                {sublabel && <span className="text-[12px] text-slate-400 font-medium mb-2">{sublabel}</span>}
            </div>
            <div className="relative">
                {prefix && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        {prefix}
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                    placeholder={placeholder}
                    disabled={!canEdit}
                    className={`w-full h-[52px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 ${prefix ? 'pl-10' : ''} text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                />
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
                    <Clock size={16} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1250px] mx-auto pb-20 pt-4">
            
            <div className="space-y-8">
                {/* 1. Currency & Financial Defaults */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Currency & Financial Defaults" 
                        description="Configure currency settings and exchange rate management" 
                        icon={DollarSign}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <SelectField 
                            label="Primary Currency" 
                            value={settings.primary_currency} 
                            options={['USD - US Dollar', 'EUR - Euro', 'GBP - Pound Sterling', 'INR - Indian Rupee']} 
                            onChange={(val) => handleInputChange('primary_currency', val)} 
                        />
                        <SelectField 
                            label="Secondary Currency" 
                            value={settings.secondary_currency} 
                            options={['EUR - Euro', 'USD - US Dollar', 'CAD - Canadian Dollar']} 
                            onChange={(val) => handleInputChange('secondary_currency', val)} 
                        />
                        <SelectField 
                            label="Exchange Rate Provider" 
                            value={settings.exchange_rate_provider} 
                            options={['Open Exchange Rates', 'Fixer.io', 'OANDA']} 
                            onChange={(val) => handleInputChange('exchange_rate_provider', val)} 
                        />
                        <SelectField 
                            label="Exchange Rate Update Frequency" 
                            value={settings.exchange_rate_frequency} 
                            options={['Daily', 'Every 12 Hours', 'Hourly']} 
                            onChange={(val) => handleInputChange('exchange_rate_frequency', val)} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-4 items-end">
                        <ToggleRow 
                            label="Auto-Update Exchange Rates" 
                            sublabel="Automatically fetch latest rates" 
                            enabled={settings.auto_update_exchange_rates} 
                            onToggle={() => handleToggle('auto_update_exchange_rates')} 
                        />
                        <ToggleRow 
                            label="Enable Multi-Currency" 
                            sublabel="Accept payments in multiple currencies" 
                            enabled={settings.enable_multi_currency} 
                            onToggle={() => handleToggle('enable_multi_currency')} 
                        />
                    </div>
                </div>

                {/* 2. Payment Methods */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Payment Methods" 
                        description="Configure accepted payment methods and gateways" 
                        icon={CreditCard}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Credit Card" 
                            sublabel="Accept credit card payments" 
                            enabled={settings.enable_credit_card} 
                            onToggle={() => handleToggle('enable_credit_card')} 
                        />
                        <ToggleRow 
                            label="Debit Card" 
                            sublabel="Accept debit card payments" 
                            enabled={settings.enable_debit_card} 
                            onToggle={() => handleToggle('enable_debit_card')} 
                        />
                        <ToggleRow 
                            label="Bank Transfer" 
                            sublabel="Accept direct bank transfers" 
                            enabled={settings.enable_bank_transfer} 
                            onToggle={() => handleToggle('enable_bank_transfer')} 
                        />
                        <ToggleRow 
                            label="PayPal" 
                            sublabel="Accept PayPal payments" 
                            enabled={settings.enable_paypal} 
                            onToggle={() => handleToggle('enable_paypal')} 
                        />
                        <ToggleRow 
                            label="Stripe" 
                            sublabel="Process via Stripe gateway" 
                            enabled={settings.enable_stripe} 
                            onToggle={() => handleToggle('enable_stripe')} 
                        />
                        <ToggleRow 
                            label="Apple Pay" 
                            sublabel="Accept Apple Pay" 
                            enabled={settings.enable_apple_pay} 
                            onToggle={() => handleToggle('enable_apple_pay')} 
                        />
                        <ToggleRow 
                            label="Google Pay" 
                            sublabel="Accept Google Pay" 
                            enabled={settings.enable_google_pay} 
                            onToggle={() => handleToggle('enable_google_pay')} 
                        />
                    </div>
                    
                    <div className="max-w-md mt-6">
                        <SelectField 
                            label="Default Payment Gateway" 
                            value={settings.default_payment_gateway} 
                            options={['Stripe', 'PayPal', 'Braintree', 'Adyen']} 
                            onChange={(val) => handleInputChange('default_payment_gateway', val)} 
                        />
                    </div>
                </div>

                {/* 3. Invoice & Billing Rules */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Invoice & Billing Rules" 
                        description="Configure invoice generation and billing settings" 
                        icon={FileText}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <InputField 
                            label="Invoice Prefix" 
                            value={settings.invoice_prefix} 
                            onChange={(val) => handleInputChange('invoice_prefix', val)} 
                            placeholder="INV"
                        />
                        <SelectField 
                            label="Invoice Number Format" 
                            value={settings.invoice_number_format} 
                            options={['Sequential (INV-0001, INV-0002)', 'Date-based (2024-0001)', 'Randomized']} 
                            onChange={(val) => handleInputChange('invoice_number_format', val)} 
                        />
                        <InputField 
                            label="Starting Invoice Number" 
                            value={settings.starting_invoice_number} 
                            onChange={(val) => handleInputChange('starting_invoice_number', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="Invoice Due Period (days)" 
                            value={settings.invoice_due_period_days} 
                            onChange={(val) => handleInputChange('invoice_due_period_days', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="Late Payment Fee (%)" 
                            value={settings.late_payment_fee_percent} 
                            onChange={(val) => handleInputChange('late_payment_fee_percent', val)} 
                            type="number" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6 items-end">
                        <ToggleRow 
                            label="Enable Auto-Invoicing" 
                            sublabel="Generate invoices automatically" 
                            enabled={settings.enable_auto_invoicing} 
                            onToggle={() => handleToggle('enable_auto_invoicing')} 
                        />
                        <ToggleRow 
                            label="Enable Late Payment Fees" 
                            sublabel="Charge fees for late payments" 
                            enabled={settings.enable_late_payment_fees} 
                            onToggle={() => handleToggle('enable_late_payment_fees')} 
                        />
                    </div>

                    <div className="mt-8 flex flex-col gap-2">
                        <span className="text-[14px] font-bold text-[#334155]">Invoice Footer Text</span>
                        <textarea 
                            value={settings.invoice_footer_text}
                            onChange={(e) => handleInputChange('invoice_footer_text', e.target.value)}
                            disabled={!canEdit}
                            className="w-full min-h-[120px] bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 text-[14px] font-medium text-[#0f172b] focus:outline-none focus:border-[#6929c4] transition-all no-scrollbar disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="Thank you for your business"
                        />
                    </div>
                </div>

                {/* 4. Refund Rules */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
                    <SectionHeader 
                        title="Refund Rules" 
                        description="Configure refund policies and processing rules" 
                        icon={RefreshCcw}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        <ToggleRow 
                            label="Enable Refunds" 
                            sublabel="Allow refund processing" 
                            enabled={settings.enable_refunds} 
                            onToggle={() => handleToggle('enable_refunds')} 
                        />
                        <ToggleRow 
                            label="Refund Approval Required" 
                            sublabel="Manager must approve refunds" 
                            enabled={settings.refund_approval_required} 
                            onToggle={() => handleToggle('refund_approval_required')} 
                        />
                        <ToggleRow 
                            label="Allow Partial Refunds" 
                            sublabel="Enable partial amount refunds" 
                            enabled={settings.allow_partial_refunds} 
                            onToggle={() => handleToggle('allow_partial_refunds')} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 mt-6">
                        <InputField 
                            label="Refund Window (days)" 
                            sublabel="Days after purchase to allow refunds"
                            value={settings.refund_window_days} 
                            onChange={(val) => handleInputChange('refund_window_days', val)} 
                            type="number" 
                        />
                        <InputField 
                            label="Auto-Refund Under Amount ($)" 
                            sublabel="Auto approve refunds under this amount"
                            value={settings.auto_refund_under_amount} 
                            onChange={(val) => handleInputChange('auto_refund_under_amount', val)} 
                            type="number" 
                            prefix="$"
                        />
                        <InputField 
                            label="Refund Processing Time (days)" 
                            sublabel="Business days to process refunds"
                            value={settings.refund_processing_time_days} 
                            onChange={(val) => handleInputChange('refund_processing_time_days', val)} 
                            type="number" 
                        />
                    </div>
                </div>

                {/* 5. Financial Controls */}
                <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] mb-10">
                    <SectionHeader 
                        title="Financial Controls" 
                        description="Configure approval workflows and financial reporting" 
                        icon={ShieldCheck}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <InputField 
                            label="Require Approval Over Amount ($)" 
                            sublabel="Payments over this amount need approval"
                            value={settings.require_approval_over_amount} 
                            onChange={(val) => handleInputChange('require_approval_over_amount', val)} 
                            type="number" 
                            prefix="$"
                        />
                        <SelectField 
                            label="Fiscal Year Start Month" 
                            value={settings.fiscal_year_start_month} 
                            options={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} 
                            onChange={(val) => handleInputChange('fiscal_year_start_month', val)} 
                        />
                        <div className="max-w-[200px]">
                            <InputField 
                                label="Default Tax Rate (%)" 
                                value={settings.default_tax_rate} 
                                onChange={(val) => handleInputChange('default_tax_rate', val)} 
                                type="number" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-8">
                        <ToggleRow 
                            label="Enable Budget Tracking" 
                            sublabel="Track budgets and spending" 
                            enabled={settings.enable_budget_tracking} 
                            onToggle={() => handleToggle('enable_budget_tracking')} 
                        />
                        <ToggleRow 
                            label="Enable Expense Reporting" 
                            sublabel="Track and report expenses" 
                            enabled={settings.enable_expense_reporting} 
                            onToggle={() => handleToggle('enable_expense_reporting')} 
                        />
                        <ToggleRow 
                            label="Enable Tax Calculation" 
                            sublabel="Automatically calculate taxes" 
                            enabled={settings.enable_tax_calculation} 
                            onToggle={() => handleToggle('enable_tax_calculation')} 
                        />
                        <ToggleRow 
                            label="Enable Financial Reporting" 
                            sublabel="Generate financial reports" 
                            enabled={settings.enable_financial_reporting} 
                            onToggle={() => handleToggle('enable_financial_reporting')} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancePaymentSettings;
