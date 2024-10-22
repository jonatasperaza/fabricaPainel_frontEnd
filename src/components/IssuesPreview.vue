<template>
  <section class="py-16 my-16 bg-grey-darken-4" :class="{ 'pt-0 pb-0' : screenWidth < 700}">
    <div class="py-16">
      <v-container class="w-lg-75" fluid>
        <TitleH1 text="Edições anteriores" />
      </v-container>

      <v-slide-group v-model="model" center-active class="py-8" show-arrows>
        <v-slide-group-item v-for="edition in state.editions" :key="edition.id" v-slot="{ isSelected, toggle, selectedClass }">
          <v-card
            class="mx-3 border-md"
            :class="['ma-4', selectedClass, { 'border-primary border-opacity-100': isSelected }, { 'border-white': !isSelected }]"
            height="300"
            rounded="xl"
            variant="outlined"
            width="320"
            @click="toggle"
          >
            <v-icon
              v-if="isSelected"
              class="top-0 right-0 position-absolute pa-8"
              color="primary"
              icon="mdi-close"
              size="16"
            />
            <div class="h-100 d-flex flex-column justify-space-between pa-6">
              <p v-if="edition.is_open" class="text-info">Aberta</p>
              <p v-else class="text-red">Finalizada</p>

              <h2 class="text-primary font-weight-bold text-h5" :class="[{ 'text-red': isSelected }]">
                Edição {{ edition.year }}
              </h2>

              <p class="text-grey">
                O tema desta Edição é "{{ edition.theme }}".
                A data inicial de submissões é {{ date.format(state.currentEdition?.initial_submission_date, "keyboardDate") }} e a
                data final é {{ date.format(edition.final_submission_date, "keyboardDate") }}.
              </p>
              <p v-if="!isSelected" class="mr-2 font-weight-medium">
                Clique para ver mais
              </p>
              <p v-else class="mr-2 font-weight-medium">
                Mais informações a baixo
              </p>
            </div>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>

      <v-expand-transition>
        <v-sheet v-if="model != null" class="bg-grey-darken-4">
          <v-container class="w-lg-75 pb-0" fluid>
            <p class="text-blue pb-2">
              {{ state.editions[model].theme }}
            </p>
            <TitleH1 color="text-primary" :text="state.editions[model]?.edition_name" />
            <v-row>
              <v-col cols="12" md="6">
                <img alt="Banner da Edição" class="w-75 rounded-xl" src="../assets/painel.png">
              </v-col>
              <v-col class="text-grey text-start" cols="12" md="6">
                <p class="pb-4 text-h6 ">
                  Carga Horária: <span class="text-white font-weight-bold"> {{ state.editions[model]?.workload }} horas</span>
                </p>
                <p>
                  Data de Submissão:
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.initial_submission_date, "keyboardDate") }}
                  </span>
                  até
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.final_submission_date, "keyboardDate") }}
                  </span>
                </p>
                <p class="py-2">
                  Data de Submissão:
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.initial_advisor_date, "keyboardDate") }}
                  </span>
                  até
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.final_advisor_date, "keyboardDate") }}
                  </span>
                </p>
                <p>
                  Data de Submissão:
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.initial_evaluators_date, "keyboardDate") }}
                  </span>
                  até
                  <span class="text-white font-weight-bold">
                    {{ date.format(state.editions[model]?.final_evaluators_date, "keyboardDate") }}
                  </span>
                </p>
              </v-col>
              <v-col class="pt-8">
                <v-btn
                append-icon="mdi-arrow-right-thick"
                block
                class=""
                color="primary"
                text
                @click="state.editions[model]?.is_open ? router.push('/panel') : router.push(`/dashboard/editions/view/${state.editions[model]?.id}`)"
              >
                <div v-if="state.editions[model]?.is_open">
                  Inscrever-se
                </div>
                <div v-else>
                  Ir para página da Edição
                </div>
              </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-expand-transition>

    </div>
  </section>
</template>

<script setup>
  import { useDate } from 'vuetify'
  import { useEdition } from '@/stores/edition'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const date = useDate()
  const model = ref(null)

  const { fetchCurrentEdition, fetchEditions, state } = useEdition()
  const screenWidth = ref(0);

  onMounted(() => {
    fetchEditions()
    fetchCurrentEdition()
    window.addEventListener("resize", () => {
      screenWidth.value = window.innerWidth;
    });
    screenWidth.value = window.innerWidth;
  })
</script>
