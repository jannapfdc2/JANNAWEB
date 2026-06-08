import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Employee } from '../types';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    id: '',
    fullName: '',
    title: 'Mr.',
    gender: 'Male',
    birthdate: '',
    civilStatus: 'Single',
    email: '',
    phone: '',
    educationalAttainment: '',
    position: '',
    department: '',
    workLocation: 'Manila',
    dailyRate: 0,
    jobLevel: 'L1',
    hireDate: '',
    employmentStatus: 'Regular',
    recordStatus: 'Active',
    sssNumber: '',
    philHealthNumber: '',
    pagIbigNumber: '',
    tinNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: ''
  });

  useEffect(() => {
    if (isOpen) {
      const fetchNextId = async () => {
        const { data, error } = await supabase
          .from('employees')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (!error && data && data.id) {
          const lastId = data.id; // e.g. "EMP004"
          const numPart = lastId.replace(/\D/g, ''); // "004"
          const nextNum = parseInt(numPart || '0', 10) + 1;
          const nextId = `EMP${nextNum.toString().padStart(3, '0')}`;
          setFormData(prev => ({ ...prev, id: nextId }));
        } else if (!data) {
          setFormData(prev => ({ ...prev, id: 'EMP001' }));
        }
      };

      fetchNextId();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('employees')
      .insert([formData]);

    setLoading(false);

    if (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee: ' + error.message);
    } else {
      setFormData({
        id: '',
        fullName: '',
        title: 'Mr.',
        gender: 'Male',
        birthdate: '',
        civilStatus: 'Single',
        email: '',
        phone: '',
        educationalAttainment: '',
        position: '',
        department: '',
        workLocation: 'Manila',
        dailyRate: 0,
        jobLevel: 'L1',
        hireDate: '',
        employmentStatus: 'Regular',
        recordStatus: 'Active',
        sssNumber: '',
        philHealthNumber: '',
        pagIbigNumber: '',
        tinNumber: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: ''
      });
      onSuccess();
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {/* Basic Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                <input required name="id" value={formData.id} onChange={handleChange} type="text" className="input bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" readOnly placeholder="Auto-generated" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <select name="title" value={formData.title} onChange={handleChange} className="input">
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" className="input" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Birthdate</label>
                <input required name="birthdate" value={formData.birthdate} onChange={handleChange} type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Civil Status</label>
                <select name="civilStatus" value={formData.civilStatus} onChange={handleChange} className="input">
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact & Education */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Contact & Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="input" placeholder="juan@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} type="text" className="input" placeholder="09171234567" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Educational Attainment</label>
                <input required name="educationalAttainment" value={formData.educationalAttainment} onChange={handleChange} type="text" className="input" placeholder="BS Computer Science" />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                <input required name="position" value={formData.position} onChange={handleChange} type="text" className="input" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input required name="department" value={formData.department} onChange={handleChange} type="text" className="input" placeholder="Engineering" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Location</label>
                <select name="workLocation" value={formData.workLocation} onChange={handleChange} className="input">
                  <option value="Manila">Manila</option>
                  <option value="Local">Local</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Daily Rate (₱)</label>
                <input required name="dailyRate" value={formData.dailyRate} onChange={handleChange} type="number" className="input" placeholder="500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Level</label>
                <input required name="jobLevel" value={formData.jobLevel} onChange={handleChange} type="text" className="input" placeholder="L1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hire Date</label>
                <input required name="hireDate" value={formData.hireDate} onChange={handleChange} type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
                <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="input">
                  <option value="Regular">Regular</option>
                  <option value="Probationary">Probationary</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Project-based">Project-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Record Status</label>
                <select name="recordStatus" value={formData.recordStatus} onChange={handleChange} className="input">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Statutory */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Statutory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SSS Number</label>
                <input required name="sssNumber" value={formData.sssNumber} onChange={handleChange} type="text" className="input" placeholder="00-0000000-0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">PhilHealth Number</label>
                <input required name="philHealthNumber" value={formData.philHealthNumber} onChange={handleChange} type="text" className="input" placeholder="00-000000000-0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pag-IBIG Number</label>
                <input required name="pagIbigNumber" value={formData.pagIbigNumber} onChange={handleChange} type="text" className="input" placeholder="0000-0000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">TIN</label>
                <input required name="tinNumber" value={formData.tinNumber} onChange={handleChange} type="text" className="input" placeholder="000-000-000-000" />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} type="text" className="input" placeholder="Maria Dela Cruz" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                <input required name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} type="text" className="input" placeholder="09181234567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                <input required name="emergencyContactRelationship" value={formData.emergencyContactRelationship} onChange={handleChange} type="text" className="input" placeholder="Mother" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
