import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';

export interface ExcelExportOptions {
  filename?: string;
  includeStatus?: boolean;
  includeSummary?: boolean;
  autoFitColumns?: boolean;
}

export interface InvoiceExportData {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  paymentStatus: string;
  createdAt: string;
  client: {
    id: string;
    fullName: string;
    email: string;
    companyName?: string;
  };
  fileUrl: string;
}

export interface ExcelColumnDefinition {
  key: string;
  label: string;
  width: number;
  formatter?: (value: any) => string;
}

export const INVOICE_EXCEL_COLUMNS: ExcelColumnDefinition[] = [
  { key: 'sno', label: 'S.No', width: 8 },
  { key: 'invoiceNumber', label: 'Invoice Number', width: 15 },
  { key: 'clientName', label: 'Client Name', width: 20 },
  { key: 'clientEmail', label: 'Client Email', width: 25 },
  { key: 'companyName', label: 'Company Name', width: 20 },
  { key: 'amount', label: 'Amount', width: 12 },
  { key: 'currency', label: 'Currency', width: 10 },
  { key: 'createdDate', label: 'Created Date', width: 12 },
  { key: 'dueDate', label: 'Due Date', width: 12 },
  { key: 'status', label: 'Status', width: 12 },
  { key: 'daysToDue', label: 'Days to Due', width: 12 },
  { key: 'isOverdue', label: 'Is Overdue', width: 10 },
  { key: 'fileUrl', label: 'File URL', width: 50 }
];

export function getStatusText(status: string): string {
  switch (status) {
    case 'PENDING': return 'Payment Pending';
    case 'SUBMITTED': return 'Under Review';
    case 'VERIFIED': return 'Payment Verified';
    case 'PAID': return 'Paid';
    default: return 'Unknown Status';
  }
}

export function prepareInvoiceDataForExcel(invoices: InvoiceExportData[]): any[] {
  return invoices.map((invoice, index) => ({
    'S.No': index + 1,
    'Invoice Number': invoice.invoiceNumber,
    'Client Name': invoice.client.fullName,
    'Client Email': invoice.client.email,
    'Company Name': invoice.client.companyName || 'N/A',
    'Amount': invoice.amount,
    'Currency': invoice.currency,
    'Created Date': format(parseISO(invoice.createdAt), 'dd/MM/yyyy'),
    'Due Date': format(parseISO(invoice.dueDate), 'dd/MM/yyyy'),
    'Status': getStatusText(invoice.paymentStatus),
    'Days to Due': Math.ceil((new Date(invoice.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
    'Is Overdue': new Date(invoice.dueDate) < new Date() && invoice.paymentStatus === 'PENDING' ? 'Yes' : 'No',
    'File URL': invoice.fileUrl
  }));
}

export function calculateInvoiceStatistics(invoices: InvoiceExportData[]) {
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'PAID').length;
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'PENDING').length;
  const overdueInvoices = invoices.filter(inv => 
    inv.paymentStatus === 'PENDING' && new Date(inv.dueDate) < new Date()
  ).length;
  
  const totalRevenue = invoices
    .filter(inv => inv.paymentStatus === 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);
  
  const pendingRevenue = invoices
    .filter(inv => inv.paymentStatus !== 'PAID')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return {
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    totalRevenue,
    pendingRevenue,
    paymentSuccessRate: totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0
  };
}

export function createSummarySheet(statistics: ReturnType<typeof calculateInvoiceStatistics>) {
  return [
    { 'Metric': 'Total Invoices', 'Value': statistics.totalInvoices },
    { 'Metric': 'Paid Invoices', 'Value': statistics.paidInvoices },
    { 'Metric': 'Pending Invoices', 'Value': statistics.pendingInvoices },
    { 'Metric': 'Overdue Invoices', 'Value': statistics.overdueInvoices },
    { 'Metric': 'Total Revenue', 'Value': statistics.totalRevenue.toFixed(2) },
    { 'Metric': 'Pending Revenue', 'Value': statistics.pendingRevenue.toFixed(2) },
    { 'Metric': 'Payment Success Rate', 'Value': `${statistics.paymentSuccessRate}%` }
  ];
}

export function createStatusWiseSheets(excelData: any[]) {
  const statusSheets: { [key: string]: any[] } = {};
  const statuses = ['PAID', 'PENDING', 'SUBMITTED', 'VERIFIED'];
  
  statuses.forEach(status => {
    const statusData = excelData.filter(invoice => 
      invoice.Status === getStatusText(status)
    );
    if (statusData.length > 0) {
      statusSheets[`${status} Invoices`] = statusData;
    }
  });
  
  return statusSheets;
}

export function applyColumnFormatting(worksheet: XLSX.WorkSheet, columns: ExcelColumnDefinition[]) {
  worksheet['!cols'] = columns.map(col => ({ wch: col.width }));
  return worksheet;
}

export function generateExcelFilename(dateRange?: { startDate: string; endDate: string }): string {
  let filename = 'invoices_export';
  
  if (dateRange?.startDate && dateRange?.endDate) {
    filename += `_${format(parseISO(dateRange.startDate), 'dd-MM-yyyy')}_to_${format(parseISO(dateRange.endDate), 'dd-MM-yyyy')}`;
  } else {
    filename += `_${format(new Date(), 'dd-MM-yyyy')}`;
  }
  
  return `${filename}.xlsx`;
}

export function exportInvoicesToExcel(
  invoices: InvoiceExportData[], 
  options: ExcelExportOptions = {},
  dateRange?: { startDate: string; endDate: string }
): void {
  try {
    const {
      filename = generateExcelFilename(dateRange),
      includeStatus = true,
      includeSummary = true,
      autoFitColumns = true
    } = options;

    // Prepare data
    const excelData = prepareInvoiceDataForExcel(invoices);
    const statistics = calculateInvoiceStatistics(invoices);

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add summary sheet
    if (includeSummary) {
      const summaryData = createSummarySheet(statistics);
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    }

    // Add main data sheet
    const mainSheet = XLSX.utils.json_to_sheet(excelData);
    
    if (autoFitColumns) {
      applyColumnFormatting(mainSheet, INVOICE_EXCEL_COLUMNS);
    }
    
    XLSX.utils.book_append_sheet(workbook, mainSheet, 'Invoices');

    // Add status-wise sheets
    if (includeStatus) {
      const statusSheets = createStatusWiseSheets(excelData);
      Object.entries(statusSheets).forEach(([sheetName, data]) => {
        const statusSheet = XLSX.utils.json_to_sheet(data);
        if (autoFitColumns) {
          applyColumnFormatting(statusSheet, INVOICE_EXCEL_COLUMNS);
        }
        XLSX.utils.book_append_sheet(workbook, statusSheet, sheetName);
      });
    }

    // Export file
    XLSX.writeFile(workbook, filename);

    return {
      success: true,
      filename,
      recordCount: invoices.length,
      statistics
    };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
}

// Utility function for quick export
export function quickExportInvoices(invoices: InvoiceExportData[]): void {
  exportInvoicesToExcel(invoices, {
    includeSummary: true,
    includeStatus: true,
    autoFitColumns: true
  });
} 