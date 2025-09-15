const fs = require('fs');
const path = require('path');
require('dotenv').config();
const pool = require('../src/db');

async function run() {
  const useDb = process.env.USE_DB === '1';
  if (!useDb) {
    console.log('USE_DB not set to 1 — skipping SQL migration.');
    process.exit(0);
  }

  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS homestays (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        address TEXT,
        googleMapEmbed TEXT,
        images TEXT,
        contact TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(36) PRIMARY KEY,
        homestay_id VARCHAR(36),
        roomName VARCHAR(255),
        amenities TEXT,
        FOREIGN KEY (homestay_id) REFERENCES homestays(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS availability (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(36),
        date DATE,
        isBooked TINYINT(1) DEFAULT 0,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('Migration complete.');
  } catch (e) {
    console.error(e);
  } finally {
    conn.release();
    process.exit(0);
  }
}

run();
