<template>
  <v-app id="inspire">
    <v-app-bar v-if="!isMobile" class="py-4" flat>
      <v-container class="w-lg-75 d-flex align-center justify-center" fluid>
        <img
          alt=""
          class="pr-8 cursor-pointer"
          src="@/assets/logo.png"
          @click="$router.push('/')"
        />
        <v-btn
          v-for="link in layoutStore.navbar"
          :key="link.text"
          class="mr-1"
          :color="link.value == layoutStore.currentPage ? 'primary' : ''"
          rounded="xl"
          :text="link.text"
          :to="link.value"
          variant="text"
        />

        <v-spacer />
        <v-btn
          v-if="!authStore.isLogged"
          class="d-flex"
          color="primary"
          rounded="xl"
          variant="flat"
          @click="login"
        >
          <p>ENTRAR NO SISTEMA</p>
        </v-btn>

        <div v-else class="d-flex ga-2">
          <v-btn
            v-if="authStore.user.user_type == 'STUDENT'"
            color="primary"
            rounded="xl"
            to="/auth/my-group"
            variant="text"
          >
            <p>Meu Grupo</p>
          </v-btn>

          <v-btn
            color="red"
            rounded="xl"
            variant="outlined"
            to="/panel"
            @click="logout"
          >
            <p class="d-inline-block text-truncate" style="max-width: 300px">
              {{ authStore.user.name }}
            </p>
            <v-icon color="red">mdi-logout</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>
    <v-app-bar class="py-4" v-else flat>
      <v-container class="d-flex align-center justify-center">
        <v-row align="center">
          <v-col v-if="screenWidth > 520">
            <img v-if="screenWidth >= 520" alt="Fabrica Painel" src="@/assets/logo.png" @click="$router.push('/')"
              class="cursor-pointer" />
            <img v-else alt="Fabrica Painel" src="@/assets/logo_mini.png" @click="$router.push('/')"
              class="cursor-pointer" />
          </v-col>
          <v-col class="d-flex ml-5 justify-end" :class="{'ml-0 pl-0': screenWidth < 580}" style=" width: 35%">
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

                  <v-list-item v-if="authStore.user.user_type == 'STUDENT'" @click="router.push('/auth/my-group')">
                    <v-list-item-title>Meu Grupo</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div>
              <v-btn v-if="!authStore.isLogged" class="d-flex ml-4" color="primary" rounded="xl" variant="flat"
                @click="login">
                <p>ENTRAR</p>
                <v-icon>mdi-login</v-icon>
              </v-btn>

              <v-btn v-else class="d-flex ml-4"  color="primary" rounded="xl" variant="flat" @click="logout">
                <p class="d-inline-block text-truncate mr-2" style="max-width: 310px" v-if="screenWidth > 360">
                  {{ authStore.user.name.split(' ').length >= 4 ? ( authStore.user.name.split(' ')[0] + ' ' + authStore.user.name.split(' ')[1]) : authStore.user.name }}
                </p>
                <v-icon color="red">mdi-logout</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main :class="{ 'mt-6': screenWidth < 615}">
      <slot />
    </v-main>
    <FooterComp />
  </v-app>
</template>

<script setup>
import { uselayout } from "@/stores/app";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { showMessage } from "@/utils/toastify";
import { useScreen } from "@/composables/composables";

const { isMobile } = useScreen();
const router = useRouter();
const layoutStore = uselayout();
const authStore = useAuth();

const login = () => {
  router.push("/auth/login");
};

const logout = () => {
  authStore.logout();
  showMessage(
    "Deslogado com sucesso",
    "success",
    1500,
    "top-right",
    "auto",
    false
  );
  router.push("/");
};

const screenWidth = ref(0);

onMounted(() => {
  layoutStore.getSettings();
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth;
  });
  screenWidth.value = window.innerWidth;
});
</script>
