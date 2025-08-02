const { User, DoctorSchedule } = require('../models');

const seedDoctorSchedules = async () => {
    try {
        console.log('🌱 Seeding doctor schedules...');

        // Get all doctors from the database
        const doctors = await User.findAll({
            where: { role: 'doctor', isActive: true }
        });

        if (doctors.length === 0) {
            console.log('No doctors found. Please create doctors first.');
            return;
        }

        const schedules = [];

        // Create schedules for each doctor
        for (const doctor of doctors) {
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
        }

        // Insert schedules
        await DoctorSchedule.bulkCreate(schedules, {
            ignoreDuplicates: true
        });

        console.log(`✅ Created ${schedules.length} doctor schedules`);
    } catch (error) {
        console.error('❌ Error seeding doctor schedules:', error);
    }
};

module.exports = { seedDoctorSchedules };

// Run seeder if called directly
if (require.main === module) {
    const { sequelize } = require('../models');

    sequelize.sync({ alter: true })
        .then(() => seedDoctorSchedules())
        .then(() => {
            console.log('✅ Seeding completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
} 