import React from 'react';

const AppointmentCard = ({ doctor, specialization, hospital, date, time, rating, available }) => {
    return (
        <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '12px', 
            padding: '20px', 
            margin: '16px 0', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            backgroundColor: 'white',
            transition: 'transform 0.2s ease',
            cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>Dr. {doctor}</h3>
                    <p style={{ margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '14px' }}>{specialization}</p>
                    <p style={{ margin: '0 0 4px 0', color: '#7f8c8d', fontSize: '14px' }}>{hospital}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <span style={{ color: '#f39c12' }}>★</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{rating}</span>
                    </div>
                    <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: available ? '#d5f4e6' : '#fadbd8',
                        color: available ? '#27ae60' : '#e74c3c'
                    }}>
                        {available ? 'Available' : 'Unavailable'}
                    </span>
                </div>
            </div>
            <div style={{ borderTop: '1px solid #ecf0f1', paddingTop: '12px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Date:</strong> {date}</p>
                <p style={{ margin: '0', fontSize: '14px' }}><strong>Time:</strong> {time}</p>
            </div>
        </div>
    );
};

export default AppointmentCard; 