import React from 'react';

export interface PrintEmployeeData {
  employeeName: string;
  employeeId: string;
  position: string;
  dailyRate: number;
  daysWorked: number;
  grossPay: number;
  deductions: {
    sss: number;
    philhealth: number;
    pagibig: number;
    others: number;
  };
  netPay: number;
}

interface RequisitionProps {
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  date: string;
  companyName?: string;
  address?: string;
  requestedBy?: string;
}

export function PrintCashRequisition({ 
  periodStart, 
  periodEnd, 
  totalAmount, 
  date,
  companyName = "SUWECO TABLAS ENERGY CORPORATION",
  address = "Poblacion, Alcantara, Romblon",
  requestedBy = "MARY ROSE BELGA"
}: RequisitionProps) {
  return (
    <div className="w-full max-w-[210mm] mx-auto p-10 bg-white text-black font-sans">
      <div className="border-2 border-black p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold uppercase">{companyName}</h1>
          <p className="text-sm">{address}</p>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-10 uppercase">CASH REQUISITION SLIP</h2>
        
        <div className="flex justify-between mb-8 text-sm">
          <div><span className="font-bold">Charge to:</span> {companyName}</div>
          <div><span className="font-bold">Date:</span> {date}</div>
        </div>
        
        <div className="text-center font-bold mb-16 text-sm">
          Payment for Payroll of Project ({periodStart} to {periodEnd})
        </div>
        
        <div className="flex justify-end mb-32">
          <div className="text-lg font-bold flex items-end">
            <span className="mr-4">Amount Php:</span>
            <span className="border-b border-black px-8">₱{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-12 text-center text-sm">
          <div>
            <div className="font-bold mb-1 uppercase">{requestedBy || '\u00A0'}</div>
            <div className="border-t border-black pt-2">Requested by</div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="border-t border-black pt-2">Noted by</div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="border-t border-black pt-2">Department Head</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PayslipsProps {
  employees: PrintEmployeeData[];
  periodStart: string;
  periodEnd: string;
  payDate: string;
  companyName?: string;
  preparedBy?: string;
}

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export function PrintPayslips({ 
  employees, 
  periodStart, 
  periodEnd, 
  payDate,
  companyName = "SUWECO TABLAS ENERGY CORP. ALCANTARA",
  preparedBy = "MARY ROSE BELGA"
}: PayslipsProps) {
  const pages = chunkArray(employees, 6);

  return (
    <div className="bg-white text-black font-sans text-[9px] leading-tight">
      {pages.map((pageEmployees, pageIndex) => (
        <div key={pageIndex} className="w-[210mm] h-[297mm] mx-auto p-[5mm] break-after-page box-border grid grid-cols-2 grid-rows-3 gap-0 border-2 border-black" style={{ pageBreakAfter: 'always' }}>
          {pageEmployees.map((emp, i) => (
            <div key={emp.employeeId} className="border border-black p-2 flex flex-col justify-between">
              {/* Header */}
              <div className="mb-2">
                <div className="font-bold mb-1">{companyName}</div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Employee Number:</span> <span>{emp.employeeId}</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Payroll Period:</span> <span className="uppercase">{periodStart} to {periodEnd}</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Employee Name:</span> <span className="font-bold">{emp.employeeName}</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Pay Date:</span> <span className="uppercase">{payDate}</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Position:</span> <span>{emp.position}</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold opacity-0">...</span> <span></span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Cost Center:</span> <span>STEC-ALC</span></div>
                  <div className="flex justify-between"><span className="uppercase text-[8px] font-bold">Daily Rate:</span> <span>{emp.dailyRate.toFixed(2)}</span></div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 grid grid-cols-2 gap-2 mt-1">
                {/* Left Column (Work Summary/Earnings) */}
                <div>
                  <table className="w-full text-[8px]">
                    <thead>
                      <tr className="border-b border-black border-dashed">
                        <th className="text-left font-normal italic w-1/2"></th>
                        <th className="text-right font-normal italic underline px-1">Days</th>
                        <th className="text-right font-normal italic underline px-1">In Hours</th>
                        <th className="text-right font-normal italic underline">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>No. of days worked</td>
                        <td className="text-right px-1">{emp.daysWorked.toFixed(2)}</td>
                        <td className="text-right px-1">{(emp.daysWorked * 8).toFixed(2)}</td>
                        <td className="text-right">{emp.grossPay.toFixed(2)}</td>
                      </tr>
                      <tr><td>Tardiness</td><td className="text-right px-1">-</td><td className="text-right px-1">-</td><td className="text-right">-</td></tr>
                      <tr><td>Undertime</td><td className="text-right px-1">-</td><td className="text-right px-1">-</td><td className="text-right">-</td></tr>
                      <tr><td>Night Differential</td><td className="text-right px-1">-</td><td className="text-right px-1">-</td><td className="text-right">-</td></tr>
                    </tbody>
                  </table>

                  <div className="mt-2 text-[8px] font-bold uppercase border-b border-black border-dashed mb-1">Overtime Pay</div>
                  <table className="w-full text-[8px]">
                    <tbody>
                      <tr><td className="w-1/2">Regular days</td><td className="text-right">-</td></tr>
                      <tr><td>Rest days</td><td className="text-right">-</td></tr>
                      <tr><td>Regular holidays</td><td className="text-right">-</td></tr>
                      <tr><td>Special holiday</td><td className="text-right">-</td></tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Column (Others/Deductions) */}
                <div>
                  <table className="w-full text-[8px]">
                    <thead>
                      <tr className="border-b border-black border-dashed">
                        <th className="text-left font-normal uppercase">Others</th>
                        <th className="text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="w-1/2">Deminimis</td><td className="text-right">-</td></tr>
                      <tr><td>Other allowance</td><td className="text-right">-</td></tr>
                      <tr><td>Adjustments (+)</td><td className="text-right">-</td></tr>
                      <tr><td>Adjustments (-)</td><td className="text-right">-</td></tr>
                    </tbody>
                  </table>

                  <div className="flex justify-between font-bold mt-1 mb-1 border-t border-black pt-0.5">
                    <span>GROSS PAY</span>
                    <span>{emp.grossPay.toFixed(2)}</span>
                  </div>

                  <div className="mt-1 text-[8px] font-bold uppercase border-b border-black border-dashed mb-1">Deductions</div>
                  <table className="w-full text-[8px]">
                    <tbody>
                      <tr><td className="w-1/2">Withholding tax</td><td className="text-right">-</td></tr>
                      <tr><td>SSS</td><td className="text-right">{emp.deductions.sss ? emp.deductions.sss.toFixed(2) : '-'}</td></tr>
                      <tr><td>Philhealth</td><td className="text-right">{emp.deductions.philhealth ? emp.deductions.philhealth.toFixed(2) : '-'}</td></tr>
                      <tr><td>Pag-ibig</td><td className="text-right">{emp.deductions.pagibig ? `(${emp.deductions.pagibig.toFixed(2)})` : '-'}</td></tr>
                      <tr><td>Others</td><td className="text-right">{emp.deductions.others ? `(${emp.deductions.others.toFixed(2)})` : '-'}</td></tr>
                    </tbody>
                  </table>
                  
                  <div className="flex justify-between mt-1 pt-1 border-t border-black border-dashed">
                    <span className="uppercase">Total Deduction</span>
                    <span>{
                      (emp.deductions.sss + emp.deductions.philhealth + emp.deductions.pagibig + emp.deductions.others) > 0 
                      ? `(${(emp.deductions.sss + emp.deductions.philhealth + emp.deductions.pagibig + emp.deductions.others).toFixed(2)})` 
                      : '-'
                    }</span>
                  </div>
                </div>
              </div>

              {/* Totals & Footer */}
              <div className="mt-2 text-[8px]">
                <div className="flex justify-between font-bold border-t border-b border-black py-1 mb-2 text-[9px]">
                  <div className="flex-1 text-center">TOTAL</div>
                  <div className="flex-1 text-center">{emp.grossPay.toFixed(2)}</div>
                  <div className="flex-1 text-center">NETPAY</div>
                  <div className="flex-1 text-center text-red-600">{emp.netPay.toFixed(2)}</div>
                </div>

                <div className="text-center italic mb-4">Received the amount shown above in full settlement.</div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="uppercase font-bold mb-1 border-b border-black pb-1">{preparedBy || '\u00A0'}</div>
                    <div className="text-[7px]">PREPARED BY / DATE</div>
                  </div>
                  <div className="text-center">
                    <div className="uppercase font-bold mb-1 border-b border-black pb-1">{emp.employeeName}</div>
                    <div className="text-[7px]">SIGNATURE / DATE</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Fill empty spots in grid if the last page has less than 6 employees */}
          {Array.from({ length: 6 - pageEmployees.length }).map((_, i) => (
            <div key={`empty-${i}`} className="border border-black p-2 flex flex-col justify-between"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
