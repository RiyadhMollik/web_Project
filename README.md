 # CureSync - Healthcare Management System

A comprehensive healthcare management system with role-based authentication for Patients, Doctors, and Administrators.

## Features

### 🔐 Authentication & Authorization
- **Multi-role authentication**: Patient, Doctor, and Admin roles
- **JWT-based authentication** with secure token management
- **Role-based access control** with protected routes
- **Password hashing** using bcrypt
- **Session management** with automatic token refresh

### 👥 User Management
- **Patient Registration**: Complete patient profiles with medical information
- **Doctor Registration**: Professional profiles with specialization and licensing
- **Admin Panel**: Comprehensive user management and system administration
- **Profile Management**: Edit personal information and preferences

### 🏥 Role-Specific Dashboards

#### Patient Dashboard
- Personal profile management
- Medical information tracking
- Appointment booking interface
- Medical records access
- Emergency contact management

#### Doctor Dashboard
- Professional profile management
- Patient list and management
- Appointment scheduling
- Medical notes and reports
- Statistics and analytics

#### Admin Dashboard
- User management (view, edit, activate/deactivate)
- System statistics and analytics
- Role management
- Search and filter capabilities
- Pagination for large datasets

### 🛠 Technical Stack

#### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

#### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web_project
   ```

2. **Set up the Backend**
   ```bash
   cd Server
   npm install
   ```

3. **Configure Database**
   - Create a MySQL database named `curesync_db`
   - Create a `.env` file in the Server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=curesync_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```

5. **Set up the Frontend**
   ```bash
   cd ../Client
   npm install
   ```

6. **Start the Frontend Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### User Management (Admin Only)
- `GET /api/users/all` - Get all users with pagination
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Deactivate user
- `POST /api/users/:id/reactivate` - Reactivate user
- `GET /api/users/role/:role` - Get users by role
- `GET /api/users/stats` - Get dashboard statistics

## 🔧 Database Schema

### Users Table
- `id` - Primary key
- `name` - Full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - Enum: 'patient', 'doctor', 'admin'
- `phone` - Phone number
- `address` - Address
- `dateOfBirth` - Date of birth
- `gender` - Enum: 'male', 'female', 'other'
- `specialization` - Doctor's specialization
- `licenseNumber` - Doctor's license number
- `experience` - Years of experience
- `bloodGroup` - Patient's blood group
- `emergencyContact` - Emergency contact number
- `isActive` - Account status
- `lastLogin` - Last login timestamp
- `createdAt` - Account creation date
- `updatedAt` - Last update date

## 🎯 Usage Guide

### For Patients
1. Register with your personal information
2. Complete your medical profile
3. Access your dashboard to manage appointments and medical records
4. Update your profile information as needed

### For Doctors
1. Register with your professional credentials
2. Complete your specialization and licensing information
3. Access your dashboard to manage patients and appointments
4. View patient lists and medical information

### For Administrators
1. Register as an admin (or be assigned admin role)
2. Access the admin dashboard for system management
3. Manage all users (patients, doctors, admins)
4. View system statistics and analytics
5. Activate/deactivate user accounts

## 🔒 Security Features

- **Password Security**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure authentication with token expiration
- **Role-based Access**: Protected routes based on user roles
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **SQL Injection Protection**: Using Sequelize ORM

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Validation Errors**: Clear feedback for form validation
- **Authentication Errors**: Proper handling of login/logout failures
- **API Errors**: Consistent error responses with meaningful messages
- **Network Errors**: Graceful handling of connection issues

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🛠 Development

### Project Structure
```
web_project/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── Components/     # React components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── Route/          # Routing configuration
│   └── package.json
├── Server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── package.json
└── README.md
```

### Available Scripts

#### Backend (Server/)
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

#### Frontend (Client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Future Enhancements

- Appointment scheduling system
- Medical records management
- Prescription management
- Billing and payment integration
- Real-time notifications
- Video consultation features
- Mobile app development
- Advanced analytics and reporting