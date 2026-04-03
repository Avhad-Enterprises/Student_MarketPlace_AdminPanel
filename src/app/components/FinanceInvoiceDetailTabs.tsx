import React from 'react';
import { 
  FileText, 
  CreditCard, 
  History, 
  User, 
  Calendar, 
  DollarSign, 
  PieChart, 
  ShieldCheck,
  ArrowRight,
  Download,
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Payment } from '@/services/financeService';

interface TabProps {
  invoiceId: string;
  invoiceData: Payment;
  addActivityLog?: (log: any) => void;
  userRole?: string;
}

// 1. SUMMARY TAB
export const InvoiceSummaryTab: React.FC<TabProps> = ({ invoiceData }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">Invoice Details</h3>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group" title="Download PDF">
                        <Download size={20} className="group-hover:text-purple-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group" title="Email Student">
                        <Send size={20} className="group-hover:text-blue-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student</p>
                        <p className="text-lg font-bold text-gray-900">{invoiceData.first_name} {invoiceData.last_name}</p>
                        <p className="text-xs text-gray-500">DB ID: {invoiceData.student_db_id}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invoice Number</p>
                        <p className="text-sm font-medium text-gray-700">{invoiceData.invoice_number}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
                        <p className="text-sm font-medium text-gray-700">{invoiceData.payment_method}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-purple-600">{invoiceData.currency} {Number(invoiceData.amount).toFixed(2)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Issue Date</p>
                            <p className="text-sm font-medium text-gray-700">{new Date(invoiceData.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                            <p className="text-sm font-bold text-red-500">{invoiceData.due_date}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gray-50 border border-gray-100 italic text-sm text-gray-500">
                <p className="flex items-start gap-2">
                    <FileText size={16} className="mt-0.5 shrink-0" />
                    "{invoiceData.description || 'No additional description provided'}"
                </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            <div className={`p-6 rounded-[32px] border shadow-sm ${
                invoiceData.status === 'paid' ? 'bg-green-50/50 border-green-100' : 
                invoiceData.status === 'overdue' ? 'bg-red-50/50 border-red-100' : 'bg-amber-50/50 border-amber-100'
            }`}>
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Payment Status</h4>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        invoiceData.status === 'paid' ? 'bg-green-100 text-green-600' : 
                        invoiceData.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                        {invoiceData.status === 'paid' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900 capitalize">{invoiceData.status}</p>
                        <p className="text-xs text-gray-500">{invoiceData.status === 'paid' ? 'Verified on Gateway' : 'Awaiting transfer'}</p>
                    </div>
                </div>
                <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:shadow-md transition-all">Verify Transaction</button>
            </div>

            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Student Summary</h4>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Education Portal ID</p>
                            <p className="text-[10px] text-gray-500">#{invoiceData.student_db_id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><PieChart size={14} /></div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Total Spent</p>
                            <p className="text-[10px] text-gray-500">$4,250.00 to date</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// 2. PAYMENT HISTORY TAB
export const InvoicePaymentHistoryTab: React.FC<TabProps> = ({ invoiceData }) => {
    const history = [
        { date: invoiceData.created_at, amount: '$0.00', status: 'Invoiced', desc: 'Initial invoice generated' },
        { date: new Date().toISOString(), amount: Number(invoiceData.amount).toFixed(2), status: invoiceData.status === 'paid' ? 'Success' : 'Pending', desc: `Payment attempt via ${invoiceData.payment_method}` },
    ];

    return (
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8">Transaction Logs</h3>
            <div className="space-y-0 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100" />
                {history.map((h, i) => (
                    <div key={i} className="relative pl-12 pb-8 last:pb-0 group">
                        <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${
                            h.status === 'Success' ? 'bg-green-500 text-white' : 
                            h.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white'
                        }`}>
                            {h.status === 'Success' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                                <p className="text-sm font-bold text-gray-900">{h.status}: {h.desc}</p>
                                <p className="text-xs text-gray-500">{new Date(h.date).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-indigo-600">{invoiceData.currency} {h.amount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
