import express from 'express'
import cors from 'cors'
import sql from 'mssql/msnodesqlv8.js' // Make sure this line is included
import { connectToDB } from './db.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// Root route (optional)
app.get('/', (req, res) => {
  res.send('Harmony Backend API is running.')
})

// ✅ Login route
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body

  try {
    const pool = await connectToDB()
    const result = await pool
      .request()
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .input('role', sql.NVarChar, role).query(`
        SELECT s.*, r.RoleName
        FROM Staff s
        JOIN Roles r ON s.RoleID = r.RoleID
        WHERE s.Email = @email AND s.Password = @password AND r.RoleName = @role
      `)

    if (result.recordset.length === 1) {
      res.json({ success: true, user: result.recordset[0] })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (err) {
    console.error('❌ Login error:', err.message)
    res.status(500).json({ error: 'Server error during login' })
  }
})

// API route to get staff
app.get('/api/staff', async (req, res) => {
  try {
    const pool = await connectToDB()
    const result = await pool.request().query('SELECT * FROM Staff')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching staff:', err.message)
    res.status(500).json({ error: 'Failed to fetch staff' })
  }
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
