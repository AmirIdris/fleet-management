import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { UsersService } from '@/modules/users/users.service';
import { UserRole } from '@/common/enums';
import { CreateUserDto } from '@/modules/users/dto/user.dto';
import * as readline from 'readline';
import * as bcrypt from 'bcrypt';

interface AdminUserInput {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

class CreateAdminCommand {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(query, resolve);
    });
  }

  private async validateInput(input: AdminUserInput): Promise<string[]> {
    const errors: string[] = [];

    // Username validation
    if (!input.username || input.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.email || !emailRegex.test(input.email)) {
      errors.push('Please provide a valid email address');
    }

    // Password validation
    if (!input.password || input.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return errors;
  }

  private async collectUserInput(): Promise<AdminUserInput> {
    console.log('\n🔧 Fleet Management System - Admin User Creation');
    console.log('================================================\n');

    const username = await this.question('Enter admin username: ');
    const email = await this.question('Enter admin email: ');
    const password = await this.question('Enter admin password (min 6 chars): ');
    const fullName = await this.question('Enter full name (optional): ');

    return {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim() || undefined,
    };
  }

  private async confirmCreation(input: AdminUserInput): Promise<boolean> {
    console.log('\n📋 Admin User Details:');
    console.log('=====================');
    console.log(`Username: ${input.username}`);
    console.log(`Email: ${input.email}`);
    console.log(`Full Name: ${input.fullName || 'Not provided'}`);
    console.log(`Role: ${UserRole.ADMIN}`);
    console.log('');

    const confirm = await this.question('Create this admin user? (y/N): ');
    return confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes';
  }

  async execute(): Promise<void> {
    let app;
    
    try {
      // Bootstrap NestJS application
      console.log('🚀 Initializing Fleet Management System...');
      app = await NestFactory.createApplicationContext(AppModule, {
        logger: false, // Disable logging for CLI
      });

      const usersService = app.get(UsersService);

      // Collect user input
      const input = await this.collectUserInput();

      // Validate input
      const errors = await this.validateInput(input);
      if (errors.length > 0) {
        console.log('\n❌ Validation Errors:');
        errors.forEach(error => console.log(`   • ${error}`));
        return;
      }

      // Confirm creation
      const confirmed = await this.confirmCreation(input);
      if (!confirmed) {
        console.log('\n❌ Admin user creation cancelled.');
        return;
      }

      // Check if user already exists
      const existingUser = await usersService.findByUsernameOrEmail(input.username, input.email);
      if (existingUser) {
        console.log('\n❌ Error: A user with this username or email already exists.');
        return;
      }

      // Create admin user
      const createUserDto: CreateUserDto = {
        username: input.username,
        email: input.email,
        password: await bcrypt.hash(input.password, 10), // Pre-hash password like AuthService does
        role: UserRole.ADMIN,
        fullName: input.fullName,
      };

      console.log('\n⏳ Creating admin user...');
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
    } finally {
      this.rl.close();
      if (app) {
        await app.close();
      }
      process.exit(0);
    }
  }
}

// Execute the command if this file is run directly
if (require.main === module) {
  const command = new CreateAdminCommand();
  command.execute().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { CreateAdminCommand };