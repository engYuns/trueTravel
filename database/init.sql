-- True Travel Database Schema
-- Create databases and tables for the B2B booking platform

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS bookings;
CREATE SCHEMA IF NOT EXISTS payments;

-- Users schema tables
CREATE TABLE IF NOT EXISTS users.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES users.companies(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(20) DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings schema tables
CREATE TABLE IF NOT EXISTS bookings.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users.users(id),
    company_id UUID REFERENCES users.companies(id),
    booking_type VARCHAR(50) NOT NULL, -- hotel, flight, car, package
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    travel_date DATE,
    return_date DATE,
    guest_count INTEGER DEFAULT 1,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings.booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings.bookings(id),
    item_type VARCHAR(50) NOT NULL,
    item_details JSONB,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments schema tables
CREATE TABLE IF NOT EXISTS payments.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings.bookings(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments.payments(id),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    refund_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users.users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users.users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_company_id ON bookings.bookings(company_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings.bookings(travel_date);
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON bookings.booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments.payments(payment_status);