<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import { VBtn } from 'vuetify/components'

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
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
            <v-btn color="primary" class="mr-2">Sign Out</v-btn>
            <!-- Only see sign up and log in button if the user is signed out -->
            <v-btn color="primary" class="mr-2" to="/signup">Sign up</v-btn>
            <v-btn color="primary" class="mr-2">Log In</v-btn>
          </span>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

<style scoped>
.navbar {
  padding: 15px;
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
