<template>
  <v-dialog v-model="internalVisible" max-width="400">
    <v-card>
      <v-card-title class="text-h6">
        Confirm Deletion
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this {{ foodName }} from your food log?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="close">Cancel</v-btn>
        <v-btn color="red" variant="text" @click="confirm">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/components'

const props = defineProps<{
  foodName: string,
  visible: boolean
}>()
const emit = defineEmits(['update:visible', 'confirm'])

const internalVisible = computed({
  get: () => props.visible,
  set: (v: boolean) => emit('update:visible', v)
})

function close() {
  emit('update:visible', false)
}
function confirm() {
  emit('confirm')
  emit('update:visible', false)
}
</script>