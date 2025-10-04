<template>
  <div class="foodQuestionnaire">
    <v-stepper
      v-model="step"
      alt-labels
      :items="['Allergies', 'Medical Conditions', 'Food Intolerances']"
      hide-actions
    >
      <template v-slot:item.1>
        <v-card flat>
          <p class="text-center">Select any known allergies you have.</p>
          <v-checkbox label="Peanuts" value="peanuts" v-model="allergies" density="compact" />
          <v-checkbox label="Shellfish" value="shellfish" v-model="allergies" density="compact" />
          <v-checkbox label="Dairy" value="dairy" v-model="allergies" density="compact" />
          <v-checkbox label="Gluten" value="gluten" v-model="allergies" density="compact" />
          <v-checkbox label="Soy" value="soy" v-model="allergies" density="compact" />
          <v-checkbox label="Eggs" value="eggs" v-model="allergies" density="compact" />
          <v-checkbox label="Tree Nuts" value="tree nuts" v-model="allergies" density="compact" />
          <v-checkbox label="Wheat" value="wheat" v-model="allergies" density="compact" />
          <v-checkbox label="Fish" value="fish" v-model="allergies" density="compact" />
          <v-checkbox label="Other" value="other" v-model="allergies" density="compact" />
          <v-text-field
            v-if="allergies.includes('other')"
            label="Please specify other allergies"
            v-model="otherAllergy"
            variant="outlined"
          />
        </v-card>
      </template>

      <template v-slot:item.2>
        <v-card flat>
          <p class="text-center">Select any known medical conditions</p>
          <v-checkbox
            label="Diabetes"
            value="diabetes"
            v-model="medicalConditions"
            density="compact"
          />
          <v-checkbox
            label="Hypertension"
            value="hypertension"
            v-model="medicalConditions"
            density="compact"
          />
          <v-checkbox
            label="Heart Disease"
            value="heart disease"
            v-model="medicalConditions"
            density="compact"
          />
          <v-checkbox label="Eczema" value="eczema" v-model="medicalConditions" density="compact" />
          <v-checkbox label="Other" value="other" v-model="medicalConditions" density="compact" />
          <v-text-field
            v-if="medicalConditions.includes('other')"
            label="Please specify other medical conditions"
            v-model="otherMedicalCondition"
            variant="outlined"
          />
        </v-card>
      </template>

      <template v-slot:item.3>
        <v-card flat>
          <p class="text-center">Select any known food intolerances</p>
          <v-checkbox
            label="Lactose"
            value="lactose"
            v-model="foodIntolerances"
            density="compact"
          />
          <v-checkbox label="Gluten" value="gluten" v-model="foodIntolerances" density="compact" />
          <v-checkbox
            label="Fructose"
            value="fructose"
            v-model="foodIntolerances"
            density="compact"
          />
          <v-checkbox
            label="Histamine"
            value="histamine"
            v-model="foodIntolerances"
            density="compact"
          />
          <v-checkbox label="Other" value="other" v-model="foodIntolerances" density="compact" />
          <v-text-field
            v-if="foodIntolerances.includes('other')"
            label="Please specify other food intolerances"
            v-model="otherFoodIntolerance"
            variant="outlined"
          />
        </v-card>
      </template>
      <div
        class="stepper-actions"
        style="display: flex; justify-content: space-between; margin: 24px"
      >
        <v-btn @click="prevStep" :disabled="step === 1" color="secondary">Back</v-btn>
        <v-btn v-if="step < 3" color="primary" @click="nextStep">Next</v-btn>
        <v-btn v-else color="success" @click="complete">Complete</v-btn>
      </div>
    </v-stepper>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { VStepper, VCard, VCheckbox, VTextField, VBtn } from 'vuetify/components'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const userStore = useUserStore()
const step = ref(1)
const allergies = ref<string[]>([])
const medicalConditions = ref<string[]>([])
const foodIntolerances = ref<string[]>([])
const otherAllergy = ref('')
const otherMedicalCondition = ref('')
const otherFoodIntolerance = ref('')

function nextStep() {
  if (step.value < 3) step.value++
}
function prevStep() {
  if (step.value > 1) step.value--
}
async function complete() {
  const questionnaireResults = {
    username: userStore.user?.username,
    restriction: [
      { type: 'allergies', value: allergies.value },
      { type: 'medicalConditions', value: medicalConditions.value },
      { type: 'foodIntolerances', value: foodIntolerances.value },
    ],
  }
  try {
    await axios.post(
      'http://localhost:3000/api/questionnaire/save',
      questionnaireResults,
    )
    router.push('/')
  } catch (error) {
    console.error('Error saving questionnaire:', error)
  }
}
</script>

<style scoped>
.foodQuestionnaire {
  width: 700px;
  margin: 20px auto;
}
</style>
