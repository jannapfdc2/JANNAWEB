-- Run this in your Supabase SQL Editor

CREATE TABLE public.employees (
    id text PRIMARY KEY,
    "fullName" text NOT NULL,
    title text,
    gender text,
    birthdate date,
    "civilStatus" text,
    email text,
    phone text,
    "educationalAttainment" text,
    position text,
    department text,
    "workLocation" text,
    "dailyRate" numeric(10,2),
    "jobLevel" text,
    "hireDate" date,
    "employmentStatus" text,
    "recordStatus" text,
    "sssNumber" text,
    "philHealthNumber" text,
    "pagIbigNumber" text,
    "tinNumber" text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    "emergencyContactRelationship" text
);

-- Insert the initial mock data
INSERT INTO public.employees 
(id, "fullName", title, gender, birthdate, "civilStatus", email, phone, "educationalAttainment", position, department, "workLocation", "dailyRate", "jobLevel", "hireDate", "employmentStatus", "recordStatus", "sssNumber", "philHealthNumber", "pagIbigNumber", "tinNumber", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship")
VALUES 
('EMP001', 'Janna Patricia De Claro', 'Ms.', 'Female', '1995-05-15', 'Single', 'jpdeclaro@suweco.ph', '691235456', 'Bachelor of Science in Accountancy', 'SHFSH', 'SBFISBIS', 'Manila', 435.5, 'L1', '2020-01-10', 'Regular', 'Active', '34-1234567-8', '12-987654321-0', '1210-4567-8901', '123-456-789-000', 'Maria De Claro', '09171234567', 'Mother'),
('EMP002', 'Marianne Pangilinan Puda', 'Ms.', 'Female', '1996-08-20', 'Single', 'mpuda@suweco.ph', '9677887728', 'BS Civil Engineering', 'Project Engineer', 'Engineering', 'Local', 475, 'L2', '2021-03-15', 'Regular', 'Active', '34-8765432-1', '12-123456789-0', '1210-0987-6543', '987-654-321-000', 'Ricardo Puda', '09187654321', 'Father'),
('EMP003', 'Mae Ann Sotto Bodiongan', 'Ms.', 'Female', '1994-11-12', 'Married', 'mabodiongan@suweco.ph', '9677887728', 'BS Business Administration', 'Project Coordinator', 'Engineering', 'Manila', 475, 'L2', '2019-06-01', 'Regular', 'Active', '34-5556667-8', '12-444333222-1', '1210-1112-2223', '444-555-666-000', 'John Bodiongan', '09191112223', 'Husband'),
('EMP004', 'STEVEN TOLEDO', 'Mr.', 'Male', '1990-01-01', 'Married', 'stec@gmail.com', '666161616', 'BS Management', 'DPM', 'ENGINEERING', 'Manila', 1000, 'L5', '2015-01-01', 'Regular', 'Active', '34-0000000-0', '12-000000000-0', '1210-0000-0000', '000-000-000-000', 'Jane Toledo', '09111111111', 'Wife');

-- Create a policy that allows all operations (for testing purposes only)
-- Depending on your RLS settings, you might need:
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow anon insert access" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update access" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete access" ON public.employees FOR DELETE USING (true);
