const { Pool } = require('pg');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigrations() {
  console.log('🔄 Running database migrations...\n');
  
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();
  
  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`  → ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
    }
  }
  
  console.log('\n✅ Migrations complete!');
  await pool.end();
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
