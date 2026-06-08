import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { SupabaseTest } from './SupabaseTest';

const stats = [
  { label: 'Total Employees', value: '31', icon: Users, color: 'bg-blue-500', trend: '+2 this month', trendUp: true },
  { label: 'Active Attendance', value: '28', icon: CalendarCheck, color: 'bg-emerald-500', trend: '90% compliance', trendUp: true },
  { label: 'Total Payroll (Mar)', value: '₱16,308.65', icon: DollarSign, color: 'bg-amber-500', trend: '-5% from Feb', trendUp: false },
  { label: 'Avg Daily Rate', value: '₱475.00', icon: TrendingUp, color: 'bg-purple-500', trend: 'Stable', trendUp: true },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, HR Administrator</p>
      </div>

      <SupabaseTest />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="card p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Payroll Runs</h3>
            <button className="text-brand-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="p-0">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Period</th>
                  <th className="p-4">Employees</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { period: 'Mar 15-21, 2026', count: 31, amount: '₱16,308.65', status: 'Paid' },
                  { period: 'Mar 08-14, 2026', count: 29, amount: '₱15,200.00', status: 'Paid' },
                  { period: 'Mar 01-07, 2026', count: 30, amount: '₱15,850.40', status: 'Paid' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-900">{row.period}</td>
                    <td className="p-4 text-sm text-slate-600">{row.count}</td>
                    <td className="p-4 text-sm font-bold text-slate-900 text-right">{row.amount}</td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Upcoming Tasks</h3>
          </div>
          <div className="p-6 space-y-6">
            {[
              { title: 'Encode Attendance', desc: 'Week of Apr 12-18', time: 'Due in 2 days', color: 'border-amber-500' },
              { title: 'Generate Payroll', desc: 'Week of Apr 05-11', time: 'Ready now', color: 'border-brand-500' },
              { title: 'Submit CRS', desc: 'Accounting Dept', time: 'Pending approval', color: 'border-slate-300' },
            ].map((task, i) => (
              <div key={i} className={`pl-4 border-l-4 ${task.color} space-y-1`}>
                <p className="text-sm font-bold text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500">{task.desc}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                  <Clock size={12} />
                  {task.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
