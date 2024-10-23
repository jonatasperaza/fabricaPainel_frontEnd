<template>
  <v-app-bar v-if="!isMobile" class="py-4" flat flex>
    <v-container class="mx-auto d-flex align-center justify-center">
      <img alt="" class="pr-8 cursor-pointer" src="@/assets/logo.png" @click="$router.push('/')" />
      <v-btn v-for="link in layoutStore.navbarDashboard" :key="link.text" class="mr-2" :color="link.value.split('/')[2] === layoutStore.currentPage.split('/')[2]
          ? 'primary'
          : ''
        " rounded="xl" :to="link.value" variant="text">
        {{ link.text }}
      </v-btn>

      <v-spacer />
      <p class="px-2">
        {{ authStore.user.name.split(' ').length >= 4 ? ( authStore.user.name.split(' ')[0] + ' ' + authStore.user.name.split(' ')[1]) : authStore.user.name }}
      </p>
      <v-btn class="rounded-xl justify-center" color="red" icon @click="logout()">
        <v-icon size="small"> mdi-logout </v-icon>
      </v-btn>
    </v-container>
  </v-app-bar>
  <v-app-bar v-else flat>
    <v-container>
      <v-row align="center" justify-space-around>
        <v-col>
          <img alt="" src="@/assets/logo.png" />
        </v-col>
        <v-space />
        <v-col class="d-flex justify-end">
          <div>
            <v-menu activator="parent">
              <!-- @vue-ignore -->
              <template #activator="{ on }">
                <v-btn v-icon color="primary" rounded="xl" variant="flat" v-on="on">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="link in layoutStore.navbar" :key="link.text"
                  :color="link.value == layoutStore.currentPage ? 'primary' : ''" @click="router.push(link.value)">
                  <v-list-item-title>{{ link.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div>
            <v-btn class="d-flex ml-4" color="primary" rounded="xl" variant="flat" @click="logout">
              <p>{{ authStore.user.name }}</p>
              <v-icon color="red">mdi-logout</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
  <v-main>
    <v-container>
      <v-row>
        <v-col v-if="layoutStore.links.length > 1" cols="2">
          <v-sheet>
            <v-btn v-for="link in layoutStore.links" :key="link.text" :active="link.value === layoutStore.currentPage"
              block class="my-2 justify-center" :color="link.value === layoutStore.currentPage ? 'primary' : ''"
              rounded="xl" :to="link.value" variant="text">
              {{ link.text }}
            </v-btn>
            <v-divider v-if="layoutStore.actionLinks.length > 0" class="mt-3 mb-4" />
            <v-btn v-for="actionLink in layoutStore.actionLinks" :key="actionLink.text" block
              class="my-2 justify-center" color="primary" rounded="xl" :to="actionLink.value" variant="flat">
              {{ actionLink.text }}
            </v-btn>
          </v-sheet>
        </v-col>
        <v-col :cols="layoutStore.links.length > 1 ? 10 : 12">
          <v-sheet class="ml-auto mr-0" min-height="65vh" rounded="xl">
            <slot />
          </v-sheet>
        </v-col>
      </v-row>
      <footer class="pt-16 pb-2">
        <v-row>
          <v-col class="d-flex justify-start align-center" cols="10">
            <img class="h-8" src="@/assets/footer_logos.png" />
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-btn class="border border-primary" color="info" icon="mdi-help" rounded="xl" size="small" to="/"
              variant="tonal" />
          </v-col>
        </v-row>
      </footer>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { uselayout } from "@/stores/app";
import { useAuth } from "@/stores/auth";
import { useScreen } from "@/composables/composables";

const authStore = useAuth();
const { isMobile } = useScreen();

const router = useRouter();
const layoutStore = uselayout();
const logout = () => {
  router.push("/");
};

onMounted(() => {
  layoutStore.getSettings();
});
</script>
