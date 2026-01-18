// src/database/check-database.ts
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Product, User],
  synchronize: false,
  logging: true,
});

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...');
    await AppDataSource.initialize();

    // Check tables
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    
    console.log('\n📋 Tables in database:');
    console.log(tables);

    // Check users
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    console.log(`\n👥 Users (${users.length}):`);
    users.forEach(user => {
      console.log(`  - ${user.fullName} (${user.email}) - Created: ${user.createdAt}`);
    });

    // Check products
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    console.log(`\n📦 Products (${products.length}):`);
    products.forEach(product => {
      console.log(`  - ${product.name}: $${product.price} (Stock: ${product.stock})`);
    });

    await queryRunner.release();
    await AppDataSource.destroy();
    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();