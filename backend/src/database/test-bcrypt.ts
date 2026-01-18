// src/database/test-bcrypt.ts
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

async function testBcrypt() {
  try {
    console.log('🔧 Testing bcrypt installation...\n');

    // Test 1: Basic bcrypt functionality
    const testPassword = 'password123';
    const hash = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, hash);
    
    console.log('✅ Bcrypt is working correctly');
    console.log('Test password:', testPassword);
    console.log('Generated hash:', hash);
    console.log('Comparison result:', isValid, '\n');

    // Test 2: Check database user
    await AppDataSource.initialize();
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    if (users.length === 0) {
      console.log('⚠️  No users in database. Please register first.\n');
      await AppDataSource.destroy();
      return;
    }

    console.log('👥 Users in database:');
    for (const user of users) {
      console.log(`\n📧 Email: ${user.email}`);
      console.log(`👤 Name: ${user.fullName}`);
      console.log(`🔒 Password hash: ${user.password.substring(0, 20)}...`);
      console.log(`📅 Created: ${user.createdAt}`);

      // Test with a sample password
      console.log('\n🔍 Testing password comparison:');
      
      // Try common passwords
      const testPasswords = ['charice123', 'password', '123456'];
      
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, user.password);
        console.log(`  - "${pwd}": ${match ? '✅ MATCH' : '❌ no match'}`);
      }

      // Prompt for manual test
      console.log('\n💡 To test your actual password:');
      console.log('   const result = await bcrypt.compare("YOUR_PASSWORD", "' + user.password + '");');
    }

    await AppDataSource.destroy();
    console.log('\n✅ Test complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testBcrypt();