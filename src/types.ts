export type Gender = 'Male' | 'Female' | 'Other';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';
export type EmploymentStatus = 'Regular' | 'Probationary' | 'Contractual' | 'Project-based';
export type RecordStatus = 'Active' | 'Inactive';
export type WorkLocation = 'Manila' | 'Local';

export interface Employee {
  id: string;
  fullName: string;
  title: string;
  gender: Gender;
  birthdate: string;
  civilStatus: CivilStatus;
  email: string;
  phone: string;
  educationalAttainment: string;
  position: string;
  department: string;
  workLocation: WorkLocation;
  dailyRate: number;
  jobLevel: string;
  hireDate: string;
  employmentStatus: EmploymentStatus;
  recordStatus: RecordStatus;
  
  // Statutory
  sssNumber: string;
  philHealthNumber: string;
  pagIbigNumber: string;
  tinNumber: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
}

export type AttendanceStatus = 'X' | '1/2' | 'A' | '-'; // X=Whole, 1/2=Half, A=Absent, -=No Record

export interface DailyAttendance {
  date: string;
  status: AttendanceStatus;
  hoursWorked: number;
  overtimeHours: number;
  nightShiftHours: number;
  taskCode?: string; // Added for Manpower Allocation
}

export interface WeeklyAttendance {
  employeeId: string;
  weekStart: string; // Sunday
  days: {
    sun: DailyAttendance;
    mon: DailyAttendance;
    tue: DailyAttendance;
    wed: DailyAttendance;
    thu: DailyAttendance;
    fri: DailyAttendance;
    sat: DailyAttendance;
  };
  totalDaysWorked: number;
  totalGrossPay: number;
  isValidated: boolean;
}

export interface ManpowerAllocation {
  employeeId: string;
  date: string;
  activityCode: string; // e.g., 'M' for Mobilization, 'TF' for Temporary Facilities
  hours: number;
  cost: number;
}

export type PayrollStatus = 'Not Generated' | 'Generated';

export interface PayrollRecord {
  id: string;
  periodStart: string;
  periodEnd: string;
  dateGenerated: string;
  totalEmployees: number;
  totalGrossPay: number;
  status: PayrollStatus;
}
