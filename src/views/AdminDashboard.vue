<template>
  <div class="admin-dashboard">
    <AppHeader />
    <div class="main-wrapper">
      <Sidebar @employeeSelected="selectEmployee" />

      <main class="dashboard-content">
        <div class="dashboard-header">
          <h2 class="dashboard-title">Dashboard Overview</h2>
          <button class="add-employee-button" @click="showAddEmployee = true">
            Add New Employee
          </button>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <h3>Total Employees</h3>
            <p>{{ totalEmployees }}</p>
          </div>
          <div class="stat-box">
            <h3>Login Attempts Today</h3>
            <p>{{ totalLogins }}</p>
          </div>
          <div class="stat-box">
            <h3>Successful Logins</h3>
            <p>{{ successfulLogins }}</p>
          </div>
          <div class="stat-box">
            <h3>Failed Logins</h3>
            <p>{{ failedLogins }}</p>
          </div>
        </div>

        <div class="logs-section">
          <h3>Recent Logs</h3>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Action</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(log, index) in logs" :key="index">
                <td>{{ getStaffName(log.StaffID) }}</td>
                <td>{{ log.Action }}</td>
                <td>{{ formatDate(log.LogTime) }}</td>
                <td :class="log.Status === 'Success' ? 'success' : 'failed'">
                  {{ log.Status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <AddEmployeeModal v-if="showAddEmployee" @close="showAddEmployee = false" />
      </main>

      <aside class="employee-detail">
        <div v-if="selectedEmployee" class="detail-card">
          <h3 class="employee-name">{{ selectedEmployee.FullName }}</h3>
          <ul class="detail-list">
            <li><strong>Email:</strong> {{ selectedEmployee.Email }}</li>
            <li><strong>Phone:</strong> {{ selectedEmployee.Phone || 'N/A' }}</li>
            <li><strong>CNIC:</strong> {{ selectedEmployee.CNIC }}</li>
            <li><strong>Last Login:</strong> {{ getLastLogin(selectedEmployee.StaffID) }}</li>
          </ul>

          <h4 class="activity-heading">Recent Activity</h4>
          <ul class="activity-log">
            <li v-for="(log, idx) in filteredActivityLogs" :key="idx">
              <span>{{ formatDate(log.LogTime) }}</span> — <em>{{ log.Action }}</em>
            </li>
          </ul>
        </div>
        <div v-else class="empty-detail">
          <p>Select an employee to view details.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/AdminSidebar.vue'
import AddEmployeeModal from '@/components/AddEmployeeModal.vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const selectedEmployee = ref(null)
const showAddEmployee = ref(false)
const logs = ref([])
const staff = ref([])

const totalEmployees = computed(() => staff.value.length)
const successfulLogins = computed(() => logs.value.filter((l) => l.Status === 'Success').length)
const totalLogins = computed(() => logs.value.filter((l) => l.Status === 'Success').length)
const failedLogins = computed(() => logs.value.filter((l) => l.Status === 'Failed').length)

const filteredActivityLogs = computed(() => {
  if (!selectedEmployee.value) return []
  return logs.value.filter((log) => log.StaffID === selectedEmployee.value.StaffID)
})

function selectEmployee(employee) {
  selectedEmployee.value = employee
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString()
}

function getStaffName(staffID) {
  const person = staff.value.find((s) => s.StaffID === staffID)
  return person ? person.FullName : 'Unknown'
}

function getLastLogin(staffID) {
  const userLogs = logs.value
    .filter((log) => log.StaffID === staffID && log.Status === 'Success')
    .sort((a, b) => new Date(b.LogTime) - new Date(a.LogTime))
  return userLogs.length ? formatDate(userLogs[0].LogTime) : 'Unknown'
}

onMounted(async () => {
  try {
    const [staffRes, logsRes] = await Promise.all([
      axios.get('http://localhost:3000/api/staff'),
      axios.get('http://localhost:3000/api/logs'),
    ])
    staff.value = staffRes.data
    logs.value = logsRes.data
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
  }
})
</script>

<style scoped>
.admin-dashboard {
  background-color: #c3dcec;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', sans-serif;
  color: black;
}

.main-wrapper {
  display: flex;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-title {
  font-size: 22px;
  font-weight: bold;
  color: black;
}

.add-employee-button {
  background-color: #f13645;
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  border-left: 5px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  transition: transform 0.2s ease;
  color: #0f172a;
}

.stat-box:hover {
  transform: translateY(-4px);
}

.stat-box h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #374151;
}

.stat-box p {
  font-weight: bold;
  font-size: 28px;
  margin: 0;
  color: #1e293b;
}

.logs-section table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  color: black;
}

.logs-section h3 {
  font-weight: bold;
  margin-bottom: 12px;
  color: black;
}

.logs-section th {
  font-weight: bold;
  background-color: #f0f4f8;
  padding: 12px;
}

.logs-section td {
  padding: 12px;
  text-align: center;
  border-bottom: 2px solid #f0f0f0;
}

.success {
  color: green;
  font-weight: bold;
}

.failed {
  color: red;
  font-weight: bold;
}
.employee-detail {
  width: 320px;
  padding: 24px;
  background-color: #ffffff;
  border-left: 1px solid #ddd;
  color: #1f2937;
  display: flex;
  flex-direction: column;
}

.detail-card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.employee-name {
  font-size: 25px;
  color: black;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  font-size: 15px;
  line-height: 1.9;
}

.detail-list li {
  margin-bottom: 6px;
}

.detail-list li::before {
  content: '•';
  color: #3b82f6;
  margin-right: 6px;
}

.detail-list li strong {
  color: #374151;
  display: inline-block;
  width: 90px;
}

/* ICONS */
.detail-list li:nth-child(1)::before {
  content: '📧';
}
.detail-list li:nth-child(2)::before {
  content: '📞';
}
.detail-list li:nth-child(3)::before {
  content: '🆔';
}
.detail-list li:nth-child(4)::before {
  content: '🕒';
}

.activity-heading {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #f72424;
}

.activity-log {
  list-style: none;
  padding-left: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #374151;
}

.activity-log li {
  margin-bottom: 6px;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 4px;
}

.empty-detail {
  font-size: 14px;
  color: #555;
  text-align: center;
  margin-top: 50px;
}
</style>
