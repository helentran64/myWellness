<template>
  <div class="loginContainer">
    <h1>myWellness</h1>
    <div class="loginFormInput">
      <p v-if="loginError" class="loginErrorStyle">Unable to login</p>
      <v-text-field
        label="Username"
        variant="outlined"
        type="text"
        v-model="username"
      ></v-text-field>
      <v-text-field
        label="Password"
        variant="outlined"
        type="password"
        v-model="password"
      ></v-text-field>
    </div>
    <div class="buttonContainer">
      <v-btn class="capitalizeButton" color="primary" @click="LogUserIn" style="width: 400px"
        >Log in</v-btn
      >
    </div>
    <div class="noAccount">
      <p>
        Already have an account?
        <RouterLink to="/signup" class="router-link-item">Sign Up</RouterLink>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VBtn, VTextField } from 'vuetify/components'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const loginError = ref(false)
const router = useRouter()
async function LogUserIn() {
  try {
    const res = await axios.get(`http://localhost:3000/api/users/get_by_username/${username.value}`)
    if (res.data.data.password === password.value) {
      // Redirect to the home page if login is successful
      router.push('/')
    } else {
      loginError.value = true
    }
  } catch {
    loginError.value = true
  }
}
</script>
<style scoped>
h1 {
  text-align: center;
}
.loginError {
  text-align: center;
  color: red;
}
.loginContainer {
  border: 1px solid #aeaeae;
  width: 500px;
  margin: 50px auto 50px auto;
  padding: 50px;
  border-radius: 20px;
}
.loginFormInput {
  margin-top: 15px;
}
.noAccount {
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginErrorStyle {
  color: red;
  text-align: center;
}
</style>
