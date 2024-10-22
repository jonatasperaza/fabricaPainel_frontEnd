<template>
  <main class="w-100 h-100 d-flex justify-center align-center relative pt-16">
    <v-container :class="[props.size, {'w-75': screenWidth > 500}]">
      <div class="position-absolute top-0 left-0 pa-8">
        <BackButton />
      </div>
      <v-row>
        <v-col>
          <h1 class="pb-5">{{ title }}</h1>
        </v-col>
      </v-row>
      <slot />
    </v-container>
  </main>
</template>

<script setup>
  const props = defineProps({
    size: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  })
</script>
