/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeMaster from './components/EmployeeMaster';
import AttendanceEncoding from './components/AttendanceEncoding';
import ManpowerAllocation from './components/ManpowerAllocation';
import PayrollProcessing from './components/PayrollProcessing';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'employees': return <EmployeeMaster />;
      case 'payroll': return <PayrollProcessing />;
      default: return <Dashboard />;
    }
  };

  return (
    <div id="main-layout" className="min-h-screen bg-slate-50 flex">
      <div className="print:hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main className="flex-1 ml-0 md:ml-64 p-8 min-h-screen print:p-0 print:ml-0 print:overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="print:contents"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>

  );
}
