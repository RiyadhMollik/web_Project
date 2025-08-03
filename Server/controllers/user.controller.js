const { User } = require('../models');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    
    // Filter by role
    if (role && ['patient', 'doctor', 'admin'].includes(role)) {
      whereClause.role = role;
    }

    // Search by name or email
    if (search) {
      whereClause[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${search}%` } },
        { email: { [require('sequelize').Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive fields
    delete updateData.password;

    await user.update(updateData);

    const userResponse = user.getPublicProfile();

    res.json({
      message: 'User updated successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Soft delete - set isActive to false
    await user.update({ isActive: false });

    res.json({ message: 'User deactivated successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Reactivate user (admin only)
const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ isActive: true });

    res.json({ message: 'User reactivated successfully' });

  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Error reactivating user' });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const users = await User.findAll({
      where: { role, isActive: true },
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });

    res.json({ users });

  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get public doctors list (for appointment booking)
const getPublicDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'doctor', isActive: true },
      attributes: ['id', 'name', 'specialization', 'experience', 'licenseNumber'],
      order: [['name', 'ASC']]
    });

    res.json({ users: doctors });

  } catch (error) {
    console.error('Get public doctors error:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

// Get dashboard stats (admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const patients = await User.count({ where: { role: 'patient', isActive: true } });
    const doctors = await User.count({ where: { role: 'doctor', isActive: true } });
    const admins = await User.count({ where: { role: 'admin', isActive: true } });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await User.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gte]: sevenDaysAgo
        }
      }
    });

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        patients,
        doctors,
        admins,
        recentRegistrations
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  reactivateUser,
  getUsersByRole,
  getPublicDoctors,
  getDashboardStats
}; 