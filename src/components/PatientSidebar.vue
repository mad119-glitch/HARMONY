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
  background-color: #f3f4f6;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.search-boxes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: black;
}

.patient-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.patient-item:hover {
  background-color: #e7f0fc;
}

.avatar {
  background-color: #10b981;
  color: black;
  font-weight: bold;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 14px;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 600;
  font-size: 14px;
  color: black;
}

.cnic {
  font-size: 12px;
  color: black;
}
</style>
