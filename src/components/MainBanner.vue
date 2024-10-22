<script lang="ts" setup>
const props = defineProps<{
  content?: string;
  text?: string;
  btnvisible: boolean;
  class?: string;
  subtext?: string;
}>();

const defaultContent =
  "Este site foi criado para facilitar a submissão de trabalhos acadêmicos que integram ensino, pesquisa e extensão, promovendo a troca de conhecimentos entre estudantes, professores e a comunidade. Aqui, você poderá enviar seus projetos, colaborar com outras áreas e contribuir para o desenvolvimento científico e social. Participe e faça parte dessa iniciativa que valoriza o conhecimento e a inovação no nosso campus!";
const defaultText = "Painel de Integração - ";
const defaultSubtext = "Campus Araquari";
const defaultClass = "pt-16 border-0";

const content = props.content || defaultContent;
const text = props.text || defaultText;
const btnvisible = props.btnvisible;
const classDivider = props.class || defaultClass;
const subtext = props.subtext || defaultSubtext;

const screenWidth = ref(window.innerWidth);

onMounted(() => {
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth;
  });
});
</script>
<template>
  <v-container class="w-lg-75" fluid>
    <v-divider :class="classDivider" />
    <section class="mt-2 d-flex justify-center align-center"
      style="min-height: 400px">
      <div>
        <TitleH1 :content="content" :text="text" :subtext="subtext" />
        <BtnPrimary class="mt-8" :disabled="!btnvisible ? 'Está sessão não está mais disponivel' : 'open'"
          text="Acessar edição Atual" to="/panel" />
      </div>
    </section>
  </v-container>
</template>
