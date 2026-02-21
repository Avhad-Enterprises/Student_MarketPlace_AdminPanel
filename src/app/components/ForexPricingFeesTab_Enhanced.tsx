/**
 * FOREX PRICING & FEES TAB - MINIMAL BUT POWERFUL CONTROL SYSTEM
 * 
 * Features:
 * 1. Pricing Model selector with confirmation modal
 * 2. Fee Configuration with CRUD operations
 * 3. Fee Execution Order (drag-reorder)
 * 4. Discounts & Promotions with CRUD
 * 5. Live Student Cost Preview Calculator with scenarios
 * 6. Proper 3-dot menu overlay (no clipping)
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Eye,
  GripVertical,
  Save,
  DollarSign,
  Percent,
  TrendingUp,
  Calendar,
  Tag,
  ArrowRightLeft,
  Calculator,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import type { ForexProviderData } from './ForexProviderDetail';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Label } from './ui/label';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TabProps {
  providerId: string;
  providerData: ForexProviderData;
  setProviderData: React.Dispatch<React.SetStateAction<ForexProviderData>>;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

// ============================================
// TYPE DEFINITIONS
// ============================================

type PricingModel = 'Fixed' | 'Percentage' | 'Spread' | 'Dynamic';

interface Fee {
  id: string;
  name: string;
  type: 'Fixed' | 'Percentage';
  amount: number;
  currency?: string;
  paidBy: 'Student' | 'Partner' | 'Split';
  appliesTo: 'Transfer' | 'Exchange' | 'Instant' | 'Forex Card';
  refundable: boolean;
  enabled: boolean;
  order: number;
}

interface Discount {
  id: string;
  name: string;
  type: 'Fixed' | 'Percentage';
  value: number;
  validFrom: string;
  validTo: string;
  conditionType: 'All' | 'First Transfer' | 'Min Amount' | 'Country';
  minAmount?: number;
  countries?: string[];
  stackable: boolean;
  active: boolean;
}

interface Scenario {
  id: string;
  name: string;
  timestamp: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  country: string;
  transferType: 'Normal' | 'Instant';
  breakdown: any;
}

const CURRENCIES = ['USD', 'GBP', 'EUR', 'INR', 'CAD', 'AUD', 'SGD', 'JPY', 'CNY'];
const COUNTRIES = ['United States', 'United Kingdom', 'India', 'Canada', 'Australia', 'Singapore', 'Japan', 'China'];

// ============================================
// DRAGGABLE FEE ORDER ITEM
// ============================================

interface DraggableFeeOrderItemProps {
  fee: Fee;
  index: number;
  moveFee: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableFeeOrderItem: React.FC<DraggableFeeOrderItemProps> = ({ fee, index, moveFee }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FEE_ORDER',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'FEE_ORDER',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveFee(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move ${isDragging ? 'opacity-50' : ''
        }`}
    >
      <GripVertical size={16} className="text-gray-400" />
      <span className="text-sm font-semibold text-gray-900">{fee.name}</span>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export const ForexPricingFeesTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [pricingModel, setPricingModel] = useState<PricingModel>('Percentage');
  const [pendingPricingModel, setPendingPricingModel] = useState<PricingModel | null>(null);

  const [fees, setFees] = useState<Fee[]>([
    {
      id: 'fee-1',
      name: 'FX Margin',
      type: 'Percentage',
      amount: 0.35,
      paidBy: 'Student',
      appliesTo: 'Exchange',
      refundable: false,
      enabled: true,
      order: 1,
    },
    {
      id: 'fee-2',
      name: 'Transfer Fee',
      type: 'Percentage',
      amount: 0.65,
      paidBy: 'Student',
      appliesTo: 'Transfer',
      refundable: false,
      enabled: true,
      order: 2,
    },
    {
      id: 'fee-3',
      name: 'Instant Transfer Surcharge',
      type: 'Percentage',
      amount: 1.5,
      paidBy: 'Student',
      appliesTo: 'Instant',
      refundable: false,
      enabled: true,
      order: 3,
    },
  ]);

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: 'disc-1',
      name: 'First Transfer Discount',
      type: 'Percentage',
      value: 50,
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      conditionType: 'First Transfer',
      stackable: false,
      active: true,
    },
  ]);

  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  // Calculator State
  const [calculator, setCalculator] = useState({
    fromCurrency: 'USD',
    toCurrency: 'INR',
    amount: 1000,
    country: 'India',
    transferType: 'Normal' as 'Normal' | 'Instant',
  });

  // Modal States
  const [showPricingModelModal, setShowPricingModelModal] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [viewingFee, setViewingFee] = useState<Fee | null>(null);

  // Form States
  const [feeForm, setFeeForm] = useState<Partial<Fee>>({
    type: 'Percentage',
    paidBy: 'Student',
    appliesTo: 'Transfer',
    refundable: false,
    enabled: true,
  });

  const [discountForm, setDiscountForm] = useState<Partial<Discount>>({
    type: 'Percentage',
    conditionType: 'All',
    stackable: false,
    active: true,
  });

  // ============================================
  // HANDLERS - PRICING MODEL
  // ============================================

  const handleSelectPricingModel = (model: PricingModel) => {
    if (model === pricingModel) return;
    setPendingPricingModel(model);
    setShowPricingModelModal(true);
  };

  const confirmPricingModelChange = () => {
    if (!pendingPricingModel) return;
    setPricingModel(pendingPricingModel);
    addActivityLog({
      actor: 'Current Admin',
      actorType: 'Admin',
      action: 'Updated',
      entity: 'Pricing Model',
      entityId: providerId,
      severity: 'Info',
      summary: `Pricing model changed to ${pendingPricingModel}`,
      fullDescription: `Changed pricing model from ${pricingModel} to ${pendingPricingModel}`,
      timestampDisplay: new Date().toLocaleString(),
      source: 'Admin Action',
      triggerType: 'Manual',
    });
    toast.success(`Pricing model changed to ${pendingPricingModel}`);
    setShowPricingModelModal(false);
    setPendingPricingModel(null);
  };

  // ============================================
  // HANDLERS - FEES
  // ============================================

  const openAddFeeModal = () => {
    setEditingFee(null);
    setFeeForm({
      type: 'Percentage',
      paidBy: 'Student',
      appliesTo: 'Transfer',
      refundable: false,
      enabled: true,
    });
    setShowFeeModal(true);
  };

  const openEditFeeModal = (fee: Fee) => {
    setEditingFee(fee);
    setFeeForm({ ...fee });
    setShowFeeModal(true);
  };

  const handleSaveFee = () => {
    // Validation
    if (!feeForm.name || feeForm.amount === undefined) {
      toast.error('Fee name and amount are required');
      return;
    }

    if (feeForm.type === 'Percentage' && (feeForm.amount < 0 || feeForm.amount > 100)) {
      toast.error('Percentage must be between 0 and 100');
      return;
    }

    if (feeForm.type === 'Fixed' && !feeForm.currency) {
      toast.error('Currency is required for fixed fees');
      return;
    }

    if (editingFee) {
      // Update
      setFees(fees.map((f) => (f.id === editingFee.id ? { ...f, ...feeForm } : f)));
      toast.success('Fee updated successfully');
      addActivityLog({
        actor: 'Current Admin',
        actorType: 'Admin',
        action: 'Updated',
        entity: 'Fee',
        entityId: editingFee.id,
        severity: 'Info',
        summary: `Updated fee: ${feeForm.name}`,
        fullDescription: `Updated fee: ${feeForm.name} with amount ${feeForm.amount}${feeForm.type === 'Percentage' ? '%' : feeForm.currency}`,
        timestampDisplay: new Date().toLocaleString(),
        source: 'Admin Action',
        triggerType: 'Manual',
      });
    } else {
      // Create
      const newFee: Fee = {
        id: `fee-${Date.now()}`,
        ...feeForm,
        order: fees.length + 1,
      } as Fee;
      setFees([...fees, newFee]);
      toast.success('Fee added successfully');
      addActivityLog({
        actor: 'Current Admin',
        actorType: 'Admin',
        action: 'Created',
        entity: 'Fee',
        entityId: newFee.id,
        severity: 'Info',
        summary: `Added new fee: ${feeForm.name}`,
        fullDescription: `Added new fee: ${feeForm.name} with amount ${feeForm.amount}${feeForm.type === 'Percentage' ? '%' : feeForm.currency}`,
        timestampDisplay: new Date().toLocaleString(),
        source: 'Admin Action',
        triggerType: 'Manual',
      });
    }

    setShowFeeModal(false);
  };

  const handleDuplicateFee = (fee: Fee) => {
    const duplicated: Fee = {
      ...fee,
      id: `fee-${Date.now()}`,
      name: `${fee.name} (Copy)`,
      order: fees.length + 1,
    };
    setFees([...fees, duplicated]);
    toast.success('Fee duplicated successfully');
  };

  const handleDeleteFee = (feeId: string) => {
    setFees(fees.filter((f) => f.id !== feeId));
    toast.success('Fee deleted successfully');
    addActivityLog({
      actor: 'Current Admin',
      actorType: 'Admin',
      action: 'Deleted',
      entity: 'Fee',
      entityId: feeId,
      severity: 'Info',
      summary: 'Deleted fee',
      fullDescription: `Deleted fee with ID: ${feeId}`,
      timestampDisplay: new Date().toLocaleString(),
      source: 'Admin Action',
      triggerType: 'Manual',
    });
  };

  const handleViewImpact = (fee: Fee) => {
    setViewingFee(fee);
    setShowImpactModal(true);
  };

  const toggleFeeEnabled = (feeId: string) => {
    setFees(
      fees.map((f) =>
        f.id === feeId ? { ...f, enabled: !f.enabled } : f
      )
    );
    const fee = fees.find((f) => f.id === feeId);
    toast.success(`Fee ${fee?.enabled ? 'disabled' : 'enabled'}`);
  };

  const moveFee = (dragIndex: number, hoverIndex: number) => {
    const dragFee = fees[dragIndex];
    const updatedFees = [...fees];
    updatedFees.splice(dragIndex, 1);
    updatedFees.splice(hoverIndex, 0, dragFee);
    setFees(updatedFees.map((f, i) => ({ ...f, order: i + 1 })));
  };

  // ============================================
  // HANDLERS - DISCOUNTS
  // ============================================

  const openAddDiscountModal = () => {
    setEditingDiscount(null);
    setDiscountForm({
      type: 'Percentage',
      conditionType: 'All',
      stackable: false,
      active: true,
    });
    setShowDiscountModal(true);
  };

  const openEditDiscountModal = (discount: Discount) => {
    setEditingDiscount(discount);
    setDiscountForm({ ...discount });
    setShowDiscountModal(true);
  };

  const handleSaveDiscount = () => {
    // Validation
    if (!discountForm.name || discountForm.value === undefined) {
      toast.error('Discount name and value are required');
      return;
    }

    if (!discountForm.validFrom || !discountForm.validTo) {
      toast.error('Valid from and to dates are required');
      return;
    }

    if (editingDiscount) {
      // Update
      setDiscounts(
        discounts.map((d) =>
          d.id === editingDiscount.id ? { ...d, ...discountForm } : d
        )
      );
      toast.success('Discount updated successfully');
      addActivityLog({
        actor: 'Current Admin',
        actorType: 'Admin',
        action: 'Updated',
        entity: 'Discount',
        entityId: editingDiscount.id,
        severity: 'Info',
        summary: `Updated discount: ${discountForm.name}`,
        fullDescription: `Updated discount: ${discountForm.name} with value ${discountForm.value}${discountForm.type === 'Percentage' ? '%' : ''}`,
        timestampDisplay: new Date().toLocaleString(),
        source: 'Admin Action',
        triggerType: 'Manual',
      });
    } else {
      // Create
      const newDiscount: Discount = {
        id: `disc-${Date.now()}`,
        ...discountForm,
      } as Discount;
      setDiscounts([...discounts, newDiscount]);
      toast.success('Discount added successfully');
      addActivityLog({
        actor: 'Current Admin',
        actorType: 'Admin',
        action: 'Created',
        entity: 'Discount',
        entityId: newDiscount.id,
        severity: 'Info',
        summary: `Added new discount: ${discountForm.name}`,
        fullDescription: `Added new discount: ${discountForm.name} with value ${discountForm.value}${discountForm.type === 'Percentage' ? '%' : ''}`,
        timestampDisplay: new Date().toLocaleString(),
        source: 'Admin Action',
        triggerType: 'Manual',
      });
    }

    setShowDiscountModal(false);
  };

  const handleDuplicateDiscount = (discount: Discount) => {
    const duplicated: Discount = {
      ...discount,
      id: `disc-${Date.now()}`,
      name: `${discount.name} (Copy)`,
    };
    setDiscounts([...discounts, duplicated]);
    toast.success('Discount duplicated successfully');
  };

  const handleDeleteDiscount = (discountId: string) => {
    setDiscounts(discounts.filter((d) => d.id !== discountId));
    toast.success('Discount deleted successfully');
    addActivityLog({
      actor: 'Current Admin',
      actorType: 'Admin',
      action: 'Deleted',
      entity: 'Discount',
      entityId: discountId,
      severity: 'Info',
      summary: 'Deleted discount',
      fullDescription: `Deleted discount with ID: ${discountId}`,
      timestampDisplay: new Date().toLocaleString(),
      source: 'Admin Action',
      triggerType: 'Manual',
    });
  };

  const toggleDiscountActive = (discountId: string) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === discountId ? { ...d, active: !d.active } : d
      )
    );
    const discount = discounts.find((d) => d.id === discountId);
    toast.success(`Discount ${discount?.active ? 'deactivated' : 'activated'}`);
  };

  // ============================================
  // CALCULATOR
  // ============================================

  const calculateBreakdown = () => {
    const { fromCurrency, toCurrency, amount, transferType } = calculator;

    // Mock exchange rate
    const exchangeRate = fromCurrency === 'USD' && toCurrency === 'INR' ? 83.25 : 1.27;

    // Apply enabled fees
    const enabledFees = fees.filter((f) => f.enabled);
    let totalFees = 0;
    const feeBreakdown: any[] = [];

    enabledFees.forEach((fee) => {
      if (fee.appliesTo === 'Instant' && transferType !== 'Instant') return;

      let feeAmount = 0;
      if (fee.type === 'Percentage') {
        feeAmount = (amount * fee.amount) / 100;
      } else if (fee.type === 'Fixed') {
        feeAmount = fee.amount;
      }

      totalFees += feeAmount;
      feeBreakdown.push({
        name: fee.name,
        amount: feeAmount.toFixed(2),
      });
    });

    // Apply active discounts
    const activeDiscounts = discounts.filter((d) => d.active);
    let totalDiscount = 0;
    const discountBreakdown: any[] = [];

    activeDiscounts.forEach((discount) => {
      let discountAmount = 0;
      if (discount.type === 'Percentage') {
        discountAmount = (totalFees * discount.value) / 100;
      } else {
        discountAmount = discount.value;
      }

      totalDiscount += discountAmount;
      discountBreakdown.push({
        name: discount.name,
        amount: discountAmount.toFixed(2),
      });
    });

    const totalYouPay = amount + totalFees - totalDiscount;
    const recipientGets = totalYouPay * exchangeRate;
    const effectiveMarkup = ((totalFees - totalDiscount) / amount) * 100;

    // Platform earnings
    const fxMarginFee = enabledFees.find((f) => f.name === 'FX Margin');
    const transferFee = enabledFees.find((f) => f.name === 'Transfer Fee');

    const fxMarginEarning = fxMarginFee
      ? (amount * fxMarginFee.amount) / 100
      : 0;
    const transferFeeEarning = transferFee
      ? transferFee.type === 'Percentage'
        ? (amount * transferFee.amount) / 100
        : transferFee.amount
      : 0;
    const totalRevenue = fxMarginEarning + transferFeeEarning;

    return {
      transferAmount: amount.toFixed(2),
      exchangeRate: exchangeRate.toFixed(4),
      feeBreakdown,
      discountBreakdown,
      totalFees: totalFees.toFixed(2),
      totalDiscount: totalDiscount.toFixed(2),
      totalYouPay: totalYouPay.toFixed(2),
      recipientGets: recipientGets.toFixed(2),
      effectiveMarkup: effectiveMarkup.toFixed(2),
      platformEarnings: {
        fxMargin: fxMarginEarning.toFixed(2),
        transferFee: transferFeeEarning.toFixed(2),
        totalRevenue: totalRevenue.toFixed(2),
      },
    };
  };

  const breakdown = calculateBreakdown();

  const handleSaveScenario = () => {
    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `${calculator.fromCurrency}→${calculator.toCurrency} ${calculator.amount} ${calculator.transferType}`,
      timestamp: new Date().toLocaleString(),
      ...calculator,
      breakdown,
    };
    setScenarios([scenario, ...scenarios]);
    toast.success('Scenario saved successfully');
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter((s) => s.id !== scenarioId));
    toast.success('Scenario deleted');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* 1. PRICING MODEL */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#253154]">Pricing Model</h3>
            <p className="text-sm text-gray-600">
              Choose how pricing is calculated for transfers and FX conversions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {(['Fixed', 'Percentage', 'Spread', 'Dynamic'] as PricingModel[]).map((model) => (
            <button
              key={model}
              onClick={() => handleSelectPricingModel(model)}
              disabled={!canEdit}
              className={`p-4 rounded-xl border-2 transition-all ${pricingModel === model
                ? 'border-[#0e042f] bg-purple-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
                } ${!canEdit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <div className="text-center">
                <p className="text-sm font-bold text-[#253154]">{model}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Active model: <span className="font-semibold text-[#253154]">{pricingModel}</span>
        </p>
      </div>

      {/* 2. FEE CONFIGURATION */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#253154]">Fee Configuration</h3>
            <p className="text-sm text-gray-600">Revenue engine settings</p>
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={openAddFeeModal}
              className="bg-[#0e042f] hover:bg-[#1a0a4a]"
            >
              <Plus size={14} className="mr-2" />
              Add Fee
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm font-bold text-[#253154]">{fee.name}</h4>
                    <Switch
                      checked={fee.enabled}
                      onCheckedChange={() => toggleFeeEnabled(fee.id)}
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                      Type: {fee.type}
                    </span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-semibold">
                      Amount: {fee.type === 'Percentage' ? `${fee.amount}%` : `${fee.currency} ${fee.amount}`}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">
                      Paid By: {fee.paidBy}
                    </span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-semibold">
                      Applies To: {fee.appliesTo}
                    </span>
                    <span
                      className={`px-2 py-1 rounded font-semibold ${fee.refundable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                      Refundable: {fee.refundable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={!canEdit}>
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => openEditFeeModal(fee)}>
                      <Edit3 size={14} className="mr-2" />
                      Edit Fee
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateFee(fee)}>
                      <Copy size={14} className="mr-2" />
                      Duplicate Fee
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleViewImpact(fee)}>
                      <Eye size={14} className="mr-2" />
                      View Impact
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteFee(fee.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Fee
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Fee Execution Order */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-[#253154]">Fee Execution Order</h4>
            <p className="text-xs text-gray-600">Order affects final calculation</p>
          </div>

          <DndProvider backend={HTML5Backend}>
            <div className="space-y-2">
              {fees
                .sort((a, b) => a.order - b.order)
                .map((fee, index) => (
                  <DraggableFeeOrderItem
                    key={fee.id}
                    fee={fee}
                    index={index}
                    moveFee={moveFee}
                  />
                ))}
            </div>
          </DndProvider>
        </div>
      </div>

      {/* 3. DISCOUNTS & PROMOTIONS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#253154]">Discounts & Promotions</h3>
            <p className="text-sm text-gray-600">Special offers and incentives</p>
          </div>
          {canEdit && (
            <Button
              size="sm"
              onClick={openAddDiscountModal}
              className="bg-[#0e042f] hover:bg-[#1a0a4a]"
            >
              <Plus size={14} className="mr-2" />
              Add Discount
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-sm font-bold text-[#253154]">{discount.name}</h4>
                    <Switch
                      checked={discount.active}
                      onCheckedChange={() => toggleDiscountActive(discount.id)}
                      disabled={!canEdit}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">
                      Type: {discount.type}
                    </span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded font-semibold">
                      Value: {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">
                      Valid: {discount.validFrom} - {discount.validTo}
                    </span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded font-semibold">
                      Condition: {discount.conditionType}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={!canEdit}>
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => openEditDiscountModal(discount)}>
                      <Edit3 size={14} className="mr-2" />
                      Edit Discount
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicateDiscount(discount)}>
                      <Copy size={14} className="mr-2" />
                      Duplicate Discount
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Discount
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. STUDENT COST PREVIEW */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-[#253154]">Student Cost Preview (Live Calculator)</h3>
          <p className="text-sm text-gray-600">
            Simulate the student&apos;s final amount using current pricing setup
          </p>
        </div>

        {/* Calculator Inputs */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              From Currency
            </Label>
            <Select
              value={calculator.fromCurrency}
              onValueChange={(value) =>
                setCalculator({ ...calculator, fromCurrency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              To Currency
            </Label>
            <Select
              value={calculator.toCurrency}
              onValueChange={(value) =>
                setCalculator({ ...calculator, toCurrency: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Transfer Amount
            </Label>
            <Input
              type="number"
              value={calculator.amount}
              onChange={(e) =>
                setCalculator({ ...calculator, amount: parseFloat(e.target.value) })
              }
              placeholder="1000"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Destination Country
            </Label>
            <Select
              value={calculator.country}
              onValueChange={(value) =>
                setCalculator({ ...calculator, country: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700 mb-2 block">
              Transfer Type
            </Label>
            <Select
              value={calculator.transferType}
              onValueChange={(value: any) =>
                setCalculator({ ...calculator, transferType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Instant">Instant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Transfer Amount</span>
              <span className="font-semibold text-gray-900">
                {calculator.fromCurrency} {breakdown.transferAmount}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-semibold text-gray-900">{breakdown.exchangeRate}</span>
            </div>

            {breakdown.feeBreakdown.map((fee: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{fee.name}</span>
                <span className="font-semibold text-red-600">
                  +{calculator.fromCurrency} {fee.amount}
                </span>
              </div>
            ))}

            {breakdown.discountBreakdown.map((discount: any, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{discount.name}</span>
                <span className="font-semibold text-green-600">
                  -{calculator.fromCurrency} {discount.amount}
                </span>
              </div>
            ))}

            <div className="border-t border-blue-300 pt-3 mt-3">
              <div className="flex justify-between text-base">
                <span className="font-bold text-[#253154]">Total You Pay</span>
                <span className="font-bold text-[#253154]">
                  {calculator.fromCurrency} {breakdown.totalYouPay}
                </span>
              </div>

              <div className="flex justify-between text-base mt-2">
                <span className="font-bold text-[#253154]">Recipient Gets</span>
                <span className="font-bold text-emerald-600">
                  {calculator.toCurrency} {breakdown.recipientGets}
                </span>
              </div>

              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Effective Markup %</span>
                <span className="font-semibold text-gray-900">{breakdown.effectiveMarkup}%</span>
              </div>
            </div>

            {/* Platform Earnings */}
            <div className="border-t border-blue-300 pt-3 mt-3">
              <p className="text-xs font-bold text-[#253154] uppercase mb-2">
                Platform Earnings
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-gray-600">FX Margin</p>
                  <p className="font-bold text-purple-600">
                    {calculator.fromCurrency} {breakdown.platformEarnings.fxMargin}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Transfer Fee</p>
                  <p className="font-bold text-blue-600">
                    {calculator.fromCurrency} {breakdown.platformEarnings.transferFee}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total Revenue</p>
                  <p className="font-bold text-emerald-600">
                    {calculator.fromCurrency} {breakdown.platformEarnings.totalRevenue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleSaveScenario}
            className="mt-4 bg-[#0e042f] hover:bg-[#1a0a4a]"
          >
            <Save size={14} className="mr-2" />
            Save Scenario
          </Button>
        </div>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-bold text-[#253154] mb-3">Saved Scenarios</h4>
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{scenario.name}</p>
                    <p className="text-xs text-gray-600">{scenario.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteScenario(scenario.id)}
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Pricing Model Change Confirmation */}
      <Dialog open={showPricingModelModal} onOpenChange={setShowPricingModelModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Pricing Model?</DialogTitle>
            <DialogDescription>
              Changing the model may affect current calculations and previews.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPricingModelModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPricingModelChange}
              className="bg-[#0e042f] hover:bg-[#1a0a4a]"
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Fee Modal */}
      <Dialog open={showFeeModal} onOpenChange={setShowFeeModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFee ? 'Edit Fee' : 'Add Fee'}
            </DialogTitle>
            <DialogDescription>
              Configure fee settings for forex services
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Fee Name
              </Label>
              <Input
                value={feeForm.name || ''}
                onChange={(e) => setFeeForm({ ...feeForm, name: e.target.value })}
                placeholder="e.g., Transfer Fee"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Type
                </Label>
                <Select
                  value={feeForm.type}
                  onValueChange={(value: any) => setFeeForm({ ...feeForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={feeForm.amount || 0}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, amount: parseFloat(e.target.value) })
                  }
                  placeholder="0.65"
                />
              </div>
            </div>

            {feeForm.type === 'Fixed' && (
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Currency
                </Label>
                <Select
                  value={feeForm.currency}
                  onValueChange={(value) => setFeeForm({ ...feeForm, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Paid By
                </Label>
                <Select
                  value={feeForm.paidBy}
                  onValueChange={(value: any) => setFeeForm({ ...feeForm, paidBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Split">Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Applies To
                </Label>
                <Select
                  value={feeForm.appliesTo}
                  onValueChange={(value: any) =>
                    setFeeForm({ ...feeForm, appliesTo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Exchange">Exchange</SelectItem>
                    <SelectItem value="Instant">Instant</SelectItem>
                    <SelectItem value="Forex Card">Forex Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-semibold text-gray-900">Refundable</Label>
              <Switch
                checked={feeForm.refundable || false}
                onCheckedChange={(checked) =>
                  setFeeForm({ ...feeForm, refundable: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-semibold text-gray-900">Active Status</Label>
              <Switch
                checked={feeForm.enabled !== false}
                onCheckedChange={(checked) =>
                  setFeeForm({ ...feeForm, enabled: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeeModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFee} className="bg-[#0e042f] hover:bg-[#1a0a4a]">
              Save Fee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Discount Modal */}
      <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingDiscount ? 'Edit Discount' : 'Add Discount'}
            </DialogTitle>
            <DialogDescription>
              Configure discount settings for promotional offers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Discount Name
              </Label>
              <Input
                value={discountForm.name || ''}
                onChange={(e) =>
                  setDiscountForm({ ...discountForm, name: e.target.value })
                }
                placeholder="e.g., First Transfer Discount"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Type
                </Label>
                <Select
                  value={discountForm.type}
                  onValueChange={(value: any) =>
                    setDiscountForm({ ...discountForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Value
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={discountForm.value || 0}
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      value: parseFloat(e.target.value),
                    })
                  }
                  placeholder="50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Valid From
                </Label>
                <Input
                  type="date"
                  value={discountForm.validFrom || ''}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, validFrom: e.target.value })
                  }
                />
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Valid To
                </Label>
                <Input
                  type="date"
                  value={discountForm.validTo || ''}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, validTo: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Condition Type
              </Label>
              <Select
                value={discountForm.conditionType}
                onValueChange={(value: any) =>
                  setDiscountForm({ ...discountForm, conditionType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="First Transfer">First Transfer</SelectItem>
                  <SelectItem value="Min Amount">Min Amount</SelectItem>
                  <SelectItem value="Country">Country</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {discountForm.conditionType === 'Min Amount' && (
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Minimum Amount
                </Label>
                <Input
                  type="number"
                  value={discountForm.minAmount || 0}
                  onChange={(e) =>
                    setDiscountForm({
                      ...discountForm,
                      minAmount: parseFloat(e.target.value),
                    })
                  }
                  placeholder="1000"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-semibold text-gray-900">Stackable</Label>
              <Switch
                checked={discountForm.stackable || false}
                onCheckedChange={(checked) =>
                  setDiscountForm({ ...discountForm, stackable: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDiscountModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveDiscount}
              className="bg-[#0e042f] hover:bg-[#1a0a4a]"
            >
              Save Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Impact Modal */}
      <Dialog open={showImpactModal} onOpenChange={setShowImpactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fee Impact Analysis</DialogTitle>
            <DialogDescription>
              {viewingFee?.name} - Read-only breakdown
            </DialogDescription>
          </DialogHeader>

          {viewingFee && (
            <div className="py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee Type</span>
                <span className="font-semibold">{viewingFee.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">
                  {viewingFee.type === 'Percentage'
                    ? `${viewingFee.amount}%`
                    : `${viewingFee.currency} ${viewingFee.amount}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paid By</span>
                <span className="font-semibold">{viewingFee.paidBy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Applies To</span>
                <span className="font-semibold">{viewingFee.appliesTo}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refundable</span>
                <span className="font-semibold">{viewingFee.refundable ? 'Yes' : 'No'}</span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">
                  Impact on $1000 transfer:
                </p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-bold text-[#253154]">
                    Fee Amount:{' '}
                    {viewingFee.type === 'Percentage'
                      ? `$${((1000 * viewingFee.amount) / 100).toFixed(2)}`
                      : `${viewingFee.currency} ${viewingFee.amount}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowImpactModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
