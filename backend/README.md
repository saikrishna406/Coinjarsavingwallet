# Savings Wallet Backend - NestJS + Supabase

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Then fill in your Supabase credentials:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT signing

### 3. Set Up Supabase Database
1. Go to https://supabase.com and create a new project
2. Go to SQL Editor in your Supabase dashboard
3. Copy and run the contents of `supabase-schema.sql`
4. Verify all tables are created successfully

### 4. Run the Application
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `PATCH /api/users/link-upi` - Link UPI ID

### Wallet
- `GET /api/wallet` - Get wallet balance

## Project Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/          # Authentication module
│   │   ├── users/         # User management
│   │   ├── wallet/        # Wallet operations
│   │   ├── goals/         # Savings goals (placeholder)
│   │   ├── transactions/  # Transactions (placeholder)
│   │   ├── payments/      # Payments (placeholder)
│   │   └── nudges/        # Nudges (placeholder)
│   ├── common/
│   │   ├── guards/        # JWT Auth Guard
│   │   └── decorators/    # Custom decorators
│   ├── supabase/          # Supabase client module
│   ├── app.module.ts
│   └── main.ts
└── supabase-schema.sql    # Database schema
```

## Next Steps
- Implement Goals module (CRUD operations)
- Implement Transactions module
- Implement Payments module (UPI integration)
- Implement Nudges module
- Add Swagger documentation
- Add unit and E2E tests
