import express from 'express'
import cors from 'cors'
import sql from 'mssql/msnodesqlv8.js'
import { connectToDB } from './db.js'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// ✅ Root route
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

    const user = result.recordset[0]
    const now = new Date().toISOString()

    if (user) {
      // ✅ Insert successful login log
      await pool
        .request()
        .input('StaffID', sql.Int, user.StaffID)
        .input('Action', sql.NVarChar, 'Login')
        .input('LogTime', sql.DateTime, now)
        .input('Status', sql.NVarChar, 'Success').query(`
          INSERT INTO LoginLogs (StaffID, Action, LogTime, Status)
          VALUES (@StaffID, @Action, @LogTime, @Status)
        `)

      res.json({ success: true, user })
    } else {
      // ❌ Insert failed login attempt (optional: find StaffID by email if needed)
      const staffRes = await pool
        .request()
        .input('email', sql.NVarChar, email)
        .query(`SELECT StaffID FROM Staff WHERE Email = @email`)
      const staffID = staffRes.recordset[0]?.StaffID || null

      await pool
        .request()
        .input('StaffID', sql.Int, staffID)
        .input('Action', sql.NVarChar, 'Login')
        .input('LogTime', sql.DateTime, now)
        .input('Status', sql.NVarChar, 'Failed').query(`
          INSERT INTO LoginLogs (StaffID, Action, LogTime, Status)
          VALUES (@StaffID, @Action, @LogTime, @Status)
        `)

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

// ✅ Get all staff with roles
app.get('/api/staff', async (req, res) => {
  try {
    const pool = await connectToDB()
    const result = await pool.request().query(`
      SELECT
        s.StaffID, s.FullName, s.Email, s.CNIC, s.Phone, s.RoleID,
        r.RoleName
      FROM Staff s
      JOIN Roles r ON s.RoleID = r.RoleID
    `)
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching staff:', err.message)
    res.status(500).json({ error: 'Failed to fetch staff' })
  }
})

// ✅ Get login logs
app.get('/api/logs', async (req, res) => {
  try {
    const pool = await connectToDB()
    const result = await pool.request().query('SELECT * FROM LoginLogs')
    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching logs:', err.message)
    res.status(500).json({ error: 'Failed to fetch login logs' })
  }
})

app.post('/api/staff', async (req, res) => {
  const { role, name, email, password, gender, age, createdAt, phone } = req.body

  const roleMap = {
    Admin: 1,
    Doctor: 2,
    Nurse: 3,
    Pharmacist: 4,
  }

  const roleId = roleMap[role]

  if (!roleId) return res.status(400).json({ error: 'Invalid role' })

  try {
    const pool = await connectToDB()
    await pool
      .request()
      .input('FullName', sql.NVarChar, name)
      .input('Email', sql.NVarChar, email)
      .input('Password', sql.NVarChar, password)
      .input('Gender', sql.NVarChar, gender)
      .input('Age', sql.Int, age)
      .input('RoleID', sql.Int, roleId)
      .input('Phone', sql.NVarChar, phone)
      .input('CreatedAt', sql.DateTime, createdAt).query(`
        INSERT INTO Staff (FullName, Email, Password, Gender, Age, RoleID, Phone, CreatedAt)
        VALUES (@FullName, @Email, @Password, @Gender, @Age, @RoleID, @Phone, @CreatedAt)
      `)
    res.json({ success: true, message: 'Staff added successfully' })
  } catch (err) {
    console.error('❌ Error adding staff:', err.message)
    res.status(500).json({ error: 'Server error adding staff' })
  }
})

app.post('/api/patient', async (req, res) => {
  const { name, cnic, age, gender, createdAt, phone } = req.body

  try {
    const pool = await connectToDB()
    await pool
      .request()
      .input('FullName', sql.NVarChar, name)
      .input('CNIC', sql.NVarChar, cnic)
      .input('Age', sql.Int, age)
      .input('Gender', sql.NVarChar, gender)
      .input('Phone', sql.NVarChar, phone)
      .input('CreatedAt', sql.DateTime, createdAt).query(`
        INSERT INTO Patients (FullName, CNIC, Age, Gender, Phone, CreatedAt)
        VALUES (@FullName, @CNIC, @Age, @Gender, @Phone, @CreatedAt)
      `)
    res.json({ success: true, message: 'Patient added successfully' })
  } catch (err) {
    console.error('❌ Error adding patient:', err.message)
    res.status(500).json({ error: 'Server error adding patient' })
  }
})

// Server: Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const pool = await connectToDB()

    const result = await pool.request().query(`
      SELECT
        PatientID,
        FullName,
        CNIC,
        Gender,
        Age,
        Phone,
        CONVERT(varchar, CreatedAt, 23) AS CreatedAt
      FROM Patients
      ORDER BY FullName
    `)

    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching patients:', err.message)
    res.status(500).json({ error: 'Failed to fetch patients' })
  }
})

// ✅ Get vitals for a specific patient
app.get('/api/vitals/:patientId', async (req, res) => {
  const { patientId } = req.params
  try {
    const pool = await connectToDB()
    const result = await pool.request().input('patientId', sql.Int, patientId).query(`
      SELECT
        BloodPressure,
        HeartRate,
        BloodSugar,
        Temperature,
        OxygenSaturation,
        Notes,
        CheckedBy,
        CONVERT(varchar, Date, 23) AS Date,
        CONVERT(varchar, Time, 8) AS Time
      FROM PatientVitals
      WHERE PatientID = @patientId
      ORDER BY Date DESC, Time DESC
    `)

    res.json(result.recordset)
  } catch (err) {
    console.error('Error fetching vitals:', err)
    res.status(500).json({ error: 'Failed to fetch vitals' })
  }
})

app.post('/api/vitals', async (req, res) => {
  const {
    PatientID,
    BloodPressure,
    HeartRate,
    BloodSugar,
    Temperature,
    OxygenSaturation,
    Notes,
    Date,
    Time,
    CheckedBy, // ← Add this line
  } = req.body

  try {
    const pool = await connectToDB()
    await pool
      .request()
      .input('PatientID', sql.Int, PatientID)
      .input('BloodPressure', sql.NVarChar, BloodPressure)
      .input('HeartRate', sql.Int, HeartRate)
      .input('BloodSugar', sql.Float, BloodSugar)
      .input('Temperature', sql.Float, Temperature)
      .input('OxygenSaturation', sql.Float, OxygenSaturation)
      .input('Notes', sql.NVarChar, Notes)
      .input('Date', sql.Date, Date)
      .input('Time', sql.Time, Time)
      .input('CheckedBy', sql.NVarChar, CheckedBy) // ← Add this line
      .query(`
        INSERT INTO PatientVitals (
          PatientID, BloodPressure, HeartRate, BloodSugar,
          Temperature, OxygenSaturation, Notes, Date, Time, CheckedBy
        )
        VALUES (
          @PatientID, @BloodPressure, @HeartRate, @BloodSugar,
          @Temperature, @OxygenSaturation, @Notes, @Date, @Time, @CheckedBy
        )
      `)

    res.json({ success: true, message: 'Vitals saved.' })
  } catch (err) {
    console.error('Error saving vitals:', err)
    res.status(500).json({ error: 'Failed to save vitals' })
  }
})

app.post('/api/doctor-checkups', async (req, res) => {
  const { PatientID, Medicines, Dosage, Days, CurrentCheckupDate, NextCheckupDate, DoctorName } =
    req.body

  try {
    const pool = await connectToDB()
    await pool
      .request()
      .input('PatientID', sql.Int, PatientID)
      .input('Medicine', sql.NVarChar, Medicines)
      .input('Dosage', sql.NVarChar, Dosage)
      .input('Days', sql.Int, Days)
      .input('CheckupDate', sql.Date, CurrentCheckupDate)
      .input('NextCheckupDate', sql.Date, NextCheckupDate)
      .input('CheckedByDoctor', sql.NVarChar, DoctorName).query(`
        INSERT INTO DoctorCheckups (
          PatientID, Medicine, Dosage, Days,
          CheckupDate, NextCheckupDate, CheckedByDoctor
        )
        VALUES (
          @PatientID, @Medicine, @Dosage, @Days,
          @CheckupDate, @NextCheckupDate, @CheckedByDoctor
        )
      `)

    res.json({ success: true, message: 'Checkup saved successfully' })
  } catch (err) {
    console.error('❌ Error saving checkup:', err)
    res.status(500).json({ error: 'Failed to save doctor checkup' })
  }
})

app.get('/api/doctor-checkups/:patientId/:date', async (req, res) => {
  const { patientId, date } = req.params
  try {
    const pool = await connectToDB()
    const result = await pool
      .request()
      .input('patientId', sql.Int, patientId)
      .input('date', sql.Date, date).query(`
        SELECT
          Medicine,
          Dosage,
          Days,
          CONVERT(varchar, CheckupDate, 23) AS CheckupDate,
          CONVERT(varchar, NextCheckupDate, 23) AS NextCheckupDate,
          CheckedByDoctor
        FROM DoctorCheckups
        WHERE PatientID = @patientId AND CheckupDate = @date
        ORDER BY CheckupDate DESC
      `)

    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching doctor checkups:', err)
    res.status(500).json({ error: 'Failed to fetch doctor checkups' })
  }
})

app.post('/api/medicine-delivery', async (req, res) => {
  const {
    PatientID,
    Medicine,
    Dosage,
    Days,
    CheckupDate,
    TotalPrice,
    IsDelivered,
    DeliveryDateTime,
    PharmacistName,
  } = req.body

  try {
    const pool = await connectToDB()
    await pool
      .request()
      .input('PatientID', sql.Int, PatientID)
      .input('Medicine', sql.NVarChar, Medicine)
      .input('Dosage', sql.NVarChar, Dosage)
      .input('Days', sql.Int, Days)
      .input('CheckupDate', sql.Date, CheckupDate)
      .input('TotalPrice', sql.Decimal(10, 2), TotalPrice)
      .input('IsDelivered', sql.Bit, IsDelivered)
      .input('DeliveryDateTime', sql.DateTime, DeliveryDateTime)
      .input('PharmacistName', sql.NVarChar, PharmacistName).query(`
        INSERT INTO MedicineDelivery (
          PatientID, Medicine, Dosage, Days,
          CheckupDate, TotalPrice, IsDelivered,
          DeliveryDateTime, PharmacistName
        )
        VALUES (
          @PatientID, @Medicine, @Dosage, @Days,
          @CheckupDate, @TotalPrice, @IsDelivered,
          @DeliveryDateTime, @PharmacistName
        )
      `)

    res.json({ success: true, message: 'Medicine delivery recorded successfully' })
  } catch (err) {
    console.error('❌ Error saving medicine delivery:', err)
    res.status(500).json({ error: 'Failed to save medicine delivery' })
  }
})

app.get('/api/medicine-delivery/:patientId/:date', async (req, res) => {
  const { patientId, date } = req.params

  try {
    const pool = await connectToDB()
    const result = await pool
      .request()
      .input('PatientID', sql.Int, patientId)
      .input('CheckupDate', sql.Date, date).query(`
        SELECT
          Medicine, Dosage, Days, CheckupDate,
          TotalPrice, IsDelivered, DeliveryDateTime, PharmacistName
        FROM MedicineDelivery
        WHERE PatientID = @PatientID AND CheckupDate = @CheckupDate
      `)

    res.json(result.recordset)
  } catch (err) {
    console.error('❌ Error fetching medicine delivery:', err)
    res.status(500).json({ error: 'Failed to fetch delivery records' })
  }
})

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
