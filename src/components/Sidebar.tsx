import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Briefcase, 
  History, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employee', icon: Users },
  { id: 'payroll', label: 'Payroll History', icon: History },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-[#0F172A] text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          P
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Payroll</h1>
          <p className="text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {isActive && (
                <motion.div layoutId="active-pill">
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all group">
          <LogOut size={20} className="text-slate-400 group-hover:text-red-400" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
