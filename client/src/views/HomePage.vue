<template>
  <div class="homepageWelcomeContainer">
    <div class="homepageWelcomeContent">
      <div class="mr-10">
        <p>
          Empower your wellness journey <br />
          Your path to a healthier life starts here
        </p>
        <v-btn color="primary" to="/signup">Get Started</v-btn>
        <!-- @todo need to create page that explains the application -->
        <v-btn color="secondary" class="ml-2">Learn More</v-btn>
      </div>
      <div class="ml-10">
        <div class="homepageWelcomeImage">
          <div class="homepageWelcomeImagePlaceholder">image placeholder</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VBtn } from 'vuetify/components'
</script>
<style scoped>
.homepageWelcomeContainer {
  height: 50vh;
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
  padding-right: 50px;
}
.homepageWelcomeImagePlaceholder {
  width: 500px;
  height: 300px;
  background-color: white;
  color: black;
}
</style>
