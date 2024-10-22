<script setup>
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/stores/auth'
  import auth from '@/services/auth'

  const router = useRouter()
  const authStore = useAuth()

  const login = () => {
    router.push('/auth/login')
  }

  const logout = () => {
    authStore.logout()
    router.push('/')
  }
  const screenWidth = ref(0);

onMounted(() => {
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth;
  });
  screenWidth.value = window.innerWidth;
});
</script>

<template>
  <div id="help">
    <v-container class="w-lg-75" :class="{ 'pt-0 pb-0' : screenWidth < 700}" fluid>
      <section class="py-16 my-16">
        <TitleH1
          content="O sistema de avaliação do Painel de Integração da SEPE foi desenvolvido para garantir a imparcialidade e a qualidade das análises dos trabalhos submetidos. Após o envio dos projetos, os orientadores e avaliadores são escolhidos aleatoriamente, assegurando uma avaliação justa e diversificada. Os alunos têm a liberdade de escolher entre uma ampla variedade de temas, o que permite que suas pesquisas reflitam áreas de interesse e relevância acadêmica.
          Ao término do período de avaliação, cada aluno poderá acessar a página de seu trabalho e emitir a nota final de todos os membros da equipe, garantindo transparência e reconhecimento do esforço coletivo. Esse processo visa promover o desenvolvimento acadêmico, a colaboração entre os alunos e a excelência na produção científica."
          text="Sistema de Avaliação"
        />
      </section>
    </v-container>
  </div>
</template>
