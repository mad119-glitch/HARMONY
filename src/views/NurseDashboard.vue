// ✅ nurse-dashboard.vue (Updated)
<template>
  <div class="nurse-dashboard">
    <AppHeader />
    <div class="main-wrapper">
      <PatientSidebar @patientSelected="selectPatient" />

      <main class="main-content">
        <div v-if="selectedPatient" class="patient-info">
          <h2>{{ selectedPatient.FullName }}</h2>
          <p><strong>CNIC:</strong> {{ selectedPatient.CNIC }}</p>
          <p><strong>Gender:</strong> {{ selectedPatient.Gender }}</p>
          <p><strong>Age:</strong> {{ selectedPatient.Age }}</p>
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
              <p><strong>Time:</strong> {{ v.Time }}</p>
              <p><strong>BP:</strong> {{ v.BloodPressure }}</p>
              <p><strong>HR:</strong> {{ v.HeartRate }}</p>
              <p><strong>Sugar:</strong> {{ v.BloodSugar }}</p>
              <p><strong>Temp:</strong> {{ v.Temperature }}</p>
              <p><strong>O2 Sat:</strong> {{ v.OxygenSaturation }}</p>
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
  background: #eef3f8;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', sans-serif;
}
.main-wrapper {
  display: flex;
}
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
.patient-info {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: black;
}
.vital-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}
input,
textarea,
select,
button {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}
button {
  background-color: #3b82f6;
  color: black;
  cursor: pointer;
  font-weight: bold;
}
.date-filter {
  margin-top: 20px;
}
.vitals-display {
  margin-top: 20px;
}
.vital-box {
  background: #f3f4f6;
  border: 1px solid #ddd;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
}
.placeholder-text {
  font-size: 16px;
  color: black;
  margin-top: 40px;
}
</style>
