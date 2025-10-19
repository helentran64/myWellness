<template>
  <div class="d-flex align-center mx-auto mt-8" style="width: 90%">
    <!-- Add Food Button -->
    <v-btn icon="mdi-plus" color="green" @click="$router.push('/add-food')"></v-btn>

    <!-- Date Navigation -->
    <div class="d-flex align-center" style="gap: 10px">
      <!-- Previous Day -->
      <v-btn icon="mdi-chevron-left" variant="tonal" color="grey" @click="prevDate"></v-btn>

      <!-- Date Display + Calendar -->
      <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y>
        <template #activator="{ props }">
          <v-btn variant="outlined" color="primary" v-bind="props">
            <v-icon left>mdi-calendar</v-icon>
            {{ formattedDate }}
          </v-btn>
        </template>
        <v-date-picker
          v-model="selectedDate"
          :max="today"
          @update:model-value="menu = false"
        ></v-date-picker>
      </v-menu>

      <!-- Next Day -->
      <v-btn icon="mdi-chevron-right" variant="tonal" color="grey" @click="nextDate"></v-btn>
    </div>

    <!-- Download food log button -->
    <div style="flex: 1"></div>
    <v-btn color="primary" @click="downloadExcel"> Download Excel </v-btn>
  </div>

  <!-- Table -->
  <div style="width: 90%" class="mx-auto my-10">
    <v-data-table-virtual
      :headers="headers"
      :items="filteredLogs"
      item-value="id"
      class="elevation-2"
      density="comfortable"
    >
      <template v-slot:[`item.food`]="{ item }">
        <div class="font-medium text-gray-900">{{ item.food.name }}</div>
        <!-- <div class="text-gray-500 text-sm">{{ item.mealType }}</div> -->
      </template>

      <!-- Action Column -->
      <template v-slot:[`item.action`]="{ item }">
        <v-btn icon="mdi-delete" color="red" variant="text" @click="deleteLog(item)"></v-btn>
      </template>

      <!-- Nutrient Columns -->
      <template v-slot:[`item.calories`]="{ item }">{{ item.food.calories.toFixed(1) }}</template>
      <template v-slot:[`item.protein`]="{ item }">{{ item.food.protein.toFixed(2) }}</template>
      <template v-slot:[`item.carbs`]="{ item }">{{ item.food.carbs.toFixed(2) }}</template>
      <template v-slot:[`item.fat`]="{ item }">{{ item.food.fat.toFixed(2) }}</template>
      <template v-slot:[`item.sodium`]="{ item }">{{ item.food.sodium }}</template>
      <template v-slot:[`item.sugar`]="{ item }">{{ item.food.sugar.toFixed(1) }}</template>
      <template v-slot:[`item.servingWeight`]="{ item }">{{ item.food.servingWeight }}</template>
      <template v-slot:[`item.servingUnit`]="{ item }">{{ item.food.servingUnit }}</template>
      <template v-slot:[`item.servingQuant`]="{ item }">{{ item.food.servingQuant }}</template>
      <template v-slot:[`item.mealType`]="{ item }">{{ item.mealType }}</template>
    </v-data-table-virtual>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { VDataTableVirtual, VBtn, VMenu, VDatePicker, VIcon } from 'vuetify/components'
import { useUserStore } from '@/stores/userStore'

// ---------------------
// Stores & Refs
// ---------------------
const userStore = useUserStore()

// define types for food logs so TypeScript knows the shape of each entry
type Food = {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  sodium: number | string
  sugar: number
  servingWeight: number | string
  servingUnit: string
  servingQuant: number | string
}

type FoodLog = {
  date: string
  username?: string
  mealType: string
  food: Food
}

type FoodLogItem = FoodLog & { id: number }

// typed ref for food logs
const foodLogs = ref<FoodLog[]>([])
const selectedDate = ref(new Date()) // currently selected date
const menu = ref(false) // date picker menu open/close
const today = new Date().toISOString().split('T')[0] // max selectable date

// ---------------------
// Table headers
// ---------------------
type HeaderAlign = 'start' | 'end' | 'center'
const headers: { title: string; key: string; align?: HeaderAlign }[] = [
  { title: 'Meal Type', key: 'mealType', align: 'center' },
  { title: 'Food', key: 'food', align: 'start' },
  { title: 'Calories', key: 'calories', align: 'center' },
  { title: 'Protein (g)', key: 'protein', align: 'center' },
  { title: 'Carbs (g)', key: 'carbs', align: 'center' },
  { title: 'Fat (g)', key: 'fat', align: 'center' },
  { title: 'Sodium', key: 'sodium', align: 'center' },
  { title: 'Sugar', key: 'sugar', align: 'center' },
  { title: 'Serving Weight (g)', key: 'servingWeight', align: 'center' },
  { title: 'Serving Unit', key: 'servingUnit', align: 'center' },
  { title: 'Serving Quantity', key: 'servingQuant', align: 'center' },
  { title: 'Action', key: 'action', align: 'center' },
]

// ---------------------
// Fetch food logs
// ---------------------
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/foodlog/get/${userStore.user?.username}`)
    foodLogs.value = res.data
  } catch (err) {
    console.error('Error fetching food logs:', err)
  }
})

// ---------------------
// Date navigation
// ---------------------
function prevDate() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)
  selectedDate.value = d
}

function nextDate() {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)
  selectedDate.value = d
}

// nicely formatted display
const formattedDate = computed(() =>
  selectedDate.value.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

// ---------------------
// Filter logs for selected date
// ---------------------
const filteredLogs = computed(() => {
  const target = selectedDate.value.toISOString().split('T')[0]
  return foodLogs.value.filter((log) => log.date === target).map((log, i) => ({ ...log, id: i }))
})

// ---------------------
// Delete log
// ---------------------
async function deleteLog(item: FoodLogItem) {
  try {
    const username = encodeURIComponent(item.username ?? '')
    const mealType = encodeURIComponent(item.mealType)
    const foodName = encodeURIComponent(item.food.name)
    await axios.delete(
      `http://localhost:3000/api/foodlog/delete/${username}/${item.date}/${mealType}/${foodName}`,
    )
    foodLogs.value = foodLogs.value.filter(
      (f) => f.food.name !== item.food.name || f.date !== item.date,
    )
  } catch (err) {
    console.error('Error deleting food log:', err)
  }
}

// ---------------------
// Download Excel File
// ---------------------
function downloadExcel() {
  const username = userStore.user?.username
  if (!username) {
    alert('No username found. Please log in.')
    return
  }
  window.open(
    `http://localhost:3000/api/foodlog/download?username=${encodeURIComponent(username)}`,
    '_blank',
  )
}
</script>

<style scoped>
.v-data-table-virtual {
  border-radius: 12px;
}
</style>
