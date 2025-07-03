<template>
  <div class="admin-dashboard">
    <AppHeader />
    <div class="main-wrapper">
      <Sidebar @employeeSelected="selectEmployee" />

      <main class="dashboard-content">
        <h2 class="dashboard-title">Dashboard Overview</h2>
        <div class="stats-grid">
          <div class="stat-box">
            <h3>Total Employees</h3>
            <p>24</p>
          </div>
          <div class="stat-box">
            <h3>Active Sessions</h3>
            <p>12</p>
          </div>
          <div class="stat-box">
            <h3>Login Attempts Today</h3>
            <p>47</p>
          </div>
          <div class="stat-box">
            <h3>Failed Logins</h3>
            <p>8</p>
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
                <td>{{ log.name }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.time }}</td>
                <td :class="log.status === 'Success' ? 'success' : 'failed'">
                  {{ log.status }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <aside class="employee-detail">
        <div v-if="selectedEmployee">
          <h3>{{ selectedEmployee.name }}</h3>
          <p><strong>Email:</strong> {{ selectedEmployee.email }}</p>
          <p><strong>Phone:</strong> {{ selectedEmployee.phone }}</p>
          <p><strong>CNIC:</strong> {{ selectedEmployee.cnic }}</p>
          <p><strong>Last Login:</strong> {{ selectedEmployee.lastLogin }}</p>

          <h4>Recent Activity</h4>
          <ul>
            <li v-for="(activity, idx) in selectedEmployee.activity" :key="idx">
              {{ activity }}
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Select an employee to view details.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue'
import Sidebar from '@/components/AdminSidebar.vue'
import { ref } from 'vue'

const selectedEmployee = ref(null)

const logs = ref([
  { name: 'Dr. John Smith', action: 'Login', time: 'Today, 14:32', status: 'Success' },
  { name: 'Sarah Johnson', action: 'Login', time: 'Today, 14:18', status: 'Success' },
  { name: 'Unknown', action: 'Login', time: 'Today, 13:57', status: 'Failed' },
  { name: 'Michael Chen', action: 'Login', time: 'Today, 13:45', status: 'Success' },
])

function selectEmployee(employee) {
  selectedEmployee.value = employee
}
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
  height: calc(100vh - 60px); /* Full height minus header */
  overflow-y: auto;
}

.dashboard-title {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
  color: black;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: left;
  color: black;
}
.stat-box h3 {
  font-size: 14px;
}
.stat-box p {
  font-weight: bold;
  font-size: 24px;
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
}
.logs-section th {
  font-weight: bold;
}
.logs-section td {
  padding: 12px;
  text-align: center;
  border-bottom: 2px solid #ddcdcd;
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
  width: 300px;
  padding: 24px;
  background-color: #ffffff;
  border-left: 1px solid #ddd;
  color: black;
}

.employee-detail h3 {
  margin-top: 0;
  color: #1a237e;
}
</style>
