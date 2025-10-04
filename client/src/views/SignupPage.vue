<template>
  <div class="signupContainer">
    <h1>myWellness</h1>
    <div class="signupFormInput">
      <v-text-field
        v-model="firstName"
        label="First Name"
        variant="outlined"
        type="text"
        density="compact"
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        label="Last Name"
        variant="outlined"
        type="text"
        density="compact"
      ></v-text-field>
      <v-text-field
        v-model="email"
        label="Email"
        variant="outlined"
        type="email"
        density="compact"
      ></v-text-field>
      <v-text-field
        v-model="username"
        label="Username"
        variant="outlined"
        type="text"
        density="compact"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        variant="outlined"
        type="password"
        density="compact"
      ></v-text-field>
      <v-btn class="capitalizeButton" color="primary" style="width: 400px" @click="signup"
        >Sign Up</v-btn
      >
      <div class="hasAccount">
        <p>
          Already have an account?
          <RouterLink to="/login" class="router-link-item">Log In</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VBtn, VTextField } from 'vuetify/components'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter, RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const username = ref('')
const password = ref('')

/**
 * Add user into the database after signing up for an account
 */
async function signup() {
  const user = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    username: username.value,
    password: password.value,
  }
  try {
    const res = await axios.post('http://localhost:3000/api/users/create', user)
    if (res.status === 201) {
      const user = await axios.get(
        `http://localhost:3000/api/users/get_by_username/${username.value}`,
      )
      if (user.status === 200) {
        userStore.login(user.data.data)
        userStore.login({
          username: user.data.data.username,
          fullName: user.data.data.firstName + ' ' + user.data.data.lastName,
          email: user.data.data.email,
        })
        router.push('/food-questionnaire')
      }
    }
  } catch (error) {
    console.error('Error signing up:', error)
  }
}
</script>
<style scoped>
h1 {
  text-align: center;
}
.signupContainer {
  border: 1px solid #aeaeae;
  width: 500px;
  margin: 50px auto 50px auto;
  padding: 50px;
  border-radius: 20px;
}
.signupFormInput {
  margin-top: 15px;
}
.hasAccount {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
