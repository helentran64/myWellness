<template>
  <div class="aboutContainer">
    <v-row>
      <v-col v-for="info in information" :key="info.title" cols="6" sm="12" md="6" class="mb-4">
        <v-card :prepend-icon="info.icon" width="100%" variant="outlined">
          <template v-slot:title>
            {{ info.title }}
          </template>
          <v-card-text>
            {{ info.content }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script setup lang="ts">
import { VCard, VCardText, VRow, VCol } from 'vuetify/components'
const information = [
  {
    icon: 'mdi-account',
    title: 'Personalization',
    content:
      'You can select your specific allergies (e.g., peanuts, shellfish, etc.) or intolerances (e.g., lactose, gluten, etc.) and keep track of your food intake.',
  },
  {
    icon: 'mdi-calendar',
    title: 'Food Logging',
    content:
      'You can log your food intake, including meals, snacks, and beverages, to monitor your daily nutrition.',
  },
  {
    icon: 'mdi-information',
    title: 'Ingredient and Allergen Detection',
    content:
      'Automatically flag ingredients that matches your allergens/intolerants. Also warns about potential cross-contamination.',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Symptom Tracker',
    content:
      'Record symptoms (rash, bloating, nausea) after eating, track how long after eating symptoms appear, rate reactions on a scale (1-10), and log how long they last',
  },
  {
    icon: 'mdi-share-variant',
    title: 'Community Support',
    content:
      'You can connect with others who share similar dietary restrictions, share experiences, and provide support.',
  },
  {
    icon: 'mdi-chart-bar',
    title: 'Data report and sharing',
    content:
      'Download a report of your food intake, symptoms, and reactions to share with healthcare professionals.',
  },
]
</script>
<style scoped>
.aboutContainer {
  padding: 40px;
}
</style>
