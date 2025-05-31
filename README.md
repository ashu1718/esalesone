# eCommerce Mini Flow

A 3-page eCommerce flow built with React.js, Node.js, and SQL database.

## Features

- Landing Page with product details and variant selection
- Checkout Page with form validation and order summary
- Thank You Page with order confirmation
- Email notifications using Mailtrap.io
- Transaction simulation (Approved/Declined/Error)

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: SQL (MySQL)
- Email Service: Mailtrap.io

## Project Structure

```
esalesone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
└── database/            # Database schema and migrations
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install frontend dependencies
   cd client
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:

   - Create `.env` files in both client and server directories
   - Configure database connection and Mailtrap credentials

4. Start the development servers:

   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm start
   ```

## Environment Variables

### Backend (.env)

```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=esalesone
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_password
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

- `GET /api/products` - Get product details
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Get order details

## License

MIT
