<template>
  <div class="doctor-dashboard">
    <AppHeader />
    <div class="main-wrapper">
      <PatientSidebar @patientSelected="selectPatient" />

      <main class="main-content">
        <div v-if="selectedPatient" class="patient-info">
          <h2>{{ selectedPatient.FullName }}</h2>
          <div class="info-grid">
            <p><strong>CNIC:</strong> {{ selectedPatient.CNIC }}</p>
            <p><strong>Phone:</strong> {{ selectedPatient.Phone }}</p>
            <p><strong>Gender:</strong> {{ selectedPatient.Gender }}</p>
            <p><strong>Age:</strong> {{ selectedPatient.Age }}</p>
            <p><strong>Created At:</strong> {{ selectedPatient.CreatedAt }}</p>
          </div>
        </div>

        <div v-if="selectedPatient" class="vitals-section">
          <h3>Today's Vitals</h3>
          <div v-if="todaysVitals.length">
            <div class="vital-box" v-for="(v, index) in todaysVitals" :key="index">
              <div class="info-grid">
                <p><strong>Date:</strong> {{ v.Date }}</p>
                <p><strong>Time:</strong> {{ v.Time }}</p>
                <p><strong>BP:</strong> {{ v.BloodPressure }}</p>
                <p><strong>HR:</strong> {{ v.HeartRate }}</p>
                <p><strong>Sugar:</strong> {{ v.BloodSugar }}</p>
                <p><strong>Temp:</strong> {{ v.Temperature }}</p>
                <p><strong>O₂ Sat:</strong> {{ v.OxygenSaturation }}</p>
              </div>
              <p><strong>Notes:</strong> {{ v.Notes || 'N/A' }}</p>
              <p><strong>Checked By:</strong> {{ v.CheckedBy || 'N/A' }}</p>
            </div>
          </div>
          <div v-else class="placeholder-text">
            <p>No vitals recorded for today.</p>
          </div>

          <div class="checkup-form">
            <h3>Doctor Checkup</h3>
            <form @submit.prevent="submitCheckup">
              <div class="grid">
                <div>
                  <label>Prescribed Medicines</label>
                  <input v-model="checkup.Medicines" required />
                </div>
                <div>
                  <label>Dosage Instructions</label>
                  <input v-model="checkup.Dosage" required />
                </div>
                <div>
                  <label>No. of Days</label>
                  <input v-model="checkup.Days" type="number" required />
                </div>
                <div>
                  <label>Current Checkup Date</label>
                  <input v-model="checkup.CurrentCheckupDate" type="date" required />
                </div>
                <div>
                  <label>Next Checkup Date</label>
                  <input v-model="checkup.NextCheckupDate" type="date" required />
                </div>
              </div>
              <button type="submit">Save Checkup</button>
            </form>
            <div class="date-filter">
              <label>Filter Checkups by Date:</label>
              <input type="date" v-model="filterDate" @change="fetchFilteredCheckups" />
            </div>

            <div v-if="filteredCheckups.length" class="filtered-checkups">
              <h4>Doctor Checkups on {{ filterDate }}</h4>
              <div class="vital-box" v-for="(c, index) in filteredCheckups" :key="index">
                <div class="info-grid">
                  <p><strong>Medicine:</strong> {{ c.Medicine }}</p>
                  <p><strong>Dosage:</strong> {{ c.Dosage }}</p>
                  <p><strong>Days:</strong> {{ c.Days }}</p>
                  <p><strong>Checkup Date:</strong> {{ c.CheckupDate }}</p>
                  <p><strong>Next Checkup:</strong> {{ c.NextCheckupDate }}</p>
                  <p><strong>Checked By:</strong> {{ c.CheckedByDoctor }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="placeholder-text">
          <p>Select a patient to begin.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import PatientSidebar from '@/components/PatientSidebar.vue'
import { ref, computed } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const selectedPatient = ref(null)
const allVitals = ref([])
const checkup = ref({
  Medicines: '',
  Dosage: '',
  Days: '',
  CurrentCheckupDate: '',
  NextCheckupDate: '',
})

const filterDate = ref('')
const filteredCheckups = ref([])

function selectPatient(patient) {
  selectedPatient.value = patient
  fetchVitals(patient.PatientID)
  filteredCheckups.value = [] // reset
  filterDate.value = ''
}

async function fetchVitals(patientId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/vitals/${patientId}`)
    allVitals.value = res.data
  } catch (err) {
    console.error('Error fetching vitals:', err)
  }
}

async function submitCheckup() {
  try {
    const payload = {
      PatientID: selectedPatient.value.PatientID,
      Medicines: checkup.value.Medicines.trim(),
      Dosage: checkup.value.Dosage.trim(),
      Days: parseInt(checkup.value.Days),
      CurrentCheckupDate: checkup.value.CurrentCheckupDate,
      NextCheckupDate: checkup.value.NextCheckupDate,
      DoctorName: userStore.user?.FullName || 'Unknown Doctor',
    }

    if (
      !payload.Medicines ||
      !payload.Dosage ||
      isNaN(payload.Days) ||
      !payload.CurrentCheckupDate ||
      !payload.NextCheckupDate
    ) {
      alert('Please fill out all checkup fields correctly.')
      return
    }

    await axios.post('http://localhost:3000/api/doctor-checkups', payload)
    alert('Checkup saved successfully!')
    checkup.value = {
      Medicines: '',
      Dosage: '',
      Days: '',
      CurrentCheckupDate: '',
      NextCheckupDate: '',
    }
  } catch (err) {
    console.error('❌ Error saving checkup:', err)
    alert('Error saving checkup')
  }
}

async function fetchFilteredCheckups() {
  if (!selectedPatient.value || !filterDate.value) return
  try {
    const res = await axios.get(
      `http://localhost:3000/api/doctor-checkups/${selectedPatient.value.PatientID}/${filterDate.value}`,
    )
    filteredCheckups.value = res.data
  } catch (err) {
    console.error('❌ Error fetching filtered checkups:', err)
  }
}

const todaysVitals = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return allVitals.value.filter((v) => v.Date === today)
})
</script>

<style scoped>
.doctor-dashboard {
  background: #f5f8fb;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', Tahoma, sans-serif;
}

.main-wrapper {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.patient-info {
  background: #c8e6d0;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  border-left: 6px solid #10b981;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.patient-info h2 {
  font-size: 22px;
  font-weight: bold;
  color: #273b66;
  margin-bottom: 8px;
}

.patient-info p {
  margin: 4px 0;
  color: #374151;
  font-size: 15px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px 20px;
  margin-top: 10px;
  color: #1f2937; /*  Same color for vitals */
}

.vitals-section,
.checkup-form {
  background: #e1e8f5;
  padding: 24px;
  margin-top: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-left: 6px solid #3b82f6;
}

.vitals-section h3 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: bold;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

input,
textarea,
select,
button {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #485cc9;
  font-size: 14px;
  background-color: #f9fafb;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

button {
  background-color: #3b82f6;
  color: #fff;
  font-weight: bold;
  border: none;
  padding: 12px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

.placeholder-text {
  font-size: 16px;
  color: #6b7280;
  margin-top: 40px;
  text-align: center;
}

.vital-box {
  background: #f0f9ff;
  border: 1px solid #dbeafe;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.vital-box p {
  margin: 4px 0;
  font-size: 14px;
  color: #1f2937;
}
.date-filter {
  margin-top: 20px;
  margin-bottom: 16px;
}

.filtered-checkups h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #1e293b;
}
</style>
