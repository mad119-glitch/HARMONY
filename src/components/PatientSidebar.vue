<template>
  <aside class="patient-sidebar">
    <div class="search-boxes">
      <input type="text" v-model="searchCNIC" placeholder="Search by CNIC" class="search-input" />
      <input type="text" v-model="searchName" placeholder="Search by Name" class="search-input" />
    </div>

    <h3 class="section-title">PATIENTS</h3>
    <ul class="patient-list">
      <li
        v-for="patient in filteredPatients"
        :key="patient.PatientID"
        class="patient-item"
        @click="emit('patientSelected', patient)"
      >
        <div class="avatar">{{ getInitials(patient.FullName) }}</div>
        <div class="info">
          <div class="name">{{ patient.FullName }}</div>
          <div class="cnic">CNIC: {{ patient.CNIC }}</div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['patientSelected'])
const patients = ref([])
const searchCNIC = ref('')
const searchName = ref('')

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/patients')
    patients.value = res.data
  } catch (err) {
    console.error('Error fetching patients:', err)
  }
})

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

const filteredPatients = computed(() => {
  return patients.value.filter(
    (p) =>
      p.CNIC.includes(searchCNIC.value) &&
      p.FullName.toLowerCase().includes(searchName.value.toLowerCase()),
  )
})
</script>
<style scoped>
.patient-sidebar {
  width: 270px;
  background-color: #f8f9fb;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  border-right: 1px solid #e5e7eb;
  box-sizing: border-box;
}

.search-boxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #6085d4;
  background-color: #ffffff;
  font-size: 14px;
  color: #111827;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
}

.search-input:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #374151;
}

.patient-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.patient-item:hover {
  background-color: #e7f0fc;
}

.avatar {
  background-color: #10b981;
  color: white;
  font-weight: 600;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 14px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
}

.cnic {
  font-size: 12px;
  color: #6b7280;
}
</style>
