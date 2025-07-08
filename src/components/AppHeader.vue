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
  background-color: #3b82f6;
  color: white;
  padding: 16px 32px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
}

.avatar {
  background-color: #1e40af;
  color: white;
  font-weight: bold;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.4);
}

.username {
  font-weight: 500;
  font-size: 14px;
  color: #f3f4f6;
  user-select: none;
}

.logout-popup {
  position: absolute;
  top: 120%;
  right: 0;
  background: #ffffff;
  color: #111827;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 10;
  animation: fadeIn 0.2s ease-in-out;
}

.logout-popup button {
  width: 100%;
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.logout-popup button:hover {
  background-color: #dc2626;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
