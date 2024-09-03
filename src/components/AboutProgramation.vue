<script setup lang="ts">
import { ref } from "vue";
const modalities = ref<{ value: string }[]>([
  {
    value: "Agronomia",
    icon: 'mdi-nature'
  },
  {
    value: "Educação",
    icon: 'mdi-book'
  },
  {
    value: "Informática",
    icon: 'mdi-keyboard'
  },
  {
    value: "Medicina Veterinária",
    icon: 'mdi-dog'
  },
  {
    value: "multidisciplinar",
    icon: 'mdi-shape-plus'
  },
  {
    value: "outros",
    icon: 'mdi-reply'
  },
]);
</script>
<template>
  <div class="d-flex flex-column ga-3">
    <VCardTitle>Apresentação</VCardTitle>
    <VCardText
      >A Semana de Ensino, Pesquisa e Extensão tem como objetivo a construção de
      conhecimentos pautados na tríada enfatizada em seu próprio nome, assim
      como a divulgação de trabalhos desenvolvidos em nível regional e nacional,
      também relacionados ao ensino, à pesquisa e à extensão, promovendo a
      integração entre estudantes, professores, pesquisadores e sociedade,
      através de um espaço para apresentação e discussão de trabalhos realizados
      em nível médio, superior e pós-graduação, promovendo conhecimento e
      inovação em diferentes áreas.</VCardText
    >

    <VCardText
      >seminários, realização de mesas redondas e minicursos fazem parte das
      atividades deste evento, contando com a participação de convidados
      nacionais e internacionais.</VCardText
    >

    <VCardText>
      o evento são realizadas as Semanas Acadêmicas de Medicina Veterinária,
      Informática e Licenciaturas, além do Painel de Integração de
      Conhecimentos, com atividades diferenciadas e abertas aos participantes
      inscritos, sendo que se trata de um evento gratuito.</VCardText
    >
    <VCardTitle>Áreas temáticas</VCardTitle>
    <VCarousel height="400" hide-delimiters>
      <VCarouselItem v-for="(modality, index) in modalities" :key="index">
        <div class="d-flex fill-height justify-center align-center">
          <VCard class="bg-transparent border-primary border-opacity-10 pa-3 " width="600" height="300" rounded="xl" variant="outlined">
            <div class="d-flex align-center">
              <VIcon :icon="modality.icon"></VIcon>
              <VCardTitle>{{ modality.value }}</VCardTitle>
            </div>
            <p class="text-grey-lighten-1 text-justify text-subtitle-1">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio
              aliquam amet dicta officiis commodi magni dolor officia voluptas
              laudantium numquam consequuntur, debitis necessitatibus
              voluptatibus natus iure molestiae hic cupiditate ea.
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Optio
              aliquam amet dicta officiis commodi magni dolor officia voluptas
              laudantium numquam consequuntur, debitis necessitatibus
              voluptatibus natus iure molestiae hic cupiditate ea.
            </p>
          </VCard>
        </div>
      </VCarouselItem>
    </VCarousel>
  </div>
</template>


