-- =================================================================
-- VitalSync HMS - Cloud PostgreSQL Database Schema (Multi-Tenant)
-- Run this in Supabase Dashboard -> SQL Editor -> Click 'Run'
-- =================================================================

-- 1. Create Tenants Table (Hospital Accounts)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit_name VARCHAR(255) NOT NULL,
    tagline TEXT,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    plan VARCHAR(100) DEFAULT 'standard_hospital',
    plan_label VARCHAR(255) DEFAULT 'Standard Hospital Care (20 Beds)',
    bed_capacity INTEGER DEFAULT 20,
    status VARCHAR(50) DEFAULT 'Active',
    renewal_date DATE NOT NULL,
    monthly_fee NUMERIC(12,2) DEFAULT 22500,
    currency VARCHAR(10) DEFAULT 'INR',
    logo_badge VARCHAR(100),
    primary_color VARCHAR(50) DEFAULT 'teal',
    modules JSONB NOT NULL DEFAULT '{"opd": true, "ipd": true, "pharmacy": true, "laboratory": true, "doctors": true, "services": true, "blood_bank": false, "accounts": false, "reports": false, "admin": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Users / Staff Table (With 2-Step Approval Gate)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL, -- 'cmo', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'lab_tech', 'cashier'
    role_label VARCHAR(100) NOT NULL,
    department VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED'
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mr_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(50),
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hospital_id, mr_id)
);

-- 4. Create OPD Tokens Queue Table
CREATE TABLE IF NOT EXISTS opd_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_number INTEGER NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Waiting', -- 'Waiting', 'In Consultation', 'Completed', 'Cancelled'
    consultation_fee NUMERIC(10,2) DEFAULT 500,
    vitals_bp VARCHAR(20),
    vitals_pulse INTEGER,
    vitals_temp NUMERIC(5,2),
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create IPD Inpatient Admissions Table (20-50 Beds)
CREATE TABLE IF NOT EXISTS ipd_admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_no VARCHAR(50) NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    ward_name VARCHAR(100) NOT NULL,
    bed_number VARCHAR(50) NOT NULL,
    attending_doctor VARCHAR(255) NOT NULL,
    diagnosis TEXT,
    status VARCHAR(50) DEFAULT 'Admitted', -- 'Admitted', 'Discharged', 'Transferred'
    admitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    discharged_at TIMESTAMP WITH TIME ZONE,
    advance_paid NUMERIC(12,2) DEFAULT 0,
    total_bill NUMERIC(12,2) DEFAULT 0,
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, ip_no)
);

-- 6. Create Blood Units Inventory Table
CREATE TABLE IF NOT EXISTS blood_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bag_barcode VARCHAR(100) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    component VARCHAR(100) NOT NULL,
    volume_ml INTEGER DEFAULT 350,
    status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Reserved', 'Transfused', 'Expired'
    storage_location VARCHAR(255) NOT NULL,
    collection_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    donor_name VARCHAR(255),
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE(hospital_id, bag_barcode)
);

-- 7. Create Voluntary Blood Donors Table
CREATE TABLE IF NOT EXISTS blood_donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_number VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    age INTEGER NOT NULL,
    weight_kg NUMERIC(5,2) NOT NULL,
    hemoglobin NUMERIC(4,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Eligible',
    last_donation DATE,
    emergency_consent BOOLEAN DEFAULT TRUE,
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hospital_id, donor_number)
);

-- 8. Create Billing Invoices Table
CREATE TABLE IF NOT EXISTS bill_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL,
    discount NUMERIC(12,2) DEFAULT 0,
    tax NUMERIC(12,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL,
    amount_paid NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Paid',
    payment_mode VARCHAR(50) DEFAULT 'Cash',
    hospital_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hospital_id, invoice_number)
);

-- =================================================================
-- SEED INITIAL HOSPITAL TENANTS (Apex Care, Metro, CarePoint)
-- =================================================================

INSERT INTO tenants (id, tenant_code, name, unit_name, city, state, contact_email, contact_phone, plan, plan_label, bed_capacity, renewal_date, monthly_fee, logo_badge, modules)
VALUES
('a0000000-0000-0000-0000-000000000001', 'APEX-01', 'Apex Care Hospital', 'Unit 1 (20 Beds)', 'Hyderabad', 'Telangana', 'admin@apexcarehospital.com', '+91 98480 12345', 'standard_hospital', 'Standard Hospital Care (20 Beds)', 20, CURRENT_DATE + INTERVAL '45 days', 22500, 'Unit 1 • 20 Beds', '{"opd": true, "ipd": true, "pharmacy": true, "laboratory": true, "doctors": true, "services": true, "blood_bank": false, "accounts": false, "reports": false, "admin": false}'::jsonb),
('b0000000-0000-0000-0000-000000000002', 'METRO-02', 'Metro Multispecialty Hospital', 'Main Wing (50 Beds)', 'Bangalore', 'Karnataka', 'director@metromedical.in', '+91 99000 67890', 'enterprise_multispecialty', 'Enterprise Multispecialty (50 Beds)', 50, CURRENT_DATE + INTERVAL '60 days', 48500, 'Main Wing • 50 Beds', '{"opd": true, "ipd": true, "pharmacy": true, "laboratory": true, "blood_bank": true, "doctors": true, "services": true, "accounts": true, "reports": true, "admin": true}'::jsonb),
('c0000000-0000-0000-0000-000000000003', 'CARE-03', 'CarePoint Polyclinic & Day Care', 'Outpatient Clinic', 'Chennai', 'Tamil Nadu', 'carepoint.clinic@gmail.com', '+91 94440 54321', 'starter_clinic', 'Starter Day Clinic (0 Beds)', 0, CURRENT_DATE + INTERVAL '30 days', 9500, 'Day Clinic • Outpatient Only', '{"opd": true, "pharmacy": true, "doctors": true, "services": true, "ipd": false, "laboratory": false, "blood_bank": false, "accounts": false, "reports": false, "admin": false}'::jsonb)
ON CONFLICT (tenant_code) DO NOTHING;

-- Seed Staff for Apex Care Hospital (Hospital 1)
INSERT INTO users (email, password_hash, name, phone, role, role_label, department, status, email_verified, hospital_id)
VALUES
('cmo@apexcarehospital.com', 'scrypt_hashed_password', 'Dr. Rajeshwar Rao, MD', '+91 98490 11223', 'cmo', 'Medical Director & Chief Medical Officer', 'Executive Healthcare Administration', 'ACTIVE', TRUE, 'a0000000-0000-0000-0000-000000000001'),
('priya.nair@apexcarehospital.com', 'scrypt_hashed_password', 'Dr. Priya Nair', '+91 98490 22334', 'doctor', 'Senior Consultant Physician', 'Department of Internal Medicine', 'ACTIVE', TRUE, 'a0000000-0000-0000-0000-000000000001'),
('sneha.m@apexcarehospital.com', 'scrypt_hashed_password', 'Sneha Mukherjee', '+91 98490 33445', 'receptionist', 'Front Desk & Triage Receptionist', 'Outpatient Registration & Reception', 'ACTIVE', TRUE, 'a0000000-0000-0000-0000-000000000001'),
('philomena.d@apexcarehospital.com', 'scrypt_hashed_password', 'Sister Philomena David', '+91 98490 44556', 'nurse', 'Chief Nursing Superintendent', 'Nursing Administration (ICU & Wards)', 'ACTIVE', TRUE, 'a0000000-0000-0000-0000-000000000001')
ON CONFLICT (email) DO NOTHING;
