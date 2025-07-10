<template>
  <div class="pharmacist-dashboard">
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
          <h3>Today's Prescribed Medicines</h3>
          <div v-if="todaysCheckups.length">
            <div class="vital-box" v-for="(c, index) in todaysCheckups" :key="index">
              <div class="info-grid">
                <p><strong>Medicine:</strong> {{ c.Medicine }}</p>
                <p><strong>Dosage:</strong> {{ c.Dosage }}</p>
                <p><strong>Days:</strong> {{ c.Days }}</p>
                <p><strong>Checkup Date:</strong> {{ c.CheckupDate }}</p>
                <p><strong>Checked By:</strong> {{ c.CheckedByDoctor }}</p>
              </div>

              <div class="checkup-form">
                <label>Total Price (PKR)</label>
                <input v-model="delivery.TotalPrice" type="number" required />

                <label>Delivered:</label>
                <select v-model="delivery.IsDelivered">
                  <option :value="true">Delivered</option>
                  <option :value="false">Not Delivered</option>
                </select>

                <button @click="submitDelivery(c)">Save Delivery</button>
              </div>
            </div>
          </div>
          <div v-else class="placeholder-text">
            <p>No checkups found for today.</p>
          </div>

          <div class="date-filter">
            <label>Filter Deliveries by Date:</label>
            <input type="date" v-model="filterDate" @change="fetchFilteredDeliveries" />
          </div>

          <div v-if="filteredDeliveries.length" class="filtered-checkups">
            <h4>Deliveries on {{ filterDate }}</h4>
            <div class="vital-box" v-for="(d, index) in filteredDeliveries" :key="index">
              <div class="info-grid">
                <p><strong>Medicine:</strong> {{ d.Medicine }}</p>
                <p><strong>Dosage:</strong> {{ d.Dosage }}</p>
                <p><strong>Days:</strong> {{ d.Days }}</p>
                <p><strong>Price:</strong> Rs. {{ d.TotalPrice }}</p>
                <p><strong>Status:</strong> {{ d.IsDelivered ? 'Delivered' : 'Not Delivered' }}</p>
                <p><strong>Delivered At:</strong> {{ d.DeliveryDateTime }}</p>
                <p><strong>Pharmacist:</strong> {{ d.PharmacistName }}</p>
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
const allCheckups = ref([])
const filterDate = ref('')
const filteredDeliveries = ref([])
const delivery = ref({
  TotalPrice: '',
  IsDelivered: true,
})

function selectPatient(patient) {
  selectedPatient.value = patient
  fetchDoctorCheckups(patient.PatientID)
  filteredDeliveries.value = []
  filterDate.value = ''
}

async function fetchDoctorCheckups(patientId) {
  try {
    const today = new Date().toISOString().split('T')[0]
    const res = await axios.get(`http://localhost:3000/api/doctor-checkups/${patientId}/${today}`)
    allCheckups.value = res.data
  } catch (err) {
    console.error('Error fetching checkups:', err)
  }
}

const todaysCheckups = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return allCheckups.value.filter((c) => c.CheckupDate === today)
})

async function submitDelivery(checkup) {
  try {
    const now = new Date()
    const payload = {
      PatientID: selectedPatient.value.PatientID,
      Medicine: checkup.Medicine,
      Dosage: checkup.Dosage,
      Days: checkup.Days,
      CheckupDate: checkup.CheckupDate,
      TotalPrice: parseFloat(delivery.value.TotalPrice),
      IsDelivered: delivery.value.IsDelivered,
      DeliveryDateTime: now.toISOString(),
      PharmacistName: userStore.user?.FullName || 'Unknown Pharmacist',
    }
    await axios.post('http://localhost:3000/api/medicine-delivery', payload)
    alert('Medicine delivery saved!')
    delivery.value.TotalPrice = ''
  } catch (err) {
    console.error('Error saving delivery:', err)
    alert('Failed to save delivery record')
  }
}

async function fetchFilteredDeliveries() {
  if (!selectedPatient.value || !filterDate.value) return
  try {
    const res = await axios.get(
      `http://localhost:3000/api/medicine-delivery/${selectedPatient.value.PatientID}/${filterDate.value}`,
    )
    filteredDeliveries.value = res.data
  } catch (err) {
    console.error('Error fetching deliveries:', err)
  }
}
</script>

<style scoped>
.pharmacist-dashboard {
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
