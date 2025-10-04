<template>
  <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 20px;">
    <h1 style="text-align: center;">Personal Information:</h1>
    <div
      v-for="section in sections"
      :key="section.heading"
      style="display: flex; align-items: center; gap: 8px; width: 80%; margin-left: auto; margin-right: auto"
    >
      <v-text-field
        :id="section.heading"
        :label="section.heading"
        :readonly="true"
        variant="outlined"
        :model-value="Array.isArray(section.field) ? section.field.join(', ') : section.field"
        style="flex: 1"
      />
      <v-btn
        icon
        size="small"
        @click="editSection(section)"
        style="align-self: flex-start; margin-top: 8px"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { VTextField, VBtn, VIcon } from 'vuetify/components'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

interface Section {
  heading: string
  field: string | string[] | undefined
}

const sections = ref<Section[]>([
  {
    heading: 'Name',
    field: 'N/A',
  },
  {
    heading: 'Username',
    field: 'N/A',
  },
  {
    heading: 'Allergies',
    field: ['N/A'],
  },
  { heading: 'Medical Conditions', field: ['N/A'] },
  { heading: 'Food Intolerances', field: ['N/A'] },
])

onMounted(() => {
  init()
})

async function init() {
  // get name and username from user store
  const userStore = useUserStore()
  sections.value[0].field = userStore.user?.fullName
  sections.value[1].field = userStore.user?.username
  // get questionnaire data from backend and populate the fields
  try {
    const res = await axios.get(
      'http://localhost:3000/api/questionnaire/get_by_username/' + userStore.user?.username,
    )
    const restrictions = JSON.parse(res.data.data.restriction)
    restrictions.forEach((restriction: { type: string; value: string }) => {
      if (restriction.type === 'allergies') {
        sections.value[2].field = restriction.value.length ? restriction.value : ['N/A']
      } else if (restriction.type === 'medicalConditions') {
        sections.value[3].field = restriction.value.length ? restriction.value : ['N/A']
      } else if (restriction.type === 'foodIntolerances') {
        sections.value[4].field = restriction.value.length ? restriction.value : ['N/A']
      }
    })
  } catch (error) {
    console.error('Error fetching questionnaire data:', error)
  }
}

function editSection(section: Section) {
  // @todo Implement edit logic here
  console.log('Edit clicked for', section.heading)
}
</script>
<style scoped></style>
