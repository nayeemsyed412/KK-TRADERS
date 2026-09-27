# KK Traders PostgreSQL API

This backend stores website enquiries in PostgreSQL.

## API

### Health
GET `/api/health`

### Create enquiry
POST `/api/enquiries`

JSON body:

```json
{
  "name": "Customer name",
  "phone": "+91 98765 43210",
  "email": "customer@example.com",
  "subject": "Scaffolding requirement",
  "product": "Scaffolding Systems",
  "message": "Please share price and availability.",
  "website": ""
}
```

The `website` field is a honeypot and should remain empty for real visitors.

## Local setup

1. Create a PostgreSQL database named `kk_traders`.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL`.
4. Run `schema.sql` against the database.
5. Run:

```bash
npm install
npm start
```

The API runs on port 3000 by default.

## Deployment

The API must be deployed to a server/container platform; GitHub Pages cannot execute Node.js. Set these environment variables on the backend host:

- `DATABASE_URL`
- `FRONTEND_ORIGIN=https://nayeemsyed412.github.io`
- `PORT` (usually supplied by the platform)
- `PGSSL=true` when required by the PostgreSQL provider

Never commit the real `.env` file or a PostgreSQL password.
