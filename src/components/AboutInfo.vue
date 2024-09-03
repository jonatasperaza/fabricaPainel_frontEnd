<script setup>
defineProps({
  title: String,
  description: String,
  opened: Boolean,
  link: URL
});
</script>
<template>
  <v-card class="w-100 " hover>
    <div class="w-100 d-flex justify-space-between align-center">
        <v-card-title>{{ title }}</v-card-title>
        <v-icon :icon="opened ? 'mdi-chevron-up' : 'mdi-chevron-down'" class="me-4"></v-icon>
    </div>
    <v-card-text v-show="opened">{{ description }}</v-card-text>
    <v-card-text v-show="opened">clique <a :href="link">aqui</a> para mais informações</v-card-text>
  </v-card>
</template>