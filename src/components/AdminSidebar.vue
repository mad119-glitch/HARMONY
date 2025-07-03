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
        :key="employee.name"
        class="employee-item"
        @click="emit('employeeSelected', employee)"
      >
        <div class="avatar">{{ getInitials(employee.name) }}</div>
        <div class="info">
          <div class="name">{{ employee.name }}</div>
          <div class="role">{{ employee.role }}</div>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const emit = defineEmits(['employeeSelected'])

const searchTerm = ref('')
const selectedRole = ref('All')

const roles = ['All', 'Doctors', 'Nurses', 'Pharmacists']

const employees = ref([
  {
    name: 'Dr. John Smith',
    role: 'Doctor',
    email: 'john@harmony.com',
    phone: '0322-1234567',
    cnic: '35201-1234567-1',
    lastLogin: 'Today, 14:32',
    activity: ['Login Successful', 'Viewed Patient List', 'Logged Out'],
  },
  {
    name: 'Sarah Johnson',
    role: 'Nurse',
    email: 'sarah@harmony.com',
    phone: '0333-7654321',
    cnic: '35202-9876543-2',
    lastLogin: 'Today, 14:18',
    activity: ['Checked Vitals', 'Assisted Surgery'],
  },
  {
    name: 'Michael Chen',
    role: 'Doctor',
    email: 'michael@harmony.com',
    phone: '0300-4567890',
    cnic: '35203-1111222-3',
    lastLogin: 'Today, 13:45',
    activity: ['Login Successful', 'Prescribed Medicine'],
  },
  {
    name: 'Emily Taylor',
    role: 'Nurse',
    email: 'emily@harmony.com',
    phone: '0345-8899222',
    cnic: '35204-9999888-4',
    lastLogin: 'Today, 12:30',
    activity: ['Assisted in Ward Round'],
  },
  {
    name: 'Robert Garcia',
    role: 'Pharmacist',
    email: 'robert@harmony.com',
    phone: '0311-1234123',
    cnic: '35205-5432123-5',
    lastLogin: 'Today, 11:00',
    activity: ['Issued Medicines'],
  },
  {
    name: 'Jessica Brown',
    role: 'Doctor',
    email: 'jessica@harmony.com',
    phone: '0301-0000001',
    cnic: '35206-7654321-6',
    lastLogin: 'Today, 09:30',
    activity: ['Performed Checkup', 'Updated Records'],
  },
])

function selectRole(role) {
  selectedRole.value = role
}

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesRole =
      selectedRole.value === 'All' ||
      emp.role.toLowerCase().includes(selectedRole.value.toLowerCase())
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
