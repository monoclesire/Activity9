# Activity9

# E-Commerce API

A full-featured e-commerce REST API built with NestJS, TypeORM, and SQLite.

## Features

- **User Authentication** - Register and login with JWT tokens
- **Product Management** - Browse products with stock tracking
- **Shopping Cart** - Add, update, and remove items from cart
- **Order Processing** - Complete checkout with automatic stock deduction
- **Order History** - View past orders with detailed information

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM
- **SQLite** - Lightweight database
- **JWT** - Secure authentication
- **TypeScript** - Type-safe development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
npm run setup-db
```

This will create the SQLite database and seed it with initial products.

4. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }
  ```

- `POST /auth/login` - Login and receive JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get single product by ID

### Cart

- `GET /cart` - Get current user's cart items
- `POST /cart` - Add item to cart
  ```json
  {
    "productId": 1,
    "quantity": 2
  }
  ```
- `PATCH /cart/:id` - Update cart item quantity
  ```json
  {
    "quantity": 3
  }
  ```
- `DELETE /cart/:id` - Remove item from cart

### Orders

- `POST /orders/checkout` - Complete checkout and create order
  ```json
  {
    "fullName": "John Doe",
    "email": "user@example.com"
  }
  ```
- `GET /orders` - Get all orders for current user
- `GET /orders/:id` - Get single order by ID
- `PATCH /orders/:id/status` - Update order status
  ```json
  {
    "status": "completed"
  }
  ```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Order Statuses

- `completed` - Order successfully completed (set automatically on checkout)
- `cancelled` - Order has been cancelled

## Database Schema

### Users
- id, email, password (hashed), fullName, createdAt, updatedAt

### Products
- id, name, price, stock, createdAt, updatedAt

### Cart Items
- id, userId, productId, quantity, createdAt, updatedAt

### Orders
- id, orderNumber, userId, customerName, customerEmail, total, status, createdAt, updatedAt

### Order Items
- id, orderId, productId, productName, price, quantity

## Development

### Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run build` - Build for production
- `npm run setup-db` - Initialize and seed database

### Project Structure

```
src/
├── auth/           # Authentication module
├── users/          # User management
├── products/       # Product management
├── cart/           # Shopping cart
├── orders/         # Order processing
└── database/       # Database setup and configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
