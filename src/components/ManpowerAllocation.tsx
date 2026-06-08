import React, { useState } from 'react';
import { 
  RefreshCw, 
  Printer, 
  ChevronDown,
  Activity,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { Employee, WeeklyAttendance } from '../types';
import { MOCK_EMPLOYEES, ACTIVITY_CODES as TASK_CODES } from '../constants';

interface ManpowerAllocationProps {
  attendance: Record<string, WeeklyAttendance>;
  onSave: (attendance: Record<string, WeeklyAttendance>) => void;
  onCancel: () => void;
  hideHeader?: boolean;
}

export default function ManpowerAllocation({ attendance, onSave, onCancel, hideHeader = false }: ManpowerAllocationProps) {
  const [localAttendance, setLocalAttendance] = useState<Record<string, WeeklyAttendance>>(attendance);
  
  const handleTaskCodeChange = (empId: string, day: string, taskCode: string) => {
    setLocalAttendance(prev => {
      const empAtt = prev[empId];
      if (!empAtt) return prev;

      const newDays = { 
        ...empAtt.days, 
        [day]: { ...empAtt.days[day as keyof typeof empAtt.days], taskCode } 
      };

      return {
        ...prev,
        [empId]: { ...empAtt, days: newDays }
      };
    });
  };

  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Manpower Allocation</h1>
            <p className="text-slate-500">Weekly labor allocation per activity</p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary gap-2" onClick={onCancel}>
              Previous
            </button>
            <button className="btn btn-secondary gap-2">
              <Printer size={18} />
              Print Summary
            </button>
            <button 
              className="btn btn-primary bg-[#1E1B4B] hover:bg-[#312E81]"
              onClick={() => onSave(localAttendance)}
            >
              Save Allocation
            </button>
          </div>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end mb-4">
          <button 
            className="btn btn-primary bg-[#1E1B4B] hover:bg-[#312E81]"
            onClick={() => onSave(localAttendance)}
          >
            Save Allocation
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Cost</p>
            <p className="text-2xl font-bold text-slate-900">₱2,612.50</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allocated Cost</p>
            <p className="text-2xl font-bold text-slate-900">₱2,612.50</p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Variance</p>
            <p className="text-2xl font-bold text-slate-900">₱0.00</p>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee</th>
              <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Est. Net Pay</th>
              {dayLabels.map(day => (
                <th key={day} className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_EMPLOYEES.map((emp) => {
              const empAtt = localAttendance[emp.id];
              const estNetPay = (empAtt?.totalDaysWorked || 0) * emp.dailyRate;
              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-900 leading-tight">{emp.fullName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{emp.id}</p>
                  </td>
                  <td className="p-4 text-right font-bold text-brand-600">
                    ₱{estNetPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  {days.map(day => {
                    const dayData = empAtt?.days[day as keyof typeof empAtt.days];
                    const status = dayData?.status || '-';
                    const taskCode = dayData?.taskCode || '';
                    
                    return (
                      <td key={day} className="p-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            status === 'X' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            status === '1/2' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            status === 'A' ? 'bg-red-50 text-red-700 border-red-100' :
                            'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                            {status}
                          </span>
                          <div className="relative inline-block">
                            <select 
                              className="input text-[10px] font-bold py-0.5 pr-6 appearance-none min-w-[50px] text-center"
                              value={taskCode}
                              onChange={(e) => handleTaskCodeChange(emp.id, day, e.target.value)}
                              disabled={status === '-' || status === 'A'}
                            >
                              <option value="">-</option>
                              {TASK_CODES.map(act => (
                                <option key={act.code} value={act.code}>{act.code}</option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-bold text-slate-900">Allocation Summary per Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity</th>
                {days.map(day => (
                  <th key={day} className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">{day}</th>
                ))}
                <th className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TASK_CODES.map(act => (
                <tr key={act.code}>
                  <td className="p-3 text-sm font-medium text-slate-700">{act.name} ({act.code})</td>
                  {days.map(day => (
                    <td key={day} className="p-3 text-sm text-slate-500 text-center">₱0.00</td>
                  ))}
                  <td className="p-3 text-sm font-bold text-slate-900 text-right">₱0.00</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="p-3 text-sm text-slate-900">TOTAL</td>
                {days.map(day => (
                  <td key={day} className="p-3 text-sm text-slate-900 text-center">₱0.00</td>
                ))}
                <td className="p-3 text-sm text-slate-900 text-right">₱0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
