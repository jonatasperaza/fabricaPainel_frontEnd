<template>
  <LayoutDefault>
    <VContainer>
      <VRow>
        <VCol>
          <div class="d-flex pa-5 w-100 ga-4">
            <AboutIntrodution />
          </div>
          <VCard class="bg-grey-darken-4 text-white rounded-xl d-flex pa-5">
            <AboutProgramation />
          </VCard>
          <div class="pa-5">
            <h2>Está com duvidas? confira algumas informações abaixo:</h2>
            <div class="d-flex flex-column ga-5 pa-3">
              <AboutInfo
                v-for="(info, index) in informations"
                :key="index"
                :title="info.title"
                :description="info.description"
                :opened="info.toggle"
                :link="info.link"
                @click="showdescription(index)"
              />
            </div>
          </div>
        </VCol>
      </VRow>
    </VContainer>
  </LayoutDefault>
</template>

<script lang="ts" setup>
const informations = ref([
  {
    title: "Como se increver para sepe?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti non rerum mollitia, libero ipsa aliquid maxime unde magnam eligendi laborum vel facilis incidunt accusamus hic soluta dolor ea voluptas provident.",
    toggle: false,
    link: "https://google.com"
  },
  {
    title: "Quais são as modalidades?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti non rerum mollitia, libero ipsa aliquid maxime unde magnam eligendi laborum vel facilis incidunt accusamus hic soluta dolor ea voluptas provident.",
    toggle: false,
    link: "https://google.com"
  },
  {
    title: "Como deve ser o modelo de resumo do trabalho?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti non rerum mollitia, libero ipsa aliquid maxime unde magnam eligendi laborum vel facilis incidunt accusamus hic soluta dolor ea voluptas provident.",
    toggle: false,
    link: "https://google.com"
  },
  {
    title: "O que é painel de integração?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti non rerum mollitia, libero ipsa aliquid maxime unde magnam eligendi laborum vel facilis incidunt accusamus hic soluta dolor ea voluptas provident.",
    toggle: false,
    link: "https://google.com"
  },
  {
    title: "Quanto tempo deve durar uma apresentação?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti non rerum mollitia, libero ipsa aliquid maxime unde magnam eligendi laborum vel facilis incidunt accusamus hic soluta dolor ea voluptas provident.",
    toggle: false,
    link: "https://google.com"
  },
]);

function showdescription(i){
  informations.value[i].toggle = !informations.value[i].toggle
}
</script>
