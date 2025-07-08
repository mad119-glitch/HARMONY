<template>
  <header class="topbar">
    <div class="logo">
      <img src="@/assets/harmonylogo.jpg" alt="Harmony Logo" />
      <span class="logo-text">HARMONY</span>
    </div>
    <div class="user" @click="showLogout = !showLogout">
      <div class="avatar">{{ userInitials }}</div>
      <span class="username">{{ userName }}</span>
      <div v-if="showLogout" class="logout-popup">
        <button @click="logout">Logout</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const showLogout = ref(false)

const userStore = useUserStore()

const userName = computed(() => userStore.user?.FullName || 'Guest')
const userInitials = computed(() =>
  userName.value
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase(),
)

function logout() {
  userStore.clearUser()
  router.push('/')
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #b3dbe7;
  color: black;
  padding: 1.5% 24px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 25px;
  font-weight: bold;
}
.logo img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}

.avatar {
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  font-weight: 500;
}

.logout-popup {
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  color: black;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.logout-popup button {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
