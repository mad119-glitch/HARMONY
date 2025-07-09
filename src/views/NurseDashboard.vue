// ✅ nurse-dashboard.vue (Updated)
<template>
  <div class="nurse-dashboard">
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

        <div v-if="selectedPatient" class="vital-form">
          <h3>Enter Vitals</h3>
          <form @submit.prevent="submitVitals">
            <div class="grid">
              <input
                v-model="vitals.BloodPressure"
                placeholder="Blood Pressure (e.g. 120/80)"
                required
              />
              <input v-model="vitals.HeartRate" type="number" placeholder="Heart Rate" required />
              <input v-model="vitals.BloodSugar" type="number" placeholder="Blood Sugar" required />
              <input
                v-model="vitals.Temperature"
                type="number"
                placeholder="Temperature"
                required
              />
              <input
                v-model="vitals.OxygenSaturation"
                type="number"
                placeholder="Oxygen Saturation"
                required
              />
              <input v-model="vitals.Time" type="time" required />
              <input v-model="vitals.Date" type="date" required />
              <textarea v-model="vitals.Notes" placeholder="Notes (optional)"></textarea>
            </div>
            <button type="submit">Save Vitals</button>
          </form>

          <div class="date-filter">
            <label>Filter by Date:</label>
            <input type="date" v-model="filterDate" />
          </div>

          <div class="vitals-display" v-if="filteredVitals.length">
            <h4>Vitals on {{ filterDate }}</h4>
            <div class="vital-box" v-for="(v, index) in filteredVitals" :key="index">
              <div class="info-grid">
                <p><strong>Time:</strong> {{ v.Time }}</p>
                <p><strong>BP:</strong> {{ v.BloodPressure }}</p>
                <p><strong>HR:</strong> {{ v.HeartRate }}</p>
                <p><strong>Sugar:</strong> {{ v.BloodSugar }}</p>
                <p><strong>Temp:</strong> {{ v.Temperature }}</p>
                <p><strong>O2 Sat:</strong> {{ v.OxygenSaturation }}</p>
              </div>
              <p><strong>Notes:</strong> {{ v.Notes }}</p>
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
import { useUserStore } from '@/stores/userStore' // ✅ Corrected import

const userStore = useUserStore() // ✅ Use userStore

const selectedPatient = ref(null)
const vitals = ref({
  BloodPressure: '',
  HeartRate: '',
  BloodSugar: '',
  Temperature: '',
  OxygenSaturation: '',
  Notes: '',
  Date: '',
  Time: '',
})

const allVitals = ref([])
const filterDate = ref('')

function selectPatient(patient) {
  selectedPatient.value = patient
  fetchVitals(patient.PatientID)
}

async function fetchVitals(patientId) {
  try {
    const res = await axios.get(`http://localhost:3000/api/vitals/${patientId}`)
    allVitals.value = res.data
  } catch (err) {
    console.error('Error fetching vitals:', err)
  }
}

async function submitVitals() {
  try {
    const payload = {
      ...vitals.value,
      PatientID: selectedPatient.value.PatientID,
      CheckedBy: userStore.user?.FullName || 'Unknown Nurse', // ✅ Add nurse name
    }

    await axios.post('http://localhost:3000/api/vitals', payload)
    alert('Vitals saved successfully!')
    fetchVitals(selectedPatient.value.PatientID)
  } catch (err) {
    alert('Error saving vitals')
    console.error(err)
  }
}

const filteredVitals = computed(() => {
  return allVitals.value.filter((v) => {
    return v.Date && filterDate.value && v.Date.split('T')[0] === filterDate.value
  })
})
</script>

<style scoped>
.nurse-dashboard {
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
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-left: 6px solid #10b981;
}

.patient-info h2 {
  margin-bottom: 8px;
  font-size: 22px;
  font-weight: bold;
  color: #273b66;
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
}

.vital-form {
  background: #c8d7eb;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border-left: 6px solid #3b82f6;
}

.vital-form h3 {
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
  border: 1px solid #d1d5db;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  background-color: #f9fafb;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3b82f6;
  background-color: #fff;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
  border: none;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}

.date-filter {
  margin-top: 24px;
}

.date-filter label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-right: 10px;
}

.vitals-display {
  margin-top: 24px;
}

.vitals-display h4 {
  font-size: 16px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #111827;
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

.placeholder-text {
  font-size: 16px;
  color: #6b7280;
  margin-top: 40px;
  text-align: center;
}
</style>
