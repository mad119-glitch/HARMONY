<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h2 class="modal-heading">Add New Entry</h2>

      <div class="choice-boxes">
        <div class="box" @click="((showPatientForm = true), (showStaffForm = false))">
          <h3>Add Patient</h3>
        </div>
        <div class="box" @click="((showStaffForm = true), (showPatientForm = false))">
          <h3>Add Staff</h3>
        </div>
      </div>

      <!-- Patient Entry Form -->
      <div v-if="showPatientForm" class="form-section">
        <h3 class="form-title">New Patient Entry</h3>
        <form @submit.prevent="submitPatient">
          <input v-model="patient.name" placeholder="Full Name" required />
          <input v-model="patient.cnic" placeholder="CNIC" required />
          <input v-model="patient.phone" placeholder="Phone" required />
          <input v-model="patient.age" type="number" placeholder="Age" required />
          <select v-model="patient.gender">
            <option disabled value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input v-model="patient.createdAt" type="date" required />
          <button type="submit">Submit</button>
        </form>
      </div>

      <!-- Staff Entry Form -->
      <div v-if="showStaffForm" class="form-section">
        <h3 class="form-title">Add New Staff Member</h3>
        <form @submit.prevent="submitStaff">
          <select v-model="staff.role" required>
            <option disabled value="">Select Role</option>
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Pharmacist</option>
            <option>Admin</option>
          </select>
          <input v-model="staff.name" placeholder="Full Name" required />
          <input v-model="staff.email" type="email" placeholder="Email" required />
          <input v-model="staff.password" type="password" placeholder="Password" required />
          <select v-model="staff.gender">
            <option disabled value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input v-model="staff.phone" placeholder="Phone" required />
          <input v-model="staff.age" type="number" placeholder="Age" required />
          <input v-model="staff.createdAt" type="date" required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const showPatientForm = ref(false)
const showStaffForm = ref(false)

const patient = ref({
  name: '',
  cnic: '',
  phone: '',
  age: '',
  gender: '',
  createdAt: '',
})

const staff = ref({
  role: '',
  name: '',
  email: '',
  password: '',
  gender: '',
  phone: '',
  age: '',
  createdAt: '',
})

async function submitPatient() {
  try {
    await axios.post('http://localhost:3000/api/patient', patient.value)
    alert('✅ Patient added successfully')
  } catch (err) {
    console.error('❌ Failed to add patient:', err.message)
    alert('❌ Error adding patient')
  }
}

async function submitStaff() {
  try {
    await axios.post('http://localhost:3000/api/staff', staff.value)
    alert('✅ Staff added successfully')
  } catch (err) {
    console.error('❌ Failed to add staff:', err.message)
    alert('❌ Error adding staff')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-heading {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
.choice-boxes {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}
.box {
  flex: 1;
  background-color: #ce5f5f;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s;
}
.box:hover {
  background-color: #3b82f6;
  color: white;
}
.form-section {
  margin-top: 20px;
}
.form-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input,
select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}
button {
  background-color: #ce5f5f;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: #2563eb;
}
</style>
