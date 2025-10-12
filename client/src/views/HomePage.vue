<template>
  <div class="homepageWelcomeContainer">
    <div class="homepageWelcomeContent">
      <div class="mr-10">
        <p>
          Empower your wellness journey. <br />
          <span style="font-size: 1.3rem">Your path to a healthier life starts here.</span>
        </p>
        <v-btn color="primary" to="/signup" v-if="!userStore.isLoggedIn">Get Started</v-btn>
        <v-btn color="secondary" to="/learn-more" class="ml-2">Learn More</v-btn>
      </div>
      <div class="ml-10">
        <div class="homepageWelcomeImage">
          <img src="@/assets/images/homepageImage.png" alt="notes image" height="400px" />
        </div>
      </div>
    </div>
  </div>
  <v-row justify="center" class="my-10">
    <v-col cols="12" md="5" lg="3" xl="2">
      <v-card class="pa-5 mx-auto hover-card" style="max-width: 420px" @click="$router.push('/food-log')">
        <h2 class="text-center mb-4">Food Log</h2>
        <p class="text-center cardDescription">
          Track your meals and snacks to gain insights into your eating habits and make informed
          dietary choices.
        </p>
      </v-card>
    </v-col>

    <v-col cols="12" md="5" lg="3" xl="2">
      <v-card class="pa-5 mx-auto hover-card" style="max-width: 420px">
        <h2 class="text-center mb-4">Wellness Journal</h2>
        <p class="text-center cardDescription">
          Reflect on your daily experiences, emotions, and thoughts to foster self-awareness and
          personal growth.
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { VBtn, VCard, VRow, VCol } from 'vuetify/components'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
</script>
<style scoped>
.homepageWelcomeContainer {
  height: 80vh;
  width: 100vw;
  margin: 0;
  font-size: 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}
p {
  font-size: 2rem;
  margin: 10px 0;
}
.homepageWelcomeContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 40%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  margin: 50px;
}
.homepageWelcomeImage {
  flex: 1;
  display: flex;
  justify-content: center;
}
.cardDescription {
  font-size: 1.2rem;
}
.hover-card {
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-4px);
}
</style>
