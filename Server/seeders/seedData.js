const { User, DoctorSchedule } = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('🌱 Starting data seeding...');

        // Check if doctors already exist
        const existingDoctors = await User.findAll({
            where: { role: 'doctor' }
        });

        if (existingDoctors.length > 0) {
            console.log(`Found ${existingDoctors.length} existing doctors. Skipping doctor creation.`);
        } else {
            console.log('Creating sample doctors...');

            // Create sample doctors
            const doctors = [
                {
                    name: 'Dr. Sarah Johnson',
                    email: 'sarah.johnson@curesync.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'doctor',
                    phone: '+1-555-0101',
                    address: '123 Medical Center Dr, City Center',
                    dateOfBirth: '1980-05-15',
                    gender: 'female',
                    specialization: 'Cardiology',
                    licenseNumber: 'MD123456',
                    experience: 15,
                    isActive: true
                },
                {
                    name: 'Dr. Michael Chen',
                    email: 'michael.chen@curesync.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'doctor',
                    phone: '+1-555-0102',
                    address: '456 Health Plaza, Downtown',
                    dateOfBirth: '1975-08-22',
                    gender: 'male',
                    specialization: 'Neurology',
                    licenseNumber: 'MD123457',
                    experience: 20,
                    isActive: true
                },
                {
                    name: 'Dr. Emily Rodriguez',
                    email: 'emily.rodriguez@curesync.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'doctor',
                    phone: '+1-555-0103',
                    address: '789 Care Street, Medical District',
                    dateOfBirth: '1985-03-10',
                    gender: 'female',
                    specialization: 'Pediatrics',
                    licenseNumber: 'MD123458',
                    experience: 12,
                    isActive: true
                },
                {
                    name: 'Dr. David Williams',
                    email: 'david.williams@curesync.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'doctor',
                    phone: '+1-555-0104',
                    address: '321 Wellness Ave, Health Center',
                    dateOfBirth: '1978-11-30',
                    gender: 'male',
                    specialization: 'Orthopedics',
                    licenseNumber: 'MD123459',
                    experience: 18,
                    isActive: true
                },
                {
                    name: 'Dr. Lisa Patel',
                    email: 'lisa.patel@curesync.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'doctor',
                    phone: '+1-555-0105',
                    address: '654 Medical Blvd, Care District',
                    dateOfBirth: '1982-07-18',
                    gender: 'female',
                    specialization: 'Dermatology',
                    licenseNumber: 'MD123460',
                    experience: 14,
                    isActive: true
                }
            ];

            const createdDoctors = await User.bulkCreate(doctors);
            console.log(`✅ Created ${createdDoctors.length} doctors`);
        }

        // Get all doctors (existing + newly created)
        const allDoctors = await User.findAll({
            where: { role: 'doctor', isActive: true }
        });

        console.log(`Total doctors available: ${allDoctors.length}`);

        // Create schedules for each doctor
        const schedules = [];

        for (const doctor of allDoctors) {
            // Monday schedule
            schedules.push({
                doctorId: doctor.id,
                hospitalName: 'City General Hospital',
                hospitalAddress: '123 Main Street, City Center',
                dayOfWeek: 'monday',
                startTime: '09:00:00',
                endTime: '17:00:00',
                consultationFee: 150.00,
                maxPatients: 20,
                isActive: true
            });

            // Wednesday schedule
            schedules.push({
                doctorId: doctor.id,
                hospitalName: 'Metro Medical Center',
                hospitalAddress: '456 Oak Avenue, Downtown',
                dayOfWeek: 'wednesday',
                startTime: '10:00:00',
                endTime: '18:00:00',
                consultationFee: 180.00,
                maxPatients: 15,
                isActive: true
            });

            // Friday schedule
            schedules.push({
                doctorId: doctor.id,
                hospitalName: 'City General Hospital',
                hospitalAddress: '123 Main Street, City Center',
                dayOfWeek: 'friday',
                startTime: '08:00:00',
                endTime: '16:00:00',
                consultationFee: 150.00,
                maxPatients: 25,
                isActive: true
            });

            // Tuesday schedule (for some doctors)
            if (doctor.specialization === 'Cardiology' || doctor.specialization === 'Neurology') {
                schedules.push({
                    doctorId: doctor.id,
                    hospitalName: 'Specialty Medical Center',
                    hospitalAddress: '789 Specialty Drive, Medical District',
                    dayOfWeek: 'tuesday',
                    startTime: '11:00:00',
                    endTime: '19:00:00',
                    consultationFee: 200.00,
                    maxPatients: 12,
                    isActive: true
                });
            }

            // Thursday schedule (for some doctors)
            if (doctor.specialization === 'Pediatrics' || doctor.specialization === 'Dermatology') {
                schedules.push({
                    doctorId: doctor.id,
                    hospitalName: 'Family Care Clinic',
                    hospitalAddress: '321 Family Street, Care District',
                    dayOfWeek: 'thursday',
                    startTime: '09:00:00',
                    endTime: '17:00:00',
                    consultationFee: 120.00,
                    maxPatients: 18,
                    isActive: true
                });
            }
        }

        // Check if schedules already exist
        const existingSchedules = await DoctorSchedule.findAll();

        if (existingSchedules.length > 0) {
            console.log(`Found ${existingSchedules.length} existing schedules. Skipping schedule creation.`);
        } else {
            // Insert schedules
            await DoctorSchedule.bulkCreate(schedules, {
                ignoreDuplicates: true
            });
            console.log(`✅ Created ${schedules.length} doctor schedules`);
        }

        // Create sample patients if none exist
        const existingPatients = await User.findAll({
            where: { role: 'patient' }
        });

        if (existingPatients.length === 0) {
            console.log('Creating sample patients...');

            const patients = [
                {
                    name: 'John Smith',
                    email: 'john.smith@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'patient',
                    phone: '+1-555-0201',
                    address: '123 Patient Street, City',
                    dateOfBirth: '1990-01-15',
                    gender: 'male',
                    bloodGroup: 'A+',
                    emergencyContact: '+1-555-0202',
                    isActive: true
                },
                {
                    name: 'Jane Doe',
                    email: 'jane.doe@example.com',
                    password: await bcrypt.hash('password123', 10),
                    role: 'patient',
                    phone: '+1-555-0203',
                    address: '456 Health Street, Town',
                    dateOfBirth: '1985-06-20',
                    gender: 'female',
                    bloodGroup: 'O+',
                    emergencyContact: '+1-555-0204',
                    isActive: true
                }
            ];

            await User.bulkCreate(patients);
            console.log(`✅ Created ${patients.length} sample patients`);
        }

        console.log('🎉 Data seeding completed successfully!');
        console.log('\n📋 Sample Data Created:');
        console.log(`- ${allDoctors.length} Doctors`);
        console.log(`- ${schedules.length} Doctor Schedules`);
        console.log(`- ${existingPatients.length + 2} Patients (including new ones)`);
        console.log('\n🔑 Login Credentials:');
        console.log('Doctors: sarah.johnson@curesync.com / password123');
        console.log('Patients: john.smith@example.com / password123');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
};

module.exports = { seedData };

// Run seeder if called directly
if (require.main === module) {
    const { sequelize } = require('../models');

    sequelize.sync({ alter: true })
        .then(() => seedData())
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
} 