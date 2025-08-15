<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { VBtn } from 'vuetify/components'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function signOut() {
  userStore.logout()
  // Redirect to the home page after signing out
  window.location.href = '/'
}
</script>

<template>
  <header>
    <div>
      <nav>
        <div class="navbar">
          <RouterLink to="/" class="router-link-item logo mt-2">
            <i class="mdi mdi-food-apple"></i>
            <span class="pl-1">myWellness</span>
          </RouterLink>
          <span class="navItems">
            <v-btn @click="toggleTheme" icon="mdi-lightbulb-on" variant="plain" class="mb-2" />
            <!-- Only see sign out button if user is signed in -->
            <v-btn color="primary" class="mr-2" v-if="userStore.isLoggedIn" @click="signOut">Sign Out</v-btn>
            <!-- Only see sign up and log in button if the user is signed out -->
            <v-btn color="primary" class="mr-2" to="/signup" v-if="userStore.isLoggedOut"
              >Sign up</v-btn
            >
            <v-btn color="primary" class="mr-2" to="/login" v-if="userStore.isLoggedOut"
              >Log In</v-btn
            >
          </span>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.navbar {
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
}
.router-link-item {
  text-decoration: none;
  border-radius: 4px;
  margin-right: 10px;
  color: inherit;
  font-size: 1.3rem;
}
.navItems .router-link-item {
  padding: 10px;
}
.navItems {
  margin-left: auto;
  margin-top: 5px;
  font-weight: 600;
}
</style>
