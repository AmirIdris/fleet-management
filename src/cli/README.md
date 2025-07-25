# Admin User Creation CLI

This CLI tool allows you to create admin users for the Fleet Management System directly from the command terminal. This is essential for bootstrapping the system with the first admin user or adding additional admin users.

## Features

- **Interactive Mode**: Guided prompts for user-friendly admin creation
- **Non-Interactive Mode**: Command-line arguments for automated scripts
- **Input Validation**: Comprehensive validation for all user inputs
- **Duplicate Prevention**: Checks for existing usernames and emails
- **Secure Password Handling**: Automatic password hashing using bcrypt
- **Database Integration**: Direct integration with the application's database

## Usage

### Interactive Mode (Recommended)

Run the command without any arguments to enter interactive mode:

```bash
npm run create-admin
```

This will guide you through the process with prompts:

```
🔧 Fleet Management System - Admin User Creation
================================================

Enter admin username: admin
Enter admin email: admin@company.com
Enter admin password (min 6 chars): ********
Enter full name (optional): System Administrator

📋 Admin User Details:
=====================
Username: admin
Email: admin@company.com
Full Name: System Administrator
Role: admin

Create this admin user? (y/N): y

✅ Admin user created successfully!
```

### Non-Interactive Mode

For automation or scripting, you can provide all required information as command-line arguments:

```bash
# Basic admin creation
npm run create-admin -- --username admin --email admin@company.com --password securepass123

# With full name
npm run create-admin -- -u admin -e admin@company.com -p securepass123 -f "System Administrator"
```

### Command Line Options

| Option | Short | Description | Required |
|--------|-------|-------------|----------|
| `--username` | `-u` | Admin username (min 3 chars) | Yes |
| `--email` | `-e` | Admin email address | Yes |
| `--password` | `-p` | Admin password (min 6 chars) | Yes |
| `--full-name` | `-f` | Full name of the admin | No |
| `--help` | `-h` | Show help message | No |

## Examples

### First-Time Setup

When setting up the system for the first time:

```bash
npm run create-admin -- -u admin -e admin@fleet.com -p admin123456 -f "Fleet Administrator"
```

### Development Environment

For development environments:

```bash
npm run create-admin -- -u dev-admin -e dev@localhost.com -p devpass123
```

### Production Environment

For production (use strong passwords):

```bash
npm run create-admin -- -u prod-admin -e admin@yourcompany.com -p "YourSecurePassword123!" -f "Production Administrator"
```

## Validation Rules

### Username
- Minimum 3 characters
- Must be unique in the system
- Case-sensitive

### Email
- Must be a valid email format
- Must be unique in the system
- Case-insensitive

### Password
- Minimum 6 characters
- Automatically hashed using bcrypt
- No maximum length limit

### Full Name
- Optional field
- Can contain spaces and special characters
- Used for display purposes

## Error Handling

The CLI provides clear error messages for common issues:

- **Duplicate User**: If username or email already exists
- **Invalid Email**: If email format is incorrect
- **Short Password**: If password is less than 6 characters
- **Database Connection**: If unable to connect to database
- **Missing Arguments**: If required arguments are not provided

## Security Considerations

- Passwords are never stored in plain text
- All passwords are hashed using bcrypt with salt rounds
- The CLI doesn't log sensitive information
- Database connections use the same security as the main application

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Ensure the database is running
2. Check your `.env` file configuration
3. Verify database credentials
4. Make sure the application can connect to the database

### Permission Issues

If you get permission errors:

1. Ensure you have write access to the database
2. Check if the database user has CREATE permissions
3. Verify the database schema exists

### TypeScript/Module Issues

If you encounter TypeScript or module resolution errors:

1. Run `npm install` to ensure all dependencies are installed
2. Check that `ts-node` is properly installed
3. Verify the `tsconfig.json` configuration

## Integration with Application

The CLI tool:

- Uses the same database configuration as the main application
- Leverages the existing `UsersService` for user creation
- Follows the same validation rules as the REST API
- Creates users with the `ADMIN` role automatically
- Integrates with the existing authentication system

## Development

The CLI consists of two main files:

- `src/cli/create-admin.cli.ts`: Main CLI entry point with argument parsing
- `src/cli/create-admin.command.ts`: Interactive command implementation

Both files use the NestJS application context to access services and maintain consistency with the main application.

## Future Enhancements

Potential improvements for the CLI:

- Bulk admin creation from CSV files
- Role-based user creation (not just admin)
- User management commands (list, update, delete)
- Configuration validation commands
- Database migration commands