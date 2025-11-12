/**
 * Run database migrations
 * Usage: npm run db:migrate
 */

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function runMigrations() {
  console.log("=".repeat(60))
  console.log("Phase-Conjugate Consciousness Runtime - Database Migrations")
  console.log("=".repeat(60))

  if (!process.env.NEON_NEON_DATABASE_URL) {
    console.error("❌ Error: NEON_DATABASE_URL environment variable is not set")
    process.exit(1)
  }

  const sql = neon(process.env.NEON_DATABASE_URL)

  try {
    // Get all migration files
    const scriptsDir = path.join(__dirname)
    const migrationFiles = fs
      .readdirSync(scriptsDir)
      .filter((file) => file.match(/^\d{3}_.*\.sql$/))
      .sort()

    if (migrationFiles.length === 0) {
      console.log("ℹ️  No migration files found")
      return
    }

    console.log(`\nFound ${migrationFiles.length} migration file(s)\n`)

    for (const file of migrationFiles) {
      console.log(`Running migration: ${file}`)
      const filePath = path.join(scriptsDir, file)
      const migrationSQL = fs.readFileSync(filePath, "utf8")

      await sql(migrationSQL)
      console.log(`✅ Completed: ${file}\n`)
    }

    console.log("=".repeat(60))
    console.log("✅ All migrations completed successfully")
    console.log("=".repeat(60))
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message)
    console.error(error)
    process.exit(1)
  }
}

runMigrations()
