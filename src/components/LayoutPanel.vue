<script lang="ts" setup>
import { useRouter } from "vue-router";
import { uselayout } from "@/stores/app";
import { useAuth } from "@/stores/auth";
import { showMessage } from "@/utils/toastify";
import { useScreen } from "@/composables/composables";

const { isMobile } = useScreen();
const router = useRouter();
const layoutStore = uselayout();
const authStore = useAuth();

const logout = () => {
  showMessage("Deslogado com sucesso", "success", 1500, "top-right", "auto", false);
  authStore.logout();
  router.push("/");
};

const login = () => {
  router.push("/auth/login");
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
<template>
  <div class="min-h-screen">
    <v-app-bar v-if="!isMobile" class="py-4" flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <img alt="" class="pr-8 cursor-pointer" src="@/assets/logo.png" @click="$router.push('/')" />
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
        <v-btn v-if="!authStore.isLogged" color="primary" rounded="xl" variant="flat" @click="login">
          <p>Entrar</p>
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <div v-else class="d-flex ga-2">
          <v-btn v-if="authStore.user.user_type == 'STUDENT'" color="primary" rounded="xl" to="/auth/my-group"
            variant="text">
            <p>Meu Grupo</p>
          </v-btn>

          <v-btn color="red" rounded="xl" variant="outlined" to="/panel" @click="logout">
            <p class="d-inline-block text-truncate" style="max-width: 300px">
              {{ authStore.user.name }}
            </p>
            <v-icon color="red">mdi-logout</v-icon>
            <v-tooltip activator="parent" location="bottom">Sair</v-tooltip>
          </v-btn>

        </div>
      </v-container>
    </v-app-bar>
    <v-app-bar v-else flat>
      <v-container>
        <v-row align="center" class="pa-6 mt-4" justify-space-around>
          <v-col v-if="screenWidth > 580">
            <img v-if="screenWidth >= 580" alt="Fabrica Painel" src="@/assets/logo.png" @click="$router.push('/')"
              class="cursor-pointer" />
            <img v-else alt="Fabrica Painel" src="@/assets/logo_mini.png" @click="$router.push('/')"
              class="cursor-pointer" />
          </v-col>
          <v-col class="d-flex justify-end ml-5" :class="{'justify-items-start': screenWidth > 580}" style=" width: 35%">
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
                <p class="d-inline-block text-truncate mr-2" style="max-width: 310px" v-if="screenWidth > 380">
                  {{ authStore.user.name }}
                </p>
                <v-icon color="red">mdi-logout</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <v-main :class="{'pt-4' : screenWidth < 580}">
      <slot />
    </v-main>
    <footer class="pt-16 pb-2 px-6">
      <v-container>
        <v-row>
          <v-col class="d-flex justify-start align-center" cols="6" md="10">
            <a href="https://fabricadesoftware.ifc.edu.br/">
              <img class="h-8" src="@/assets/footer_logos.png" />
            </a>
          </v-col>
          <v-col class="d-flex justify-end align-center" cols="6" md="2">
            <v-btn class="border border-primary" color="info" icon="mdi-help" rounded="xl" size="small" to="/"
              variant="tonal" />
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </div>
</template>
