const { DoctorSchedule } = require('./models');

const fixInvalidSchedules = async () => {
  try {
    console.log('🔧 Fixing invalid schedules...');
    
    // Get all schedules
    const schedules = await DoctorSchedule.findAll({
      where: { isActive: true }
    });

    let fixedCount = 0;
    
    for (const schedule of schedules) {
      const startTime = schedule.startTime.slice(0, 5); // HH:MM
      const endTime = schedule.endTime.slice(0, 5); // HH:MM
      
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
      
      // If end time is before or equal to start time, fix it
      if (endMinutes <= startMinutes) {
        console.log(`Fixing schedule ${schedule.id}: ${startTime} - ${endTime}`);
        
        // Add 8 hours to end time to make it valid
        const newEndMinutes = startMinutes + 480; // 8 hours = 480 minutes
        const newEndHour = Math.floor(newEndMinutes / 60);
        const newEndMinute = newEndMinutes % 60;
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}:00`;
        
        await schedule.update({
          endTime: newEndTime
        });
        
        fixedCount++;
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} invalid schedules`);
  } catch (error) {
    console.error('❌ Error fixing schedules:', error);
  }
};

// Run the fix
fixInvalidSchedules()
  .then(() => {
    console.log('✅ Schedule fix completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Schedule fix failed:', error);
    process.exit(1);
  }); 