#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { UsersService } from '@/modules/users/users.service';
import { UserRole } from '@/common/enums';
import { CreateUserDto } from '@/modules/users/dto/user.dto';
import * as bcrypt from 'bcrypt';

interface CliArgs {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  help?: boolean;
}

class CreateAdminCli {
  private parseArgs(): CliArgs {
    const args: CliArgs = {};
    const argv = process.argv.slice(2);

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];
      
      switch (arg) {
        case '--username':
        case '-u':
          args.username = argv[++i];
          break;
        case '--email':
        case '-e':
          args.email = argv[++i];
          break;
        case '--password':
        case '-p':
          args.password = argv[++i];
          break;
        case '--fullname':
        case '--full-name':
        case '-f':
          args.fullName = argv[++i];
          break;
        case '--help':
        case '-h':
          args.help = true;
          break;
      }
    }

    return args;
  }

  private showHelp(): void {
    console.log(`
🔧 Fleet Management System - Admin User Creation CLI
==================================================

Usage: npm run create-admin [options]

Options:
  -u, --username <username>     Admin username (required)
  -e, --email <email>          Admin email address (required)
  -p, --password <password>    Admin password (required, min 6 chars)
  -f, --full-name <name>       Full name (optional)
  -h, --help                   Show this help message

Examples:
  # Interactive mode (recommended)
  npm run create-admin

  # Non-interactive mode
  npm run create-admin -u admin -e admin@company.com -p securepass123 -f "System Administrator"

  # Quick admin creation
  npm run create-admin --username admin --email admin@fleet.com --password admin123

Notes:
  • If any required arguments are missing, the command will run in interactive mode
  • Admin users have full access to all system features
  • Usernames and emails must be unique in the system
  • Passwords must be at least 6 characters long
`);
  }

  private validateArgs(args: CliArgs): string[] {
    const errors: string[] = [];

    if (!args.username || args.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!args.email || !emailRegex.test(args.email)) {
      errors.push('Please provide a valid email address');
    }

    if (!args.password || args.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }

  async execute(): Promise<void> {
    const args = this.parseArgs();

    // Show help if requested
    if (args.help) {
      this.showHelp();
      return;
    }

    // Check if we have all required arguments for non-interactive mode
    const hasAllArgs = args.username && args.email && args.password;

    if (!hasAllArgs) {
      console.log('⚠️  Missing required arguments. Switching to interactive mode...\n');
      // Import and run interactive command
      const { CreateAdminCommand } = await import('./create-admin.command');
      const interactiveCommand = new CreateAdminCommand();
      await interactiveCommand.execute();
      return;
    }

    let app;

    try {
      // Validate arguments
      const errors = this.validateArgs(args);
      if (errors.length > 0) {
        console.log('❌ Validation Errors:');
        errors.forEach(error => console.log(`   • ${error}`));
        console.log('\nUse --help for usage information.');
        return;
      }

      // Bootstrap NestJS application
      console.log('🚀 Initializing Fleet Management System...');
      app = await NestFactory.createApplicationContext(AppModule, {
        logger: false,
      });

      const usersService = app.get(UsersService);

      // Check if user already exists
      const existingUser = await usersService.findByUsernameOrEmail(args.username!, args.email!);
      if (existingUser) {
        console.log('❌ Error: A user with this username or email already exists.');
        return;
      }

      // Create admin user
      const createUserDto: CreateUserDto = {
        username: args.username!,
        email: args.email!,
        password: await bcrypt.hash(args.password!, 10), // Pre-hash password like AuthService does
        role: UserRole.ADMIN,
        fullName: args.fullName,
      };

      console.log('⏳ Creating admin user...');
      const adminUser = await usersService.create(createUserDto);

      console.log('\n✅ Admin user created successfully!');
      console.log('==================================');
      console.log(`User ID: ${adminUser.id}`);
      console.log(`Username: ${adminUser.username}`);
      console.log(`Email: ${adminUser.email}`);
      console.log(`Role: ${adminUser.role}`);
      console.log(`Full Name: ${adminUser.fullName || 'Not provided'}`);
      console.log(`Created At: ${adminUser.createdAt}`);
      console.log('');
      console.log('🎉 The admin user can now log in to the Fleet Management System!');

    } catch (error) {
      console.log('\n❌ Error creating admin user:');
      if (error.message) {
        console.log(`   ${error.message}`);
      } else {
        console.log('   An unexpected error occurred');
        console.error(error);
      }
      process.exit(1);
    } finally {
      if (app) {
        await app.close();
      }
    }
  }
}

// Execute the CLI if this file is run directly
if (require.main === module) {
  const cli = new CreateAdminCli();
  cli.execute().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}