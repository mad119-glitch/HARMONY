<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Sign Up</h2>

      <form @submit.prevent="signup">
        <input type="text" v-model="name" placeholder="Name" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">Create Account</button>
      </form>

      <p>
        Already have an account?
        <span @click="goToLogin" class="link">Login</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

function signup() {
  alert(`Name: ${name.value}\nEmail: ${email.value}\nPassword: ${password.value}`)
}
function goToLogin() {
  router.push('/')
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #f0f4f8;
  padding: 20px;
  box-sizing: border-box;
}

.auth-box {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #3b82f6;
  font-size: 28px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
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
  margin-top: 14px;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #2563eb;
}

.link {
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
  display: inline-block;
  margin-top: 10px;
}
</style>
