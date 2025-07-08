<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Welcome to HARMONY</h2>
      <p class="subtitle">Please login to continue</p>

      <form @submit.prevent="login">
        <select v-model="role" required class="role-select">
          <option value="" disabled>Select Role</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="pharmacist">Pharmacist</option>
        </select>

        <input type="text" v-model="email" placeholder="Enter Email" required />
        <input type="password" v-model="password" placeholder="Enter Password" required />

        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'UserLogin' })

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const email = ref('')
const password = ref('')
const role = ref('')
const router = useRouter()
const userStore = useUserStore()

async function login() {
  if (!role.value) {
    alert('Please select your role before logging in.')
    return
  }

  try {
    const response = await axios.get('http://localhost:3000/api/staff')
    const staff = response.data

    const matchedUser = staff.find(
      (user) =>
        user.Email.toLowerCase() === email.value.toLowerCase() &&
        user.Password === password.value &&
        user.RoleID === getRoleId(role.value),
    )

    if (matchedUser) {
      // Save user to Pinia store
      userStore.setUser(matchedUser)

      // Redirect to appropriate dashboard
      switch (role.value) {
        case 'admin':
          router.push('/admin-dashboard')
          break
        case 'doctor':
          router.push('/doctor-dashboard')
          break
        case 'nurse':
          router.push('/nurse-dashboard')
          break
        case 'pharmacist':
          router.push('/pharmacist-dashboard')
          break
      }
    } else {
      alert('Invalid email, password, or role.')
    }
  } catch (err) {
    console.error('Login failed:', err)
    alert('Server error. Please try again later.')
  }
}

function getRoleId(role) {
  switch (role) {
    case 'admin':
      return 1
    case 'doctor':
      return 2
    case 'nurse':
      return 3
    case 'pharmacist':
      return 4
    default:
      return 0
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(to right, #e3f2fd, #f0f4f8);
  padding: 20px;
  box-sizing: border-box;
}

.auth-box {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.2s;
}

.auth-box:hover {
  transform: translateY(-3px);
}

h2 {
  color: #0d47a1;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
}

input,
.role-select {
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input:focus,
.role-select:focus {
  border-color: #3b82f6;
  outline: none;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2563eb;
}
</style>
