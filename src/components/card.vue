<template>
    <div class="q-pa-md">
    <q-card class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
      <q-card-section>
        <div class="row justify-between">
            <div class="text-h6">{{ title }}</div>
            <div class="text-subtitle2">{{ $filters.fromNow(time) }}</div>
        </div>
      </q-card-section>

      <q-separator dark inset />

      <q-card-section>
        <div class="q-pa-md">
            {{body}}
        </div>
        <slot name="details"></slot>
      </q-card-section>
    </q-card>
</div>
</template>
<script setup>
defineProps({
    title:{
        required: true,
        type: String
    },
    time:{
        required: true,
        type: String
    },
    body:{
        required: true,
        type: String
    }
})
</script>