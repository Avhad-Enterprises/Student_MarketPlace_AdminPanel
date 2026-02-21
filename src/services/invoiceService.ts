// Invoice Service - Centralized persistence and business logic

export interface LineItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  publicToken?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  entryType: string;
  category: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  referenceNumber: string;
  title: string;
  lineItems: LineItem[];
  department: string;
  project: string;
  vendorClient: string;
  paymentMethodsAllowed: string[];
  paymentStatus: string;
  internalNotes: string;
  studentVisibleNote: string;
  showStudentNote: boolean;
  tags: string[];
  approvalRequired: boolean;
  approver: string;
  isRecurring: boolean;
  frequency: string;
  startDate: string;
  endType: string;
  endOccurrences: string;
  endDate: string;
  issueFirstNow: boolean;
  status: 'Draft' | 'Pending Approval' | 'Issued' | 'Paid' | 'Partial' | 'Overdue' | 'Cancelled' | 'Refunded' | 'Rejected';
  totals: {
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    grandTotal: number;
  };
  student: {
    id: string;
    name: string;
    email: string;
    country: string;
  };
  paidAmount?: number;
  refundedAmount?: number;
  lastPaymentDate?: string;
  paymentHistory?: any[];
  refundHistory?: any[];
  shareLink?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  issuedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface InvoiceLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  summary: string;
  metadata?: any;
  timestamp: string;
  actor: string;
}

// Storage keys
const INVOICES_KEY = 'finance_invoices';
const LOGS_KEY = 'finance_logs';
const DRAFT_KEY = 'finance_invoice_draft';

// Get all invoices
export const getAllInvoices = (): Invoice[] => {
  try {
    const data = localStorage.getItem(INVOICES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading invoices:', error);
    return [];
  }
};

// Get single invoice by ID
export const getInvoiceById = (id: string): Invoice | null => {
  try {
    const invoices = getAllInvoices();
    return invoices.find(inv => inv.id === id) || null;
  } catch (error) {
    console.error('Error loading invoice:', error);
    return null;
  }
};

// Create new invoice
export const createInvoice = (invoice: Invoice): void => {
  try {
    const invoices = getAllInvoices();
    invoices.push(invoice);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

// Update existing invoice
export const updateInvoice = (id: string, updates: Partial<Invoice>): void => {
  try {
    const invoices = getAllInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    if (index !== -1) {
      invoices[index] = {
        ...invoices[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    }
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

// Delete invoice
export const deleteInvoice = (id: string): void => {
  try {
    const invoices = getAllInvoices();
    const filtered = invoices.filter(inv => inv.id !== id);
    localStorage.setItem(INVOICES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

// Draft management
export const saveDraft = (data: any): void => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
};

export const loadDraft = (): any | null => {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading draft:', error);
    return null;
  }
};

export const clearDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Error clearing draft:', error);
  }
};

// Logs
export const addLog = (log: Omit<InvoiceLog, 'id' | 'timestamp'>): void => {
  try {
    const logs = getAllLogs();
    const newLog: InvoiceLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    logs.push(newLog);
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error adding log:', error);
  }
};

export const getAllLogs = (): InvoiceLog[] => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading logs:', error);
    return [];
  }
};

export const getLogsByInvoiceId = (invoiceId: string): InvoiceLog[] => {
  try {
    const logs = getAllLogs();
    return logs.filter(log => log.entityId === invoiceId).reverse();
  } catch (error) {
    console.error('Error loading invoice logs:', error);
    return [];
  }
};

// Utility: Generate unique invoice ID
export const generateInvoiceId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

// Utility: Generate public token for payment link
export const generatePublicToken = (): string => {
  return 'pub-' + Math.random().toString(36).substr(2, 16);
};

// Utility: Calculate line item total
export const calculateLineItemTotal = (item: LineItem): number => {
  const subtotal = item.quantity * item.unitPrice;
  const afterDiscount = subtotal - item.discount;
  const taxAmount = (afterDiscount * item.taxRate) / 100;
  return afterDiscount + taxAmount;
};

// Utility: Calculate invoice totals
export const calculateInvoiceTotals = (lineItems: LineItem[]): {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
} => {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = lineItems.reduce((sum, item) => {
    const itemSubtotal = item.quantity * item.unitPrice - item.discount;
    return sum + (itemSubtotal * item.taxRate) / 100;
  }, 0);
  const discountTotal = lineItems.reduce((sum, item) => sum + item.discount, 0);
  
  return {
    subtotal,
    taxTotal,
    discountTotal,
    grandTotal: subtotal,
  };
};

// Utility: Check if invoice is overdue
export const isInvoiceOverdue = (invoice: Invoice): boolean => {
  if (['Paid', 'Cancelled', 'Refunded'].includes(invoice.status)) {
    return false;
  }
  const dueDate = new Date(invoice.dueDate);
  const today = new Date();
  return dueDate < today;
};

// Utility: Get status display info
export const getStatusInfo = (status: Invoice['status']) => {
  const statusMap = {
    'Draft': { color: 'bg-gray-100 text-gray-700', label: 'Draft' },
    'Pending Approval': { color: 'bg-yellow-100 text-yellow-700', label: 'Pending Approval' },
    'Issued': { color: 'bg-blue-100 text-blue-700', label: 'Issued' },
    'Paid': { color: 'bg-emerald-100 text-emerald-700', label: 'Paid' },
    'Partial': { color: 'bg-orange-100 text-orange-700', label: 'Partially Paid' },
    'Overdue': { color: 'bg-red-100 text-red-700', label: 'Overdue' },
    'Cancelled': { color: 'bg-gray-100 text-gray-700', label: 'Cancelled' },
    'Refunded': { color: 'bg-purple-100 text-purple-700', label: 'Refunded' },
    'Rejected': { color: 'bg-red-100 text-red-700', label: 'Rejected' },
  };
  return statusMap[status] || statusMap['Draft'];
};

// Filter and search
export const filterInvoices = (
  invoices: Invoice[],
  filters: {
    status?: string[];
    student?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
): Invoice[] => {
  return invoices.filter(invoice => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(invoice.status)) {
      return false;
    }
    if (filters.student && invoice.studentId !== filters.student) {
      return false;
    }
    if (filters.dateFrom && invoice.invoiceDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && invoice.invoiceDate > filters.dateTo) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        invoice.id.toLowerCase().includes(searchLower) ||
        invoice.title.toLowerCase().includes(searchLower) ||
        invoice.studentName.toLowerCase().includes(searchLower) ||
        invoice.studentEmail.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

// Export
export default {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  saveDraft,
  loadDraft,
  clearDraft,
  addLog,
  getAllLogs,
  getLogsByInvoiceId,
  generateInvoiceId,
  generatePublicToken,
  calculateLineItemTotal,
  calculateInvoiceTotals,
  isInvoiceOverdue,
  getStatusInfo,
  filterInvoices,
};
