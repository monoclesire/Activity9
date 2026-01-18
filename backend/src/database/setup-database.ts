// src/database/setup-database.ts
import { DataSource } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Product, User],
  synchronize: true, // Auto-creates tables
  logging: true,
});

async function setupDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    console.log('✅ Database connection established!');

    // Check if products table exists and has data
    const productRepository = AppDataSource.getRepository(Product);
    const productCount = await productRepository.count();

    if (productCount === 0) {
      console.log('📦 Seeding initial products...');
      
      const initialProducts = [
        {
          name: 'Wireless Headphones',
          price: 79.99,
          stock: 45,
        },
        {
          name: 'Smart Watch',
          price: 199.99,
          stock: 23,
        },
        {
          name: 'Laptop Stand',
          price: 34.99,
          stock: 67,
        },
        {
          name: 'USB-C Cable',
          price: 12.99,
          stock: 150,
        },
        {
          name: 'Wireless Mouse',
          price: 29.99,
          stock: 88,
        },
      ];

      await productRepository.save(initialProducts);
      console.log(`✅ Added ${initialProducts.length} initial products!`);
    } else {
      console.log(`ℹ️  Database already has ${productCount} product(s).`);
    }

    // Check users table
    const userRepository = AppDataSource.getRepository(User);
    const userCount = await userRepository.count();
    console.log(`ℹ️  Database has ${userCount} user(s).`);

    console.log('✅ Database setup complete!');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();