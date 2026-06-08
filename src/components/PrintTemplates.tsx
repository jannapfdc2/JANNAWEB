import React from 'react';
import { Employee, PayrollRecord } from '../types';

export const AttendanceSummaryReport = ({ employees, weekStart }: { employees: Employee[], weekStart: string }) => (
  <div className="p-12 text-slate-900 bg-white font-sans">
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold uppercase">SUWECO TABLAS ENERGY CORPORATION</h1>
      <p className="text-sm">Weekly Attendance Summary</p>
      <p className="text-sm font-bold">Period: {weekStart} to 2026-04-18</p>
    </div>
    <table className="w-full border-collapse border border-slate-900 text-[10px]">
      <thead>
        <tr className="bg-slate-100">
          <th className="border border-slate-900 p-1">No.</th>
          <th className="border border-slate-900 p-1">Name</th>
          <th className="border border-slate-900 p-1">Position</th>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
            <th key={d} className="border border-slate-900 p-1">{d}</th>
          ))}
          <th className="border border-slate-900 p-1">Total Days</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp, i) => (
          <tr key={emp.id}>
            <td className="border border-slate-900 p-1 text-center">{i + 1}</td>
            <td className="border border-slate-900 p-1">{emp.fullName}</td>
            <td className="border border-slate-900 p-1">{emp.position}</td>
            {[...Array(7)].map((_, j) => (
              <td key={j} className="border border-slate-900 p-1 text-center">-</td>
            ))}
            <td className="border border-slate-900 p-1 text-center">0</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const CashRequisitionSlip = ({ payroll }: { payroll: PayrollRecord }) => (
  <div className="p-12 max-w-[800px] mx-auto border-2 border-slate-900 text-slate-900 bg-white font-serif">
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl">S</div>
        <div>
          <h1 className="text-xl font-bold leading-tight">SUWECO</h1>
          <p className="text-[10px] uppercase tracking-tighter">TABLAS ENERGY CORPORATION</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold italic">CASH REQUISITION SLIP</h2>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-y-4 mb-8">
      <div className="flex gap-2">
        <span className="font-bold">Charge to:</span>
        <span className="border-b border-slate-900 flex-1">SUWECO TABLAS ENERGY CORPORATION</span>
      </div>
      <div className="flex gap-2 justify-end">
        <span className="border-b border-slate-900 px-4">{payroll.dateGenerated}</span>
      </div>
      <div className="col-span-2 flex gap-2">
        <span className="font-bold">PARTICULARS:</span>
        <div className="flex-1 border-b border-slate-900">
          Payment for Payroll of Alcantara DPP ({payroll.periodStart} to {payroll.periodEnd})
        </div>
      </div>
    </div>

    <div className="flex justify-end items-center gap-4 mb-12">
      <span className="font-bold text-lg">Amount Php:</span>
      <div className="border-b-4 border-double border-slate-900 px-8 py-1 text-xl font-bold">
        {payroll.totalGrossPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8 text-center text-xs">
      <div className="space-y-8">
        <div className="border-b border-slate-900 pb-1 font-bold">MARY ROSE BELGA</div>
        <p className="font-bold uppercase">Finance Head</p>
      </div>
      <div className="space-y-8">
        <div className="border-b border-slate-900 pb-1 font-bold">STEVEN JAY TOLEDO</div>
        <p className="font-bold uppercase">SEVP</p>
      </div>
      <div className="space-y-8">
        <div className="border-b border-slate-900 pb-1 font-bold">JONATHAN IAN SINGIAN</div>
        <p className="font-bold uppercase">President/ CEO</p>
      </div>
    </div>
  </div>
);
