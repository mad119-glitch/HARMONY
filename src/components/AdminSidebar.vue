<template>
  <aside class="sidebar">
    <div class="search-box">
      <input type="text" v-model="searchTerm" placeholder="Search employees..." />
    </div>

    <div class="filter-buttons">
      <button
        v-for="role in roles"
        :key="role"
        :class="{ active: selectedRole === role }"
        @click="selectRole(role)"
      >
        {{ role }}
      </button>
    </div>

    <h3 class="section-title">EMPLOYEES</h3>
    <ul class="employee-list">
      <li
        v-for="employee in filteredEmployees"
        :key="employee.StaffID"
        class="employee-item"
        @click="emit('employeeSelected', employee)"
      >
        <div class="avatar">{{ getInitials(employee.FullName) }}</div>
        <div class="info">
          <div class="name">{{ employee.FullName }}</div>
          <div class="role">{{ getRoleLabel(employee.RoleID) }}</div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue'
import axios from 'axios'

const emit = defineEmits(['employeeSelected'])

const searchTerm = ref('')
const selectedRole = ref('All')

// ✅ Use singular role names to match getRoleLabel()
const roles = ['All', 'Doctor', 'Nurse', 'Pharmacist']

const employees = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/staff')
    employees.value = response.data
  } catch (err) {
    console.error('Failed to fetch staff:', err)
  }
})

function selectRole(role) {
  selectedRole.value = role
}

function getRoleLabel(roleId) {
  switch (roleId) {
    case 1:
      return 'Admin'
    case 2:
      return 'Doctor'
    case 3:
      return 'Nurse'
    case 4:
      return 'Pharmacist'
    default:
      return 'Unknown'
  }
}

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchesSearch = emp.FullName.toLowerCase().includes(searchTerm.value.toLowerCase())
    const role = getRoleLabel(emp.RoleID)
    const matchesRole = selectedRole.value === 'All' || role === selectedRole.value
    return matchesSearch && matchesRole
  })
})

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
</script>

<style scoped>
.sidebar {
  width: 270px;
  background-color: #f8f9fb;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  position: sticky;
  top: 60px;
  border-right: 1px solid #e0e0e0;
  box-sizing: border-box;
}

.search-box input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
  font-size: 14px;
  border: 1px solid rgb(179, 40, 52);
  border-color: #f63b3b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(246, 59, 59, 0.2);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-buttons button {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  background-color: #e0e0e0;
  transition: background-color 0.2s ease;
}

.filter-buttons button.active,
.filter-buttons button:hover {
  background-color: #3b82f6;
  color: white;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #444;
}

.employee-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.employee-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.employee-item:hover {
  background-color: #e7f0fc;
}

.avatar {
  background-color: #3b82f6;
  color: white;
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
}

.role {
  font-size: 12px;
  color: #777;
}
</style>
