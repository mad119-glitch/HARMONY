import sql from 'mssql/msnodesqlv8.js'

const dbConfig = {
  server: 'DESKTOP-4BMCRQ2\\SQLEXPRESS',
  database: 'HarmonyDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: false, // remove this line if you had it
    integratedSecurity: true, // ✅ required for Windows Auth
    encrypt: false,
    trustServerCertificate: true,
  },
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=DESKTOP-4BMCRQ2\\SQLEXPRESS;Database=HarmonyDB;Trusted_Connection=Yes;`,
}

export async function connectToDB() {
  try {
    const pool = await sql.connect(dbConfig)
    return pool
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    throw err
  }
}
