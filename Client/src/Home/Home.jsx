import React, { useState } from 'react';
import AppointmentCard from '../Components/Appointment/AppointmentCard';

const Home = () => {
    const [filters, setFilters] = useState({
        doctorName: '',
        specialization: '',
        hospital: '',
        availableTime: '',
        rating: ''
    });

    // Sample appointment data
    const appointments = [
        {
            id: 1,
            doctor: 'Sarah Johnson',
            specialization: 'Cardiology',
            hospital: 'City General Hospital',
            date: '2024-06-10',
            time: '10:00 AM',
            rating: 4.8,
            available: true
        },
        {
            id: 2,
            doctor: 'Michael Chen',
            specialization: 'Neurology',
            hospital: 'Metro Medical Center',
            date: '2024-06-12',
            time: '2:30 PM',
            rating: 4.9,
            available: true
        },
        {
            id: 3,
            doctor: 'Emily Rodriguez',
            specialization: 'Pediatrics',
            hospital: 'Children\'s Hospital',
            date: '2024-06-15',
            time: '9:00 AM',
            rating: 4.7,
            available: false
        },
        {
            id: 4,
            doctor: 'David Williams',
            specialization: 'Orthopedics',
            hospital: 'Sports Medicine Center',
            date: '2024-06-18',
            time: '11:00 AM',
            rating: 4.6,
            available: true
        }
    ];

    // Filter appointments based on search criteria
    const filteredAppointments = appointments.filter(appointment => {
        return (
            appointment.doctor.toLowerCase().includes(filters.doctorName.toLowerCase()) &&
            appointment.specialization.toLowerCase().includes(filters.specialization.toLowerCase()) &&
            appointment.hospital.toLowerCase().includes(filters.hospital.toLowerCase()) &&
            (filters.availableTime === '' || appointment.time.includes(filters.availableTime)) &&
            (filters.rating === '' || appointment.rating >= parseFloat(filters.rating))
        );
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Hero Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
                    🏠 CureSync - Connecting Patients with Verified Doctors
                </h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: 'normal' }}>
                    Centralized Healthcare Platform for Patients & Doctors
                </h2>
                <p style={{ fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>
                    Manage appointments, upload medical records, view prescriptions, and access all your health services in one place.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>Get Started</button>
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}>Explore Features</button>
                    <button style={{
                        padding: '12px 24px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}>Login / Sign Up</button>
                </div>
            </div>

            {/* Search & Filter Section */}
            <div style={{ 
                backgroundColor: '#f8f9fa',
                padding: '40px 20px',
                borderBottom: '1px solid #e9ecef'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#2c3e50' }}>
                        🔍 Search & Filter
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                                Doctor's Name
                            </label>
                            <input
                                type="text"
                                placeholder="Search by doctor name..."
                                value={filters.doctorName}
                                onChange={(e) => handleFilterChange('doctorName', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                                Specialization
                            </label>
                            <select
                                value={filters.specialization}
                                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">All Specializations</option>
                                <option value="cardiology">Cardiology</option>
                                <option value="neurology">Neurology</option>
                                <option value="pediatrics">Pediatrics</option>
                                <option value="orthopedics">Orthopedics</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                                Hospital
                            </label>
                            <select
                                value={filters.hospital}
                                onChange={(e) => handleFilterChange('hospital', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">All Hospitals</option>
                                <option value="city general">City General Hospital</option>
                                <option value="metro medical">Metro Medical Center</option>
                                <option value="children">Children's Hospital</option>
                                <option value="sports medicine">Sports Medicine Center</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                                Available Time
                            </label>
                            <select
                                value={filters.availableTime}
                                onChange={(e) => handleFilterChange('availableTime', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">All Times</option>
                                <option value="AM">Morning (AM)</option>
                                <option value="PM">Afternoon (PM)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#495057' }}>
                                Minimum Rating
                            </label>
                            <select
                                value={filters.rating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ced4da',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}
                            >
                                <option value="">All Ratings</option>
                                <option value="4.5">4.5+ Stars</option>
                                <option value="4.0">4.0+ Stars</option>
                                <option value="3.5">3.5+ Stars</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={() => setFilters({
                                doctorName: '',
                                specialization: '',
                                hospital: '',
                                availableTime: '',
                                rating: ''
                            })}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Appointments Section */}
            <div style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>
                        📅 Available Appointments ({filteredAppointments.length})
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '20px'
                    }}>
                        {filteredAppointments.map(appointment => (
                            <AppointmentCard
                                key={appointment.id}
                                doctor={appointment.doctor}
                                specialization={appointment.specialization}
                                hospital={appointment.hospital}
                                date={appointment.date}
                                time={appointment.time}
                                rating={appointment.rating}
                                available={appointment.available}
                            />
                        ))}
                    </div>
                    {filteredAppointments.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                            <p>No appointments found matching your criteria.</p>
                            <p>Try adjusting your filters or check back later for new availability.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '60px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#2c3e50' }}>
                        🧩 Key Features
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        {[
                            { icon: '🔐', title: 'Secure Role-Based Login', desc: 'Patients, Doctors, and Admins access tailored dashboards with privacy and control.' },
                            { icon: '📅', title: 'Appointment Booking', desc: 'Patients can search and book appointments based on doctor availability and hospital schedule.' },
                            { icon: '📁', title: 'Medical Report Upload', desc: 'Patients can upload medical records (PDFs/images) and doctors can view them during appointments.' },
                            { icon: '🧾', title: 'Prescription Management', desc: 'Doctors can generate and upload prescriptions post consultation for patient access.' },
                            { icon: '📊', title: 'Medical Test Reports', desc: 'Upload and manage lab/test results linked to patient profiles.' },
                            { icon: '💵', title: 'Billing & Invoicing', desc: 'Auto-generate invoices and pay via mock in-app currency wallet.' }
                        ].map((feature, index) => (
                            <div key={index} style={{
                                backgroundColor: 'white',
                                padding: '30px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{feature.icon}</div>
                                <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>{feature.title}</h3>
                                <p style={{ color: '#6c757d', lineHeight: '1.6' }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                color: 'white',
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                    🚀 Ready to Take Control of Your Health?
                </h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
                    Join CureSync today and simplify your healthcare journey.
                </p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button style={{
                        padding: '15px 30px',
                        backgroundColor: 'white',
                        color: '#27ae60',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>Join Now</button>
                    <button style={{
                        padding: '15px 30px',
                        backgroundColor: 'transparent',
                        color: 'white',
                        border: '2px solid white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}>Login</button>
                </div>
            </div>
        </div>
    );
};

export default Home;