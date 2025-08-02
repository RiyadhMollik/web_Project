const { seedData } = require('./seeders/seedData');
const { sequelize } = require('./models');

console.log('🌱 Starting manual data seeding...');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✅ Database synced');
        return seedData();
    })
    .then(() => {
        console.log('✅ Manual seeding completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Manual seeding failed:', error);
        process.exit(1);
    }); 