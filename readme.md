# MR Chemist Backend

A robust Express.js backend application for the MR Chemist platform with authentication, user management, and role-based access control.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Yarn package manager

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the environment variables.

## Installation

```bash
# Install dependencies
yarn install

# Run in development mode
yarn dev

# Build the project
yarn build

# Run in production mode
yarn start
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header:

```
Authorization: <your_jwt_token>
```

## Role-based Access

The application implements three user roles:

- Super Admin: Full system access
- Admin: Limited administrative access
- Customer: Basic user access

## Error Handling

The API returns standard HTTP status codes and error messages in JSON format:

```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [
    {
      "path": "field",
      "message": "Error details"
    }
  ]
}
```

## Development

- Written in TypeScript
- Uses ESLint for code linting
- Prettier for code formatting
- Modular architecture with separate routes, controllers, and services

## License

MIT
