import React, { useState } from 'react';
import { 
  Save, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  User
} from 'lucide-react';
import { Employee, WeeklyAttendance, AttendanceStatus } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface AttendanceEncodingProps {
  onSave: (attendance: Record<string, WeeklyAttendance>) => void;
  onCancel: () => void;
  initialAttendance?: Record<string, WeeklyAttendance>;
  hideHeader?: boolean;
}

export default function AttendanceEncoding({ onSave, onCancel, initialAttendance = {}, hideHeader = false }: AttendanceEncodingProps) {
  const [weekStart, setWeekStart] = useState('2026-04-12'); // Example Sunday
  const [attendance, setAttendance] = useState<Record<string, WeeklyAttendance>>(initialAttendance);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const employees = MOCK_EMPLOYEES;

  const handleStatusChange = (empId: string, day: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const empAttendance = prev[empId] || {
        employeeId: empId,
        weekStart,
        days: {
          sun: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          mon: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          tue: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          wed: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          thu: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          fri: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
          sat: { date: '', status: '-', hoursWorked: 0, overtimeHours: 0, nightShiftHours: 0 },
        },
        totalDaysWorked: 0,
        totalGrossPay: 0,
        isValidated: false
      };

      const newDays = { ...empAttendance.days, [day]: { ...empAttendance.days[day as keyof typeof empAttendance.days], status } };
      
      // Calculate total days worked
      const totalDays = Object.values(newDays).reduce((acc: number, d: any) => {
        if (d.status === 'X') return acc + 1;
        if (d.status === '1/2') return acc + 0.5;
        return acc;
      }, 0);

      return {
        ...prev,
        [empId]: {
          ...empAttendance,
          days: newDays,
          totalDaysWorked: totalDays
        }
      };
    });
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'X': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case '1/2': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'A': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-400 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Weekly Attendance Encoding</h1>
            <p className="text-slate-500">Employees are auto-loaded from Employee Master Record</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary gap-2" onClick={onCancel}>
              <ChevronLeft size={18} />
              Previous
            </button>
            <button className="btn btn-secondary gap-2">
              Next
              <ChevronRight size={18} />
            </button>
            <button className="btn btn-secondary gap-2" onClick={() => setShowPrintPreview(true)}>
              <Printer size={18} />
              Print
            </button>
            <button 
              className="btn btn-primary gap-2 bg-[#1E1B4B] hover:bg-[#312E81]"
              onClick={() => onSave(attendance)}
            >
              <Save size={18} />
              Save Attendance
            </button>
          </div>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-primary gap-2 bg-[#1E1B4B] hover:bg-[#312E81]"
            onClick={() => onSave(attendance)}
          >
            <Save size={18} />
            Save Attendance
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</label>
          <input type="text" placeholder="Enter project name" className="input text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Week Start (Sunday)</label>
          <input type="date" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} className="input text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Week End (Saturday)</label>
          <input type="date" value="2026-04-18" readOnly className="input text-sm bg-slate-50" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
          <select className="input text-sm">
            <option>Local</option>
            <option>Manila</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search employee..." 
            className="input pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            X Whole Day
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
            ½ Half Day
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
            Absent
          </span>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-12">No.</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-64">Employee</th>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <th key={day} className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">{day}</th>
              ))}
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Days</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp, idx) => {
              const att = attendance[emp.id];
              const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-sm text-slate-500">{idx + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{emp.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{emp.id}</p>
                      </div>
                    </div>
                  </td>
                  {days.map(day => {
                    const status = att?.days[day as keyof typeof att.days]?.status || '-';
                    return (
                      <td key={day} className="p-2 text-center">
                        <select 
                          value={status}
                          onChange={(e) => handleStatusChange(emp.id, day, e.target.value as AttendanceStatus)}
                          className={`w-10 h-10 rounded-lg border text-xs font-bold transition-all appearance-none text-center cursor-pointer focus:ring-2 focus:ring-brand-500/20 ${getStatusColor(status as AttendanceStatus)}`}
                        >
                          <option value="-">-</option>
                          <option value="X">X</option>
                          <option value="1/2">½</option>
                          <option value="A">A</option>
                        </select>
                      </td>
                    );
                  })}
                  <td className="p-4 text-center font-bold text-slate-900">
                    {att?.totalDaysWorked || 0}
                  </td>
                  <td className="p-4 text-center">
                    {att?.totalDaysWorked && att.totalDaysWorked > 0 ? (
                      <CheckCircle2 size={20} className="text-emerald-500 mx-auto" />
                    ) : (
                      <AlertCircle size={20} className="text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Print Preview Modal */}
      <AnimatePresence>
        {showPrintPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Weekly Attendance Print Preview</h2>
                <div className="flex gap-3">
                  <button className="btn btn-primary" onClick={() => window.print()}>Print Now</button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setShowPrintPreview(false)}>
                    <X size={24} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-12 bg-slate-50">
                <div className="bg-white shadow-sm border border-slate-200 p-12 mx-auto max-w-[1000px] min-h-[600px] flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold uppercase">Payroll Management System</h3>
                  <h4 className="text-lg font-bold">Weekly Attendance Sheet</h4>
                  <p className="text-sm text-slate-500 mt-1">Project: ____________________</p>
                  <p className="text-sm text-slate-500">Payroll Period: {weekStart} to 2026-04-18</p>

                  <div className="mt-8 w-full border border-slate-900 overflow-x-auto">
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-900">
                          <th className="border-r border-slate-900 p-1">No.</th>
                          <th className="border-r border-slate-900 p-1">Emp ID</th>
                          <th className="border-r border-slate-900 p-1">Employee Name</th>
                          <th className="border-r border-slate-900 p-1">Nature of Work</th>
                          <th className="border-r border-slate-900 p-1">Rate</th>
                          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                            <th key={d} className="border-r border-slate-900 p-1">{d}</th>
                          ))}
                          <th className="p-1">Days</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp, i) => (
                          <tr key={emp.id} className="border-b border-slate-900">
                            <td className="border-r border-slate-900 p-1">{i + 1}</td>
                            <td className="border-r border-slate-900 p-1">{emp.id}</td>
                            <td className="border-r border-slate-900 p-1 text-left">{emp.fullName}</td>
                            <td className="border-r border-slate-900 p-1">{emp.position}</td>
                            <td className="border-r border-slate-900 p-1">₱{emp.dailyRate}</td>
                            {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(d => (
                              <td key={d} className="border-r border-slate-900 p-1">-</td>
                            ))}
                            <td className="p-1">0</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-12 w-full grid grid-cols-2 gap-24 text-center">
                    <div className="border-t border-slate-900 pt-2">
                      <p className="font-bold uppercase">HR Master</p>
                    </div>
                    <div className="border-t border-slate-900 pt-2">
                      <p className="font-bold uppercase">Department Head</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
