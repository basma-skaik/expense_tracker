<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Waslah - Expense Tracker API

A progressive Node.js backend built with **NestJS**, **TypeScript**, and **Sequelize (MySQL)** to manage and track expenses efficiently. The project features a robust, secure authentication system backed by JWT (Access/Refresh Tokens) and follows enterprise-level architectural patterns.

---

## Key Features Built So Far

- **Unified Response Engineering:** Global Interceptor to transform all successful API responses into a predictable JSON structure.
- **Global Exception Filter:** Automated error catcher ensuring clean, readable error payloads for clients.
- **Robust Auth Flow:** Registration and login endpoints protected by automated DTO validations (`class-validator`).
- **JWT & Session Management:** Short-lived Access Tokens coupled with dynamic, database-backed Refresh Tokens for extended session security and secure Logouts.

---

## Project Setup

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

The application supports multi-environment configurations. Create an environment file named `.env.development` in the root directory and populate it with the following keys:

```env
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=expenses_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Configurations
JWT_SECRET=your_super_secure_access_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key
```

---

## Database & Migrations

The project utilizes Sequelize CLI to maintain and track database schema states over time.

### 1. Database Creation (Pre-requisite)

Before executing any migrations, ensure your MySQL server is active and you have manually created an empty database named exactly:

```sql
CREATE DATABASE expenses_db;
```

### 2. Migration Commands

Once the database is created and configured in your `.env.development` file, you can manage the schema changes using the following built-in scripts:

- **Run Migrations:** Executes all pending database schema updates (creates the tables and configures fields like `refresh_token`):

```bash
  npm run migration:run
```

- **Generate Migration:** Scaffolds a new migration file template when you need to change the database schema:

```bash
  # Example: npm run migration:generate -- --name create-expenses-table
  npm run migration:generate -- <migration-name>
```

- **Revert Migration:** Rolls back the last executed migration step (undoes the latest batch):

```bash
  npm run migration:revert
```

---

## Running the Application

To execute the server under the development watch environment (pre-configured with `cross-env` to parse your current target environment profile):

```bash
# development mode with auto-reload
npm run start:dev

# production mode
npm run start:prod
```

---

## API Testing Quick Notes

- **`POST /auth/register`**: Registers a new user. Expects `fullName`, `email`, and `password`.
- **`POST /auth/login`**: Issues `accessToken` and `refreshToken` upon providing successful credentials.
- **`POST /auth/logout`**: Protected endpoint. Requires passing the `accessToken` in the authorization headers as a `Bearer <token>` to clear down the active database session.

---

## License

This project is [MIT licensed](LICENSE).

```

```
