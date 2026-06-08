import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  ChevronRight,
  Download,
  CalendarCheck,
  Briefcase,
  Calculator,
  Printer
} from 'lucide-react';
import { PayrollRecord, WeeklyAttendance } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import AttendanceEncoding from './AttendanceEncoding';
import ManpowerAllocation from './ManpowerAllocation';
import { PrintCashRequisition, PrintPayslips, PrintEmployeeData } from './PrintViews';

const MOCK_PRINT_EMPLOYEES: PrintEmployeeData[] = [
  { employeeName: "ESPARAGOZA, ROWENA", employeeId: "6010007", position: "TIMEKEEPER", dailyRate: 455, daysWorked: 4, grossPay: 1820, deductions: { sss: 0, philhealth: 0, pagibig: 100, others: 0 }, netPay: 1720 },
  { employeeName: "GALLOS, BERNE", employeeId: "60100028", position: "OPERATOR HEO", dailyRate: 650, daysWorked: 1, grossPay: 650, deductions: { sss: 0, philhealth: 0, pagibig: 0, others: 0 }, netPay: 650 },
  { employeeName: "FABELLO, RALPH JOHN", employeeId: "60100042", position: "SKILLED WORKER", dailyRate: 475, daysWorked: 4, grossPay: 1900, deductions: { sss: 0, philhealth: 258.28, pagibig: 100, others: 0 }, netPay: 1541.72 },
  { employeeName: "MASUNGCA, JULIE", employeeId: "601000101", position: "COMMON LABORER", dailyRate: 475, daysWorked: 4, grossPay: 1900, deductions: { sss: 0, philhealth: 0, pagibig: 100, others: 0 }, netPay: 1800 },
  { employeeName: "MANGAO, DREG", employeeId: "601000120", position: "SKILLED WORKER", dailyRate: 475, daysWorked: 4, grossPay: 1900, deductions: { sss: 0, philhealth: 0, pagibig: 100, others: 0 }, netPay: 1800 },
  { employeeName: "GALA, LEONARD", employeeId: "05240015", position: "DUMP TRUCK DRIVER", dailyRate: 500, daysWorked: 4, grossPay: 2000, deductions: { sss: 0, philhealth: 0, pagibig: 100, others: 0 }, netPay: 1900 },
  { employeeName: "DE CLARO, JANNA PATRICIA", employeeId: "601000188", position: "HR ASSISTANT", dailyRate: 500, daysWorked: 5, grossPay: 2500, deductions: { sss: 0, philhealth: 0, pagibig: 100, others: 0 }, netPay: 2400 }
];

const MOCK_PAYROLLS: PayrollRecord[] = [
  {
    id: 'PR-2026-001',
    periodStart: '2026-03-15',
    periodEnd: '2026-03-21',
    dateGenerated: '2026-03-25',
    totalEmployees: 31,
    totalGrossPay: 16308.65,
    status: 'Generated'
  }
];

type ViewState = 'history' | 'attendance' | 'allocation';

export default function PayrollProcessing() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(MOCK_PAYROLLS);
  const [view, setView] = useState<ViewState>('history');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [attendanceData, setAttendanceData] = useState<Record<string, WeeklyAttendance>>({});
  const [isAttendanceSaved, setIsAttendanceSaved] = useState(false);
  const [printMode, setPrintMode] = useState<'none' | 'requisition' | 'payslips'>('none');
  const [preparedBy, setPreparedBy] = useState('MARY ROSE BELGA');

  const generatedPrintEmployees: PrintEmployeeData[] = Object.values(attendanceData).map((record: any) => {
    const defaultEmp = MOCK_EMPLOYEES[0];
    const emp = MOCK_EMPLOYEES.find(e => e.id === record.employeeId) || defaultEmp;
    
    // Simplistic deduction logic based on gross pay
    const grossPay = record.totalGrossPay;
    const sss = grossPay > 1000 ? grossPay * 0.045 : 0;
    const philhealth = grossPay > 1000 ? grossPay * 0.04 : 0;
    const pagibig = 100; // Fixed mock deduction
    const others = 0;
    
    const totalDeductions = sss + philhealth + pagibig + others;
    const netPay = grossPay - totalDeductions;
    
    return {
      employeeName: emp.fullName.toUpperCase(),
      employeeId: emp.id,
      position: emp.position.toUpperCase(),
      dailyRate: emp.dailyRate,
      daysWorked: record.totalDaysWorked,
      grossPay: grossPay,
      deductions: { sss, philhealth, pagibig, others },
      netPay: netPay
    };
  });

  const totalCalculatedGrossPay = generatedPrintEmployees.reduce((sum, emp) => sum + emp.grossPay, 0);

  useEffect(() => {
    if (printMode !== 'none') {
      const timer = setTimeout(() => {
        // window.print() might be blocked in sandboxed iframes, 
        // so we don't automatically close the view. 
        // Users can use the floating "Close" button.
        window.print();
      }, 500);
      
      const handleAfterPrint = () => setPrintMode('none');
      window.addEventListener('afterprint', handleAfterPrint);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }
  }, [printMode]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      setPayrolls(prev => prev.filter(p => p.id !== id));
      if (selectedRecordId === id) setSelectedRecordId(null);
    }
  };

  const handleSaveAttendance = (data: Record<string, WeeklyAttendance>) => {
    setAttendanceData(data);
    setIsAttendanceSaved(true);
    
    // Create a new record in history with 'Not Generated' status
    const newId = `PR-2026-${(payrolls.length + 1).toString().padStart(3, '0')}`;
    const newRecord: PayrollRecord = {
      id: newId,
      periodStart: '2026-04-12',
      periodEnd: '2026-04-18',
      dateGenerated: '-',
      totalEmployees: Object.keys(data).length || 4,
      totalGrossPay: 0,
      status: 'Not Generated'
    };
    
    setPayrolls([newRecord, ...payrolls]);
    setSelectedRecordId(newId);
    setView('history');
  };

  const handleSaveAllocation = (data: Record<string, WeeklyAttendance>) => {
    setAttendanceData(data);
    setView('history');
  };

  const totalEmployees = Object.keys(attendanceData).length > 0 ? Object.keys(attendanceData).length : 4;
  const totalDaysWorked: number = Object.values(attendanceData).length > 0 
    ? (Object.values(attendanceData) as WeeklyAttendance[]).reduce((acc: number, curr: WeeklyAttendance) => acc + curr.totalDaysWorked, 0)
    : 24.5;

  const handleGeneratePayroll = () => {
    setIsGenerating(true);
    setStep(1);
  };

  const finalizePayroll = () => {
    setPayrolls(prev => prev.map(p => {
      if (p.id === selectedRecordId) {
        return {
          ...p,
          dateGenerated: new Date().toISOString().split('T')[0],
          totalGrossPay: totalCalculatedGrossPay,
          status: 'Generated'
        };
      }
      return p;
    }));
    setStep(3);
  };

  return (
    <>
      <div className={`space-y-6 ${printMode !== 'none' ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Payroll History & Processing</h1>
            <p className="text-slate-500">Manage attendance, allocation, and payroll generation</p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedRecordId && (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`btn btn-primary gap-2 bg-[#1E1B4B] hover:bg-[#312E81] shadow-lg shadow-brand-600/20 transition-all ${
                    !isAttendanceSaved ? 'opacity-50 cursor-not-allowed grayscale' : ''
                  }`}
                  onClick={handleGeneratePayroll}
                  disabled={!isAttendanceSaved}
                >
                  <Calculator size={20} />
                  Generate Payroll
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isGenerating ? (
        <div className="space-y-6">
          {/* Generation Wizard (same as before) */}
          <div className="card p-6">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {[
                { s: 1, l: 'Review Calculations', d: 'Calculate earnings from attendance' },
                { s: 2, l: 'Earnings & Deductions', d: 'Review computed amounts' },
                { s: 3, l: 'Finalize & Request', d: 'Generate cash requisition slip' }
              ].map((item, i) => (
                <React.Fragment key={item.s}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step === item.s ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 
                      step > item.s ? 'bg-emerald-50 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > item.s ? <CheckCircle2 size={20} /> : item.s}
                    </div>
                    <div className="hidden md:block">
                      <p className={`text-sm font-bold leading-tight ${step === item.s ? 'text-brand-600' : 'text-slate-500'}`}>{item.l}</p>
                      <p className="text-[10px] text-slate-400">{item.d}</p>
                    </div>
                  </div>
                  {i < 2 && <ArrowRight className="text-slate-200" size={20} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-8 max-w-4xl mx-auto space-y-8"
          >
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Generate Payroll</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-brand-50 border border-brand-100 rounded-xl">
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">Payroll Period</p>
                    <p className="text-xl font-bold text-brand-900">2026-04-12 to 2026-04-18</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Employees</p>
                    <p className="text-xl font-bold text-slate-900">{totalEmployees}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attendance Records</p>
                    <p className="text-xl font-bold text-slate-900">{totalEmployees}</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Days Worked</p>
                    <p className="text-xl font-bold text-slate-900">{totalDaysWorked}</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                  <button className="btn btn-secondary" onClick={() => setIsGenerating(false)}>Cancel</button>
                  <button className="btn btn-primary bg-[#1E1B4B] hover:bg-[#312E81]" onClick={() => setStep(2)}>Review Earnings</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Earnings & Deductions Review</h2>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-3 font-bold text-slate-600">Employee</th>
                        <th className="p-3 font-bold text-slate-600 text-right">Gross Pay</th>
                        <th className="p-3 font-bold text-slate-600 text-right">SSS</th>
                        <th className="p-3 font-bold text-slate-600 text-right">PhilHealth</th>
                        <th className="p-3 font-bold text-slate-600 text-right">Pag-IBIG</th>
                        <th className="p-3 font-bold text-slate-600 text-right">Net Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {generatedPrintEmployees.map(emp => (
                        <tr key={emp.employeeId}>
                          <td className="p-3 font-medium">{emp.employeeName}</td>
                          <td className="p-3 text-right">₱{emp.grossPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="p-3 text-right">₱{emp.deductions.sss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="p-3 text-right">₱{emp.deductions.philhealth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="p-3 text-right">₱{emp.deductions.pagibig.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="p-3 text-right font-bold text-brand-600">₱{emp.netPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <button className="btn btn-ghost gap-2" onClick={() => setStep(1)}>Back</button>
                  <div className="flex gap-3">
                    <button className="btn btn-secondary gap-2">
                      <Download size={18} />
                      Export Register
                    </button>
                    <button className="btn btn-primary bg-[#1E1B4B] hover:bg-[#312E81]" onClick={finalizePayroll}>Finalize & Request Payment</button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Payroll Finalized!</h2>
                  <p className="text-slate-500">The payroll record has been created and is ready for payment requisition.</p>
                </div>
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <div className="text-left bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Prepared By (For Printing)</label>
                    <input 
                      type="text" 
                      className="input w-full uppercase" 
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      placeholder="Enter name..."
                    />
                  </div>
                  
                  <button className="btn btn-primary gap-2 mt-2" onClick={() => setPrintMode('requisition')}>
                    <FileText size={18} />
                    Print Cash Requisition Slip
                  </button>
                  <button className="btn btn-secondary gap-2" onClick={() => setPrintMode('payslips')}>
                    <FileText size={18} />
                    Print All Payslips
                  </button>
                  <button className="btn btn-ghost mt-4" onClick={() => {
                    setIsGenerating(false);
                    setStep(1);
                  }}>Return to Payroll History</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('history')}
                  className={`text-sm font-bold transition-all ${
                    view === 'history' ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Payroll History
                </button>
              </div>
              
              <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setView('attendance')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${
                    view === 'attendance' 
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <CalendarCheck size={14} />
                  Attendance
                </button>
                <button 
                  onClick={() => isAttendanceSaved && setView('allocation')}
                  disabled={!isAttendanceSaved}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${
                    !isAttendanceSaved ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    view === 'allocation' 
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Briefcase size={14} />
                  Manpower
                </button>
              </div>
            </div>

            <div className="p-0">
              {view === 'history' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payroll Period</th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Generated</th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Employees</th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total Gross Pay</th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {payrolls.map((p) => (
                        <tr 
                          key={p.id} 
                          onClick={() => setSelectedRecordId(p.id === selectedRecordId ? null : p.id)}
                          className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${
                            selectedRecordId === p.id ? 'bg-brand-50/50 ring-1 ring-inset ring-brand-200' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText size={16} className={selectedRecordId === p.id ? 'text-brand-600' : 'text-brand-500'} />
                              <span className={`font-bold ${selectedRecordId === p.id ? 'text-brand-700' : 'text-slate-900'}`}>
                                {p.periodStart} to {p.periodEnd}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.id}</p>
                          </td>
                          <td className="p-4 text-sm text-slate-600">{p.dateGenerated}</td>
                          <td className="p-4 text-sm text-slate-600 text-center font-medium">{p.totalEmployees}</td>
                          <td className="p-4 text-sm font-bold text-slate-900 text-right">₱{p.totalGrossPay.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.status === 'Generated' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-slate-200">
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(p.id);
                                }}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {view === 'attendance' && (
                <div className="p-6">
                  <AttendanceEncoding 
                    onSave={handleSaveAttendance} 
                    onCancel={() => setView('history')} 
                    initialAttendance={attendanceData}
                    hideHeader={true}
                  />
                </div>
              )}

              {view === 'allocation' && (
                <div className="p-6">
                  <ManpowerAllocation 
                    attendance={attendanceData} 
                    onSave={handleSaveAllocation} 
                    onCancel={() => setView('history')} 
                    hideHeader={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {printMode !== 'none' && (
        <div className="fixed inset-0 z-[9999] bg-slate-50 overflow-auto">
          <div className="print:hidden fixed top-4 right-4 flex gap-3 z-[10000]">
            <button className="btn btn-secondary shadow-lg bg-white" onClick={() => setPrintMode('none')}>
              Close Preview
            </button>
            <button className="btn btn-primary shadow-lg" onClick={() => window.print()}>
              <Printer size={18} className="mr-2" />
              Print Now
            </button>
          </div>
          
          <div className="py-8">
            {printMode === 'requisition' && (
              <PrintCashRequisition 
                periodStart="2026-04-12" 
                periodEnd="2026-04-18" 
                totalAmount={totalCalculatedGrossPay} 
                date={new Date().toISOString().split('T')[0]} 
                requestedBy={preparedBy}
              />
            )}
            {printMode === 'payslips' && (
              <PrintPayslips 
                employees={generatedPrintEmployees.length > 0 ? generatedPrintEmployees : MOCK_PRINT_EMPLOYEES} 
                periodStart="2026-04-12" 
                periodEnd="2026-04-18" 
                payDate="2026-04-20"
                preparedBy={preparedBy}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
