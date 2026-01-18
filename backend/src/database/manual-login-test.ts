// src/database/manual-login-test.ts
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: false,
  logging: false,
});

async function testLogin() {
  try {
    // Change these to match your registration
    const TEST_EMAIL = 'cha@email.com';
    const TEST_PASSWORD = 'charice123'; // Change this to your actual password
    
    console.log('🔐 Testing login for:', TEST_EMAIL);
    console.log('📝 With password:', TEST_PASSWORD);
    console.log('');

    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: TEST_EMAIL },
    });

    if (!user) {
      console.log('❌ User not found in database!');
      console.log('Available users:');
      const allUsers = await userRepository.find();
      allUsers.forEach(u => console.log(`  - ${u.email}`));
      await AppDataSource.destroy();
      return;
    }

    console.log('✅ User found in database');
    console.log('👤 Full Name:', user.fullName);
    console.log('📧 Email:', user.email);
    console.log('🔒 Password Hash (first 30 chars):', user.password.substring(0, 30));
    console.log('');

    console.log('🔍 Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(TEST_PASSWORD, user.password);
    
    if (isPasswordValid) {
      console.log('✅✅✅ PASSWORD MATCH! Login should work! ✅✅✅');
    } else {
      console.log('❌❌❌ PASSWORD MISMATCH! ❌❌❌');
      console.log('');
      console.log('Possible issues:');
      console.log('1. The password you entered during registration is different');
      console.log('2. There might be extra spaces in the password');
      console.log('3. Bcrypt version mismatch');
      console.log('');
      console.log('Solution: Try registering a new account with a simple password like "test123"');
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();