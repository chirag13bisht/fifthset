// Bootstraps the database schema on first deploy.
// Creates tables only if they do not already exist — safe to run on every start.
import mysql from "mysql2/promise";
import { env } from "./env";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS rsvps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_slug VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(40),
    \`level\` VARCHAR(40),
    message TEXT,
    status ENUM('confirmed', 'waitlist', 'interest') NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL,
    topic VARCHAR(64),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
];

export async function ensureSchema() {
  const connection = await mysql.createConnection(env.databaseUrl);
  try {
    for (const statement of STATEMENTS) {
      await connection.query(statement);
    }
    console.log("Database schema ready.");
  } finally {
    await connection.end();
  }
}
