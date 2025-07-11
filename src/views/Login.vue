<template>
  <div class="auth-container">
    <div class="auth-box">
      <img src="@/assets/harmonylogo.jpg" alt="Harmony Logo" class="logo" />
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
        <div class="password-wrapper">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Enter Password"
            required
          />
          <span class="toggle-eye" @click="showPassword = !showPassword">
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="eye-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>

            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="eye-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.994 9.994 0 012.438-4.368M9.88 9.88a3 3 0 104.24 4.24M3 3l18 18"
              />
            </svg>
          </span>
        </div>

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
const showPassword = ref(false)

async function login() {
  if (!role.value) {
    alert('Please select your role before logging in.')
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      password: password.value,
      role: role.value,
    })

    const matchedUser = response.data.user

    if (matchedUser) {
      userStore.setUser(matchedUser)

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

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 16px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 42px;
}

.toggle-eye {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #3b82f6;
}

.eye-icon {
  width: 20px;
  height: 20px;
}
</style>
