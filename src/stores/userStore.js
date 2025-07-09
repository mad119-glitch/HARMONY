import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref(null)

    function setUser(data) {
      user.value = data
    }

    function clearUser() {
      user.value = null
    }

    return { user, setUser, clearUser }
  },
  {
    persist: true, // ✅ Enable persistence
  },
)
