/**
 * BANK TRANSACTIONS TAB - Partner Financial Events & Commissions
 * Shows platform earnings and settlements with bank partner
 * DOES NOT show student banking data
 */

import React, { useState } from 'react';
import {
  FileText,
  DollarSign,
  Search,
  Eye,
  Lock,
  Calendar,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { DateInput } from './ui/date-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export const BankTransactionsTab = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEventType, setFilterEventType] = useState('all');
  const [filterTxnStatus, setFilterTxnStatus] = useState('all');
  const [filterSettlementStatus, setFilterSettlementStatus] = useState('all');

  // Mock partner financial transactions
  const transactions = [
    {
      id: 1,
      transactionId: 'FIN-BNK-2024-00123',
      appReference: 'BNK-APP-2024-00123',
      student: 'J.S. (STU-001)',
      eventType: 'Account Opening Commission',
      amount: 150.00,
      currency: 'USD',
      eventDate: '2024-02-03',
      transactionStatus: 'Confirmed',
      settlementStatus: 'Settled',
      notes: 'Standard commission for successful account opening',
      trigger: 'Account opened successfully',
      triggerSource: 'Bank callback',
      commissionRule: {
        name: 'Standard Account Opening Fee',
        logic: 'Fixed amount per successful account',
        value: '$150.00 per account',
        computedAmount: 150.00,
      },
      auditTimeline: [
        { event: 'Transaction created', timestamp: '2024-02-03 10:15 AM', actor: 'System' },
        { event: 'Status confirmed by bank', timestamp: '2024-02-03 02:30 PM', actor: 'Bank' },
        { event: 'Settlement approved', timestamp: '2024-02-05 09:00 AM', actor: 'System' },
        { event: 'Payout settled', timestamp: '2024-02-10 11:45 AM', actor: 'Bank' },
      ],
      dispute: null,
    },
    {
      id: 2,
      transactionId: 'FIN-BNK-2024-00124',
      appReference: 'BNK-APP-2024-00125',
      student: 'W.Z. (STU-003)',
      eventType: 'Referral Commission',
      amount: 200.00,
      currency: 'USD',
      eventDate: '2024-02-05',
      transactionStatus: 'Confirmed',
      settlementStatus: 'Settled',
      notes: 'Referral bonus - premium account type',
      trigger: 'Premium account opened via referral link',
      triggerSource: 'Bank callback',
      commissionRule: {
        name: 'Premium Referral Bonus',
        logic: 'Percentage-based on account tier',
        value: 'Base $150 + $50 premium tier',
        computedAmount: 200.00,
      },
      auditTimeline: [
        { event: 'Transaction created', timestamp: '2024-02-05 11:30 AM', actor: 'System' },
        { event: 'Status confirmed by bank', timestamp: '2024-02-05 03:15 PM', actor: 'Bank' },
        { event: 'Settlement approved', timestamp: '2024-02-07 10:00 AM', actor: 'System' },
        { event: 'Payout settled', timestamp: '2024-02-12 02:20 PM', actor: 'Bank' },
      ],
      dispute: null,
    },
    {
      id: 3,
      transactionId: 'FIN-BNK-2024-00125',
      appReference: 'BNK-APP-2024-00124',
      student: 'M.G. (STU-002)',
      eventType: 'Account Opening Commission',
      amount: 150.00,
      currency: 'USD',
      eventDate: '2024-02-01',
      transactionStatus: 'Pending',
      settlementStatus: 'Not Settled',
      notes: 'Awaiting KYC completion confirmation',
      trigger: 'Application submitted, awaiting final approval',
      triggerSource: 'System rule',
      commissionRule: {
        name: 'Standard Account Opening Fee',
        logic: 'Fixed amount per successful account',
        value: '$150.00 per account',
        computedAmount: 150.00,
      },
      auditTimeline: [
        { event: 'Transaction created', timestamp: '2024-02-01 11:45 AM', actor: 'System' },
        { event: 'Pending bank confirmation', timestamp: '2024-02-01 11:50 AM', actor: 'System' },
      ],
      dispute: null,
    },
    {
      id: 4,
      transactionId: 'FIN-BNK-2024-00126',
      appReference: 'BNK-APP-2024-00126',
      student: 'P.P. (STU-004)',
      eventType: 'Reversal',
      amount: -150.00,
      currency: 'USD',
      eventDate: '2024-01-30',
      transactionStatus: 'Confirmed',
      settlementStatus: 'Settled',
      notes: 'Reversed due to KYC failure - account not opened',
      trigger: 'KYC failed after initial approval',
      triggerSource: 'Bank callback',
      commissionRule: {
        name: 'Commission Reversal',
        logic: 'Full reversal of original commission',
        value: '-$150.00 (original commission)',
        computedAmount: -150.00,
      },
      auditTimeline: [
        { event: 'Original commission created', timestamp: '2024-01-22 01:45 PM', actor: 'System' },
        { event: 'KYC failure notification received', timestamp: '2024-01-28 03:15 PM', actor: 'Bank' },
        { event: 'Reversal transaction created', timestamp: '2024-01-28 03:20 PM', actor: 'System' },
        { event: 'Reversal confirmed', timestamp: '2024-01-30 10:00 AM', actor: 'Bank' },
      ],
      dispute: null,
    },
    {
      id: 5,
      transactionId: 'FIN-BNK-2024-00127',
      appReference: 'BNK-APP-2024-00145',
      student: 'L.M. (STU-015)',
      eventType: 'Campaign Incentive',
      amount: 250.00,
      currency: 'USD',
      eventDate: '2024-02-04',
      transactionStatus: 'Confirmed',
      settlementStatus: 'Settled',
      notes: 'Q1 2024 promotional campaign bonus',
      trigger: 'Account opened during Q1 promotion period',
      triggerSource: 'System rule',
      commissionRule: {
        name: 'Q1 2024 Campaign Bonus',
        logic: 'Enhanced commission during campaign',
        value: 'Standard $150 + Campaign $100',
        computedAmount: 250.00,
      },
      auditTimeline: [
        { event: 'Transaction created', timestamp: '2024-02-04 09:30 AM', actor: 'System' },
        { event: 'Campaign bonus applied', timestamp: '2024-02-04 09:35 AM', actor: 'System' },
        { event: 'Status confirmed by bank', timestamp: '2024-02-04 04:00 PM', actor: 'Bank' },
        { event: 'Payout settled', timestamp: '2024-02-11 01:15 PM', actor: 'Bank' },
      ],
      dispute: null,
    },
    {
      id: 6,
      transactionId: 'FIN-BNK-2024-00128',
      appReference: 'BNK-APP-2024-00167',
      student: 'A.K. (STU-023)',
      eventType: 'Adjustment',
      amount: 25.00,
      currency: 'USD',
      eventDate: '2024-02-02',
      transactionStatus: 'Confirmed',
      settlementStatus: 'Settled',
      notes: 'Manual adjustment - processing delay compensation',
      trigger: 'Manual adjustment by finance team',
      triggerSource: 'Manual adjustment',
      commissionRule: {
        name: 'Goodwill Adjustment',
        logic: 'Manual compensation for delays',
        value: 'One-time $25.00 credit',
        computedAmount: 25.00,
      },
      auditTimeline: [
        { event: 'Adjustment request submitted', timestamp: '2024-01-30 03:00 PM', actor: 'Admin: Sarah J.' },
        { event: 'Adjustment approved', timestamp: '2024-02-02 10:15 AM', actor: 'Admin: Finance Manager' },
        { event: 'Transaction created', timestamp: '2024-02-02 10:20 AM', actor: 'System' },
        { event: 'Payout settled', timestamp: '2024-02-09 02:45 PM', actor: 'Bank' },
      ],
      dispute: null,
    },
    {
      id: 7,
      transactionId: 'FIN-BNK-2024-00129',
      appReference: 'BNK-APP-2024-00189',
      student: 'T.L. (STU-034)',
      eventType: 'Penalty / Chargeback',
      amount: -75.00,
      currency: 'USD',
      eventDate: '2024-01-28',
      transactionStatus: 'Disputed',
      settlementStatus: 'On Hold',
      notes: 'Chargeback - student disputed account charges',
      trigger: 'Chargeback initiated by student',
      triggerSource: 'Bank callback',
      commissionRule: {
        name: 'Chargeback Penalty',
        logic: '50% of original commission',
        value: '-$75.00 (50% penalty)',
        computedAmount: -75.00,
      },
      auditTimeline: [
        { event: 'Original commission settled', timestamp: '2024-01-10 11:00 AM', actor: 'Bank' },
        { event: 'Chargeback notification received', timestamp: '2024-01-25 02:30 PM', actor: 'Bank' },
        { event: 'Penalty transaction created', timestamp: '2024-01-28 09:00 AM', actor: 'System' },
        { event: 'Dispute raised by admin', timestamp: '2024-01-29 10:15 AM', actor: 'Admin: Revenue Manager' },
      ],
      dispute: {
        raisedDate: '2024-01-29',
        reason: 'Student account was active for 45 days before dispute - chargeback penalty should be waived',
        resolutionStatus: 'Under Review',
      },
    },
    {
      id: 8,
      transactionId: 'FIN-BNK-2024-00130',
      appReference: 'BNK-APP-2024-00203',
      student: 'R.S. (STU-047)',
      eventType: 'Account Opening Commission',
      amount: 150.00,
      currency: 'USD',
      eventDate: '2024-02-05',
      transactionStatus: 'Failed',
      settlementStatus: 'Not Settled',
      notes: 'Commission rejected - duplicate application detected',
      trigger: 'Duplicate application validation failed',
      triggerSource: 'System rule',
      commissionRule: {
        name: 'Standard Account Opening Fee',
        logic: 'Fixed amount per successful account',
        value: '$150.00 per account',
        computedAmount: 150.00,
      },
      auditTimeline: [
        { event: 'Transaction created', timestamp: '2024-02-05 03:45 PM', actor: 'System' },
        { event: 'Duplicate check triggered', timestamp: '2024-02-05 03:50 PM', actor: 'System' },
        { event: 'Transaction failed', timestamp: '2024-02-05 04:00 PM', actor: 'System' },
      ],
      dispute: null,
    },
  ];

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Failed':
        return 'bg-red-100 text-red-700';
      case 'Reversed':
        return 'bg-gray-100 text-gray-700';
      case 'Disputed':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSettlementStatusColor = (status: string) => {
    switch (status) {
      case 'Settled':
        return 'bg-blue-100 text-blue-700';
      case 'Not Settled':
        return 'bg-gray-100 text-gray-700';
      case 'On Hold':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      searchTerm === '' ||
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.appReference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEventType = filterEventType === 'all' || txn.eventType === filterEventType;
    const matchesTxnStatus = filterTxnStatus === 'all' || txn.transactionStatus === filterTxnStatus;
    const matchesSettlement = filterSettlementStatus === 'all' || txn.settlementStatus === filterSettlementStatus;

    return matchesSearch && matchesEventType && matchesTxnStatus && matchesSettlement;
  });

  // Calculate KPIs
  const confirmedTransactions = transactions.filter(t => t.transactionStatus === 'Confirmed');
  const totalCommission = confirmedTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingPayouts = transactions
    .filter(t => t.settlementStatus === 'Not Settled' && t.transactionStatus !== 'Failed')
    .reduce((sum, t) => sum + t.amount, 0);
  const settledAmount = transactions
    .filter(t => t.settlementStatus === 'Settled')
    .reduce((sum, t) => sum + t.amount, 0);
  const disputedAmount = Math.abs(
    transactions
      .filter(t => t.transactionStatus === 'Disputed' || t.transactionStatus === 'Reversed')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Commission Earned</div>
          <div className="text-2xl font-bold text-emerald-700">${totalCommission.toFixed(2)}</div>
          <div className="text-xs text-gray-600 mt-1">Confirmed transactions</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Pending Payouts</div>
          <div className="text-2xl font-bold text-amber-700">${pendingPayouts.toFixed(2)}</div>
          <div className="text-xs text-gray-600 mt-1">Awaiting settlement</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Settled Amount</div>
          <div className="text-2xl font-bold text-blue-700">${settledAmount.toFixed(2)}</div>
          <div className="text-xs text-gray-600 mt-1">Paid out</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Reversed / Disputed</div>
          <div className="text-2xl font-bold text-red-700">${disputedAmount.toFixed(2)}</div>
          <div className="text-xs text-gray-600 mt-1">Requires attention</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Avg Payout Time</div>
          <div className="text-2xl font-bold text-purple-700">7.3d</div>
          <div className="text-xs text-gray-600 mt-1">From event to settlement</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Partner Financial Events & Commissions</h2>
            <div className="text-xs text-gray-500 mt-1">
              Platform earnings and settlements with bank partner
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
              <FileText size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
          <Lock size={16} className="text-blue-600" />
          <div className="text-xs text-blue-800">
            <span className="font-semibold">Compliance Notice:</span> This table shows platform commission transactions only. Student banking data, balances, and personal transactions are never exposed.
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transaction ID or application reference..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
          >
            <option value="all">All Event Types</option>
            <option value="Account Opening Commission">Account Opening Commission</option>
            <option value="Referral Commission">Referral Commission</option>
            <option value="Campaign Incentive">Campaign Incentive</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Reversal">Reversal</option>
            <option value="Penalty / Chargeback">Penalty / Chargeback</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterTxnStatus}
            onChange={(e) => setFilterTxnStatus(e.target.value)}
          >
            <option value="all">All Transaction Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Reversed">Reversed</option>
            <option value="Disputed">Disputed</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filterSettlementStatus}
            onChange={(e) => setFilterSettlementStatus(e.target.value)}
          >
            <option value="all">All Settlement Status</option>
            <option value="Settled">Settled</option>
            <option value="Not Settled">Not Settled</option>
            <option value="On Hold">On Hold</option>
          </select>
          <div className="flex items-center gap-2">
            <DateInput
              value=""
              onChange={() => {}}
              className="w-32"
            />
            <span className="text-gray-400">to</span>
            <DateInput
              value=""
              onChange={() => {}}
              className="w-32"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Transaction ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">App Reference</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student (Masked)</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Event Type</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Currency</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Event Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Transaction Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Settlement Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Notes</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedTransaction(txn)}
                >
                  <td className="py-3 px-4 font-mono text-xs text-gray-700">{txn.transactionId}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-600">{txn.appReference}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{txn.student}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{txn.eventType}</td>
                  <td className={`py-3 px-4 text-right font-semibold text-sm ${
                    txn.amount >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {txn.amount >= 0 ? '+' : ''}{txn.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{txn.currency}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{txn.eventDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTransactionStatusColor(txn.transactionStatus)}`}>
                      {txn.transactionStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSettlementStatusColor(txn.settlementStatus)}`}>
                      {txn.settlementStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600 max-w-[200px] truncate">{txn.notes}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(txn);
                      }}
                      className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredTransactions.length}</span> of <span className="font-semibold">{transactions.length}</span> transactions
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="max-w-[1400px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              Partner Financial Event Details
            </DialogTitle>
          </DialogHeader>

          {selectedTransaction && (
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Bank Name</div>
                      <div className="font-semibold text-gray-900">Chase Bank</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
                      <div className="font-mono text-xs text-gray-700">{selectedTransaction.transactionId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Application Reference</div>
                      <div className="font-mono text-xs text-gray-700">{selectedTransaction.appReference}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Event Type</div>
                      <div className="text-sm text-gray-700">{selectedTransaction.eventType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Amount & Currency</div>
                      <div className={`font-semibold ${
                        selectedTransaction.amount >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {selectedTransaction.amount >= 0 ? '+' : ''}{selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Transaction Status</div>
                      <div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTransactionStatusColor(selectedTransaction.transactionStatus)}`}>
                          {selectedTransaction.transactionStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Settlement Status</div>
                      <div>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSettlementStatusColor(selectedTransaction.settlementStatus)}`}>
                          {selectedTransaction.settlementStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trigger Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Activity size={18} className="text-purple-600" />
                    Trigger Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">What caused this transaction</div>
                      <div className="text-sm text-gray-900 font-medium">{selectedTransaction.trigger}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Source</div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedTransaction.triggerSource === 'Bank callback' ? 'bg-blue-100 text-blue-700' :
                          selectedTransaction.triggerSource === 'Manual adjustment' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedTransaction.triggerSource}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Rule Applied */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-600" />
                    Commission Rule Applied
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                      Read-Only
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Rule Name</div>
                      <div className="font-semibold text-gray-900">{selectedTransaction.commissionRule.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Calculation Logic</div>
                      <div className="text-sm text-gray-700">{selectedTransaction.commissionRule.logic}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Value</div>
                      <div className="text-sm text-gray-700">{selectedTransaction.commissionRule.value}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Final Computed Amount</div>
                      <div className={`font-bold text-lg ${
                        selectedTransaction.commissionRule.computedAmount >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        {selectedTransaction.commissionRule.computedAmount >= 0 ? '+' : ''}${Math.abs(selectedTransaction.commissionRule.computedAmount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Timeline */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" />
                    Audit Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedTransaction.auditTimeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            index === selectedTransaction.auditTimeline.length - 1 ? 'bg-purple-600' : 'bg-gray-300'
                          }`} />
                          {index < selectedTransaction.auditTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="font-medium text-gray-900">{event.event}</div>
                          <div className="text-xs text-gray-500 mt-1">{event.timestamp}</div>
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              event.actor === 'Bank' ? 'bg-blue-100 text-blue-700' :
                              event.actor === 'System' ? 'bg-gray-100 text-gray-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {event.actor}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispute History */}
                {selectedTransaction.dispute && (
                  <div className="bg-orange-50 rounded-xl border border-orange-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} className="text-orange-600" />
                      Dispute History
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Dispute Raised Date</div>
                        <div className="text-sm text-gray-900">{selectedTransaction.dispute.raisedDate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Reason</div>
                        <div className="text-sm text-gray-900">{selectedTransaction.dispute.reason}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Resolution Status</div>
                        <div>
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                            {selectedTransaction.dispute.resolutionStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <FileText size={16} />
              View Full Audit Log
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
