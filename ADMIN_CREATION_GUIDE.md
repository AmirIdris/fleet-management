# Admin User Creation - Quick Start Guide

## 🎯 Overview

You now have a powerful CLI tool to create admin users for your Fleet Management System directly from the command terminal. This is essential for:

- **Initial Setup**: Creating the first admin user when deploying the system
- **User Management**: Adding additional admin users as your team grows
- **Emergency Access**: Creating admin accounts when needed for system recovery

## 🚀 Quick Start

### Method 1: Interactive Mode (Recommended for Manual Setup)

Simply run the command without any arguments for a guided experience:

```bash
npm run create-admin
```

You'll be prompted for:
- Username (minimum 3 characters)
- Email address (must be valid format)
- Password (minimum 6 characters)
- Full name (optional)

### Method 2: Non-Interactive Mode (Perfect for Scripts)

Provide all information as command-line arguments:

```bash
npm run create-admin -- -u admin -e admin@company.com -p securepass123 -f "System Administrator"
```

## 📋 Command Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--username` | `-u` | Admin username | ✅ Yes |
| `--email` | `-e` | Admin email address | ✅ Yes |
| `--password` | `-p` | Admin password | ✅ Yes |
| `--full-name` | `-f` | Full name | ❌ No |
| `--help` | `-h` | Show help message | ❌ No |

## ✅ Verification

After creating an admin user, you can verify it works by:

1. **Starting the server** (if not already running):
   ```bash
   npm run start:dev
   ```

2. **Testing login via API**:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body '{"usernameOrEmail":"admin","password":"your_password"}'
   ```

3. **Using Swagger UI**: Visit `http://localhost:3000/api/docs` and test the login endpoint

## 🔒 Security Features

- **Password Hashing**: All passwords are automatically hashed using bcrypt
- **Duplicate Prevention**: Checks for existing usernames and emails
- **Input Validation**: Comprehensive validation for all inputs
- **Role Assignment**: Automatically assigns `ADMIN` role with full system access

## 📝 Example Usage Scenarios

### Development Environment Setup
```bash
npm run create-admin -- -u dev-admin -e dev@localhost.com -p devpass123
```

### Production Deployment
```bash
npm run create-admin -- -u prod-admin -e admin@yourcompany.com -p "YourSecurePassword123!" -f "Production Administrator"
```

### Emergency Admin Creation
```bash
npm run create-admin -- -u emergency -e emergency@company.com -p "EmergencyPass456!"
```

## 🎉 Success!

Your admin user creation functionality is now fully operational! The CLI tool provides:

- ✅ **Interactive and non-interactive modes**
- ✅ **Comprehensive input validation**
- ✅ **Secure password handling**
- ✅ **Database integration**
- ✅ **Error handling and user feedback**
- ✅ **Help documentation**

## 🔗 Next Steps

1. **Create your first admin user** using the CLI
2. **Log in to the system** via the API or web interface
3. **Start managing your fleet** with full admin privileges
4. **Create additional users** through the web interface or API

The admin user you create will have full access to all Fleet Management System features including:
- User management
- Truck fleet management
- Driver management
- Client management
- Trip planning and tracking
- Financial reporting
- System configuration

---

**Need help?** Run `npm run create-admin -- --help` for detailed usage information.