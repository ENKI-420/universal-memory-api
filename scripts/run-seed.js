/**
 * Seed database with initial data
 * Usage: npm run db:seed
 */

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function seedDatabase() {
  console.log("=".repeat(60))
  console.log("Phase-Conjugate Consciousness Runtime - Database Seeding")
  console.log("=".repeat(60))

  if (!process.env.NEON_NEON_DATABASE_URL) {
    console.error("❌ Error: NEON_DATABASE_URL environment variable is not set")
    process.exit(1)
  }

  const sql = neon(process.env.NEON_DATABASE_URL)

  try {
    const seedFile = path.join(__dirname, "002_seed_data.sql")

    if (!fs.existsSync(seedFile)) {
      console.log("ℹ️  No seed file found")
      return
    }

    console.log("\nRunning seed script...\n")
    const seedSQL = fs.readFileSync(seedFile, "utf8")

    await sql(seedSQL)

    console.log("=".repeat(60))
    console.log("✅ Database seeded successfully")
    console.log("=".repeat(60))
    console.log("\nDefault users created:")
    console.log("  Admin: admin@phaseconjugate.io (password: Admin123!)")
    console.log("  Researcher: researcher@phaseconjugate.io (password: Admin123!)")
    console.log("  User: user@phaseconjugate.io (password: Admin123!)")
    console.log("\n⚠️  Remember to change these passwords in production!")
    console.log("=".repeat(60))
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message)
    console.error(error)
    process.exit(1)
  }
}

seedDatabase()
