<template>
  <div>
    <div class="d-flex justify-center mx-auto my-6" style="width: 60%">
      <v-select
        v-model="mealType"
        :items="mealOptions"
        label="Select Meal Type"
        variant="outlined"
        density="compact"
        style="width: 300px; margin-bottom: 20px"
      />
      <v-text-field
        v-model="searchQuery"
        label="Search for food"
        variant="outlined"
        density="compact"
        style="width: 400px; margin-bottom: 20px"
      />
      <v-btn icon="mdi-magnify" variant="text" @click="handleSearch"></v-btn>
    </div>
    <div v-if="unknownFood" style="color: red; margin-top: 20px">
      Please enter a valid food name and select a meal type.
    </div>
    <div
      class="d-flex flex-row justify-center align-start flex-wrap"
      style="gap: 20px; width: 90%; margin: auto"
    >
      <v-data-table-virtual
        v-if="foodList.length > 0"
        :headers="displayFoodHeaders"
        :items="foodList"
        item-value="tag_id"
        style="width: 55%; min-width: 400px"
        class="flex-grow-1"
      >
        <template #item.food="{ item }">
          <span>{{ item.name }}</span>
        </template>
        <template #item.select="{ item }">
          <v-checkbox
            v-model="item.checked"
            color="primary"
            hide-details
            @update:model-value="() => toggleDetails(item)"
          />
        </template>
      </v-data-table-virtual>
      <div style="width: 40%; min-width: 350px" class="flex-grow-1">
        <v-row>
          <v-col v-for="item in foodList.filter((f) => f.checked)" :key="item.tag_id" cols="12">
            <v-card elevation="2">
              <v-card-title class="text-h6 font-semibold">
                {{ item.name }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-skeleton-loader v-if="item.loading" type="paragraph" class="my-2" />
                <div v-else>
                  <v-row dense>
                    <v-col cols="6" class="text-sm">
                      <strong>Calories:</strong> {{ item.calories }}
                    </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Protein:</strong> {{ item.protein }} g
                    </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Carbs:</strong> {{ item.carbs }} g
                    </v-col>
                    <v-col cols="6" class="text-sm"> <strong>Fat:</strong> {{ item.fat }} g </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Sodium:</strong> {{ item.sodium }} mg
                    </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Sugar:</strong> {{ item.sugar }} g
                    </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Serving Weight:</strong> {{ item.servingWeight }} g
                    </v-col>
                    <v-col cols="6" class="text-sm">
                      <strong>Serving Unit:</strong> {{ item.servingUnit }}
                    </v-col>
                    <!-- Quantity -->
                    <v-col cols="6" class="text-sm d-flex align-center">
                      <strong class="mr-2">Quantity:</strong>
                      <v-text-field
                        v-model.number="item.quantity"
                        type="number"
                        min="1"
                        variant="outlined"
                        density="compact"
                        hide-details
                        style="max-width: 80px"
                        @update:model-value="() => updateNutrition(item)"
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-btn
            v-if="foodList.filter((f) => f.checked).length"
            color="green"
            class="ml-2"
            @click="addToFoodLog"
            >Add to log</v-btn
          >
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { searchFood, getFoodDetails } from '@/api/foodApi'
import {
  VSelect,
  VTextField,
  VBtn,
  VDataTableVirtual,
  VCheckbox,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VDivider,
  VCardText,
  VSkeletonLoader,
} from 'vuetify/components'
import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

type FoodItem = {
  name: string
  tag_id: string
  checked?: boolean
  loading?: boolean
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  sodium?: number
  sugar?: number
  servingWeight?: number
  servingUnit?: string
  servingQuant?: number
  notes?: string
  quantity?: number
  _baseNutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sodium: number
    sugar: number
    servingWeight: number
  }
}

const mealType = ref('')
const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
const searchQuery = ref('')
const unknownFood = ref(false)
const foodList = ref<FoodItem[]>([])

const displayFoodHeaders = [
  { title: 'Food', align: 'start', key: 'food' },
  { title: 'Select One', align: 'center', key: 'select' },
] as const

// Fetch food details when checkbox toggled
async function toggleDetails(item: FoodItem) {
  if (item.checked) {
    try {
      item.loading = true
      const res = await getFoodDetails(item.name)

      // store the base values for recalculation
      item._baseNutrition = {
        calories: res.calories,
        protein: res.protein,
        carbs: res.carbs,
        fat: res.fat,
        sodium: res.sodium,
        sugar: res.sugar,
        servingWeight: res.servingWeight,
      }

      Object.assign(item, {
        calories: res.calories,
        protein: res.protein,
        carbs: res.carbs,
        fat: res.fat,
        sodium: res.sodium,
        sugar: res.sugar,
        servingWeight: res.servingWeight,
        servingUnit: res.servingUnit,
        quantity: 1,
      })
    } catch (err) {
      console.error(`Failed to fetch details for ${item.name}:`, err)
    } finally {
      item.loading = false
    }
  } else {
    // Unchecked → clear details
    delete item.calories
    delete item.protein
    delete item.carbs
    delete item.fat
    delete item.sodium
    delete item.sugar
    delete item.servingWeight
    delete item.servingUnit
    delete item.loading
    delete item.quantity
  }
}

// Recalculate nutrition when quantity changes
function updateNutrition(item: FoodItem) {
  if (!item._baseNutrition || !item.quantity) return

  const q = item.quantity
  item.calories = item._baseNutrition.calories * q
  item.protein = item._baseNutrition.protein * q
  item.carbs = item._baseNutrition.carbs * q
  item.fat = item._baseNutrition.fat * q
  item.sodium = item._baseNutrition.sodium * q
  item.sugar = item._baseNutrition.sugar * q
  item.servingWeight = item._baseNutrition.servingWeight * q
}

// Handle search for foods
async function handleSearch() {
  if (searchQuery.value.trim() !== '' && mealType.value !== '') {
    try {
      const results = await searchFood(searchQuery.value)
      if (results && results.length > 0) {
        foodList.value = results.map((r: any) => ({
          ...r,
          checked: false,
          loading: false,
          quantity: 1,
        }))
        unknownFood.value = false
      } else {
        unknownFood.value = true
      }
    } catch (err) {
      console.error('Error searching for food:', err)
      unknownFood.value = true
    }
  } else {
    unknownFood.value = true
  }
}

// Add selected foods to food log
async function addToFoodLog() {
  const selectedFoods = foodList.value.filter((f) => f.checked)
  if (selectedFoods.length === 0) return

  const userStore = useUserStore()

  try {
    for (const food of selectedFoods) {
      const payload = {
        username: userStore.user?.username,
        mealType: mealType.value,
        food: JSON.stringify({
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          sodium: food.sodium,
          sugar: food.sugar,
          servingWeight: food.servingWeight,
          servingUnit: food.servingUnit,
          servingQuant: food.quantity,
        }),
      }

      await axios.post('http://localhost:3000/api/foodlog/add', payload)
    }

    // Clear selections and go back
    foodList.value = []
    searchQuery.value = ''
    mealType.value = ''
    unknownFood.value = false
    router.push('/food-log')
  } catch (err) {
    console.error('Error preparing payload:', err)
    alert('Failed to add foods to log. Please try again.')
  }
}
</script>

<style scoped>
.text-sm {
  font-size: 0.9rem;
}
</style>
