require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const frontendOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not configured. Database requests will fail until it is set.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

async function ensureSchema() {
  await pool.query(\`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(120) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      email VARCHAR(254),
      subject VARCHAR(180),
      product VARCHAR(120),
      message TEXT NOT NULL,
      source VARCHAR(40) NOT NULL DEFAULT 'website',
      status VARCHAR(20) NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'contacted', 'closed', 'spam')),
      ip_hash CHAR(64),
      user_agent TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
    CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status);
    CREATE OR REPLACE FUNCTION set_enquiries_updated_at()
    RETURNS TRIGGER AS $
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $ LANGUAGE plpgsql;
    DROP TRIGGER IF EXISTS enquiries_updated_at ON enquiries;
    CREATE TRIGGER enquiries_updated_at
      BEFORE UPDATE ON enquiries
      FOR EACH ROW
      EXECUTE FUNCTION set_enquiries_updated_at();
  \`);
}

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server and local curl/health checks with no Origin header.
    if (!origin) return callback(null, true);
    if (frontendOrigins.length === 0 || frontendOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "20kb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { ok: false, error: "Too many enquiries. Please try again later." }
});

function clean(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/[<>]/g, "").slice(0, maxLength);
}

function validPhone(phone) {
  return /^[+0-9()\-\s]{7,30}$/.test(phone);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashIp(ip) {
  return crypto.createHash("sha256").update(String(ip || "")).digest("hex");
}

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "connected", service: "kk-traders-api" });
  } catch (error) {
    console.error("Health check database error:", error.message);
    res.status(503).json({ ok: false, database: "unavailable", service: "kk-traders-api" });
  }
});

app.post("/api/enquiries", enquiryLimiter, async (req, res) => {
  try {
    // Honeypot field: real visitors never fill this hidden input.
    if (clean(req.body.website, 120)) {
      return res.status(400).json({ ok: false, error: "Invalid submission." });
    }

    const name = clean(req.body.name, 120);
    const phone = clean(req.body.phone, 30);
    const email = clean(req.body.email, 254);
    const subject = clean(req.body.subject, 180);
    const product = clean(req.body.product, 120);
    const message = clean(req.body.message, 4000);

    if (!name || name.length < 2) {
      return res.status(400).json({ ok: false, error: "Please enter your name." });
    }
    if (!validPhone(phone)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid phone number." });
    }
    if (email && !validEmail(email)) {
      return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
    }
    if (!message || message.length < 5) {
      return res.status(400).json({ ok: false, error: "Please enter your requirement." });
    }

    const result = await pool.query(
      `INSERT INTO enquiries
        (name, phone, email, subject, product, message, source, ip_hash, user_agent)
       VALUES ($1, $2, NULLIF($3, ''), NULLIF($4, ''), NULLIF($5, ''), $6, 'website', $7, $8)
       RETURNING id, created_at`,
      [
        name,
        phone,
        email,
        subject,
        product,
        message,
        hashIp(req.ip),
        clean(req.get("user-agent"), 500)
      ]
    );

    res.status(201).json({
      ok: true,
      message: "Thank you. Your enquiry has been received.",
      enquiryId: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    res.status(500).json({ ok: false, error: "Unable to save your enquiry right now." });
  }
});

app.use((error, _req, res, _next) => {
  if (error.message === "CORS origin not allowed") {
    return res.status(403).json({ ok: false, error: "Origin not allowed." });
  }
  console.error("Unhandled API error:", error);
  return res.status(500).json({ ok: false, error: "Server error." });
});

const server = app.listen(PORT, "0.0.0.0", async () => {
  try {
    await ensureSchema();
    console.log("PostgreSQL schema ready.");
  } catch (error) {
    console.error("PostgreSQL schema initialization failed:", error.message);
  }
  console.log("KK Traders API listening on port " + PORT);
});

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
