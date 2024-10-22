<script setup lang="ts">
import { useAuth } from "@/stores/auth";
import { useEdition } from "@/stores/edition";
import { useWork } from "@/stores/work";
import { useAssessmentStore } from "@/stores/assessment";
import { useStudentAssessment } from "@/stores/studentAssessment";
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { showMessage } from "@/utils/toastify";

const router = useRouter();
const work_id = (router.currentRoute.value.params as { id: string }).id;

const authStore = useAuth();
const editionStore = useEdition();
const workStore = useWork();
const assessmentStore = useAssessmentStore();
const { createAssessment, patchAssessment, fetchAssessments, state } =
  useStudentAssessment();

const grades = ref<number[]>([]);
const users = ref<string[]>([]);
const panel = ref(["team", "abstract"]);
const dialogReject = ref(false);
const feedbackRejec = ref("");
const dialogGrade = ref(false);
const newGrades = ref(false);
const assessment = ref([]);
const studentAssessments = ref<any[]>([]);
const workGrade = ref(0);

const messageStudent =
  authStore.user.user_type === "STUDENT"
    ? "Seu trabalho foi aprovado. Parabéns!"
    : "";

const verifyGrades = async () => {
  return state.assessments.filter((assess) => assess.work === work_id);
};

async function patchGradesStudents() {
  await workStore.getWork(work_id);
  const currentWork = workStore.currentWork;
  const teamMembersId = currentWork?.team?.team_members;

  for (let index = 0; index < teamMembersId.length; index++) {
    const newAssessment = {
      work: work_id,
      student: teamMembersId[index],
      grade: grades.value[index],
      date_time: new Date().toISOString(),
    };

    await patchAssessment(studentAssessments.value[index], newAssessment);
  }
  dialogGrade.value = !dialogGrade.value;
  newGrades.value = false;
  showMessage("Notas editadas com sucesso", "success", 3000, "top-right", "auto", true);
}

async function postGradesStudents() {
  await workStore.getWork(work_id);
  const currentWork = workStore.currentWork;
  const teamMembersId = currentWork?.team?.team_members;

  for (let index = 0; index < teamMembersId.length; index++) {
    const newAssessment = {
      work: work_id,
      student: teamMembersId[index],
      grade: grades.value[index],
      date_time: new Date().toISOString(),
    };

    const data = await createAssessment(newAssessment);
    studentAssessments.value.push(data);
  }
  dialogGrade.value = !dialogGrade.value;
  newGrades.value = !newGrades.value;
  showMessage("Notas registradas com sucesso", "success", 3000, "top-right", "auto", true);
}


async function getMembersTeam() {
  await workStore.getWork(work_id);
  const currentWork = workStore.currentWork;
  const teamMembersId = currentWork?.team?.team_members;
  for (const member of teamMembersId) {
    const user = await authStore.getUser(member);
    users.value.push(user.name);
  }
}

const generatePDF = async () => {
  const doc = new jsPDF();

  const columns = ["Aluno", "Nota"];
  const rows: (string | number)[][] = [];
  autoTable(doc, { head: [columns], body: rows, startY: 30 });

  doc.text("Relatório de Notas", 10, 10);
  doc.text(`Aluno: ${authStore.user?.name}`, 10, 20);

  for (const student of studentAssessments.value) {
    const currentStudent = await authStore.getUser(student.student);
    rows.push([currentStudent.name, student.grade]);
  }

  doc.save(`notas_${authStore.user?.name}.pdf`);
};
const work = ref({
  title: "",
  abstract: "",
});

const submitFeedback = async () => {
  try {
    await editionStore.submitFeedback(work_id, feedbackRejec.value);
    feedbackRejec.value = "";
    dialogReject.value = false;
  }
  catch (error) {
    console.log(error)
    showMessage(
      "Erro ao enviar feedback",
      "error",
      2000,
      "top-right",
      "auto",
      false
    );
  }
};

const validateWordNumber = (max: number, value: string) => {
  const wordCount = value.split(" ").length;
  return wordCount <= max;
};

const cancelWork = () => {
  work.value = {
    title: workStore.currentWork.title,
    abstract: workStore.currentWork.abstract,
  };
};

const editWork = async () => {
  try {
    await workStore.updateWork(work_id, work.value);
    await workStore.getWork(work_id);
    showMessage(
      "Trabalho editado com sucesso",
      "success",
      2000,
      "top-right",
      "auto",
      true
    );
  } catch (error) {
    showMessage(
      "Erro ao editar trabalho",
      "error",
      2000,
      "top-right",
      "auto",
      true
    );
  }
};

onMounted(async () => {
  await workStore.getWork(work_id);
  work.value = {
    title: workStore.currentWork.title,
    abstract: workStore.currentWork.abstract,
  };
  await editionStore.fetchCurrentEdition();
  assessment.value = await assessmentStore.getAssessmentsByWorkId(work_id);
});

// eslint-disable-next-line camelcase

const approveWork = async () => {
  await workStore.approveWork();
  await workStore.getWork(work_id);
  showMessage(
    "Trabalho aprovado com sucesso",
    "success",
    2000,
    "top-right",
    "auto",
    true
  );
};

onMounted(async () => {
  await fetchAssessments();
  studentAssessments.value = await verifyGrades();

  await workStore.getWork(work_id);
  await editionStore.fetchCurrentEdition();
  assessment.value = await assessmentStore.getAssessmentsByWorkId(work_id);
  await getMembersTeam();
  for (let i = 0; i < workStore.currentWork?.team?.team_members.length; i++) {
    grades.value.push(0);
  }
});
const screenWidth = ref(0);

onMounted(() => {
  window.addEventListener("resize", () => {
    screenWidth.value = window.innerWidth;
  });
  screenWidth.value = window.innerWidth;
});
</script>

<template>
  <LayoutSteps>
    <v-card class="border-md w-100 pa-8" rounded="xl" variant="outlined">
      <div class="mb-6">
        <InformativeAlert
          v-if="workStore.currentWork?.verification_token === null"
          color="success"
          :description="messageStudent"
          title="Trabalho Aprovado"
        />
      </div>
      <div class="mb-6">
        <InformativeAlert
          v-if="
            workStore.currentWork?.status === 3 &&
            authStore.isOpenForAprove &&
            authStore.user?.user_type === 'STUDENT'
          "
          color="warning"
          title="Este Trabalho não cumpriu os requisitos mínimos, verifique seu email"
        />
      </div>
      <div class="mb-6">
        <InformativeAlert
          v-if="
            workStore.currentWork?.status === 3 &&
            authStore.isOpenForAprove &&
            authStore.user?.user_type === 'TEACHER'
          "
          closable
          color="info"
          title="Enviado email para o aluno com as correções necessárias"
        />
      </div>
      <div class="mb-6">
        <InformativeAlert
          v-if="
            workStore.currentWork?.verification_token !== null &&
            !authStore.isOpenForAprove
          "
          color="error"
          title="Este Trabalho não foi Aprovado durante o período de Avaliação"
        />
      </div>
      <header>
        <v-row class="d-flex justify-space-between" no-gutters>
          <v-col cols="12" class="d-flex justify-space-between">
            <h1 class="pb-4">
              {{ workStore.currentWork?.title }}
            </h1>
            <v-dialog max-width="1000">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn variant="flat">
                  <v-icon
                    class="mr-2 cursor-pointer align-self-center"
                    size="30"
                    v-bind="activatorProps"
                    >mdi-pencil</v-icon
                  >
                </v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card title="Editar Trabalho">
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="12">
                        <v-text-field
                          v-model="work.title"
                          label="Título"
                          rounded="xl"
                          variant="outlined"
                          hide-details
                          :rules="[(v) => !!v || 'Campo obrigatório']"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-textarea
                          v-model="work.abstract"
                          auto-grow
                          counter
                          label="Resumo do Projeto"
                          rounded="xl"
                          rows="1"
                          variant="outlined"
                          hide-details
                          :rules="[
                            (v) => !!v || 'Campo obrigatório',
                            (v) =>
                              validateWordNumber(540, v) ||
                              'Máximo de 540 caracteres',
                          ]"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="red darken-1"
                      @click="
                        () => {
                          (isActive.value = false), cancelWork();
                        }
                      "
                      >Cancelar</v-btn
                    >
                    <v-btn
                      color="blue darken-1"
                      @click="
                        () => {
                          (isActive.value = false), editWork();
                        }
                      "
                      >Salvar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <v-col cols="12">
            <p>
              Áreas de Conhecimento:
              <v-chip
                v-for="(value, key) in workStore.currentWork?.field"
                :key="key"
                class="mr-2 my-2"
                color="blue"
                outlined
              >
                {{ value.name }}
              </v-chip>
            </p>
            <p>
              Tema Transversal:
              <v-chip class="mr-2 my-2" color="pink" outlined>
                {{ workStore.currentWork?.cross_cutting_theme.name }}
              </v-chip>
            </p>
          </v-col>
        </v-row>
      </header>
      <v-divider class="my-4" />
      <v-expansion-panels
        v-model="panel"
        class="rounded-0 overflow-hidden"
        multiple
        variant="accordion"
      >
        <v-expansion-panel value="team">
          <v-expansion-panel-title
            class="py-8 border-b-sm"
            collapse-icon="mdi-minus"
            expand-icon="mdi-plus"
          >
            Integrantes da Equipe:
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <ul class="font-weight-bold">
              <p v-for="(user, index) in users" :key="index">
                {{ user }}
              </p>
            </ul>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel value="abstract">
          <v-expansion-panel-title
            class="py-8 border-b-sm d-flex justify-space-between"
            collapse-icon="mdi-minus"
            expand-icon="mdi-plus"
          >
            Resumo do Projeto
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p>
              {{ workStore.currentWork?.abstract }}
            </p>
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel
          v-if="workStore.currentWork?.verification_token === null"
          value="evaluation"
        >
          <v-expansion-panel-title
            class="py-8 border-b-sm"
            collapse-icon="mdi-minus"
            expand-icon="mdi-plus"
          >
            Orientadores / Avaliadores
          </v-expansion-panel-title>
          <v-expansion-panel-text
            ><v-row>
              <v-col cols="6">
                <p>Orientador</p>
                <v-chip class="mr-2 my-4" color="primary" outlined>
                  {{ workStore.currentWork?.advisor.name }}
                </v-chip>
                <p>Co-Orientadores</p>
                <v-chip class="mr-2 my-4" color="primary" outlined>
                  {{ workStore.currentWork?.co_advisor?.name }}
                </v-chip>
              </v-col>
              <v-col cols="6">
                <p>Avaliadores</p>
                <v-chip
                  v-for="professor in workStore.currentWork?.evaluator"
                  :key="professor.id"
                  class="mr-2 my-4"
                  color="primary"
                  outlined
                >
                  {{ professor }}
                </v-chip>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-row
        v-if="
          authStore.isOpenForAprove &&
          workStore.currentWork?.verification_token !== null
        "
        class="mt-8 ga-2"
        justify="end"
        no-gutters
      >
        <v-col class="d-flex justify-end" cols="4">
          <v-btn
            v-if="authStore.user?.user_type != 'STUDENT'"
            block
            class="py-6 text-white"
            color="orange"
            rounded="xl"
            variant="flat"
            @click="dialogReject = true"
            >Precisa de mudanças</v-btn
          >

          <v-dialog v-model="dialogReject" max-width="500px">
            <v-card>
              <v-card-title class="headline">Feedback</v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="feedbackRejec"
                  label="Descreva o que precisa ser mudado"
                  rows="5"
                  variant="outlined"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" @click="dialogReject = false"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" @click="submitFeedback()"
                  >Enviar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="2">
          <v-btn
            v-if="authStore.user?.user_type != 'STUDENT' && authStore.user.id == workStore.currentWork?.advisor.id"
            block
            class="py-6"
            color="green"
            rounded="xl"
            variant="flat"
            @click="approveWork()"
            >Aprovar</v-btn
          >
          <v-btn
            v-else
            block
            class="py-6"
            color="green"
            rounded="xl"
            variant="flat"
            @click="generatePDF()"
            >Ver Nota</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="mt-8" justify="end" no-gutters>
        <v-col cols="12">
          <v-btn
            v-if="authStore.isOpenForEvaluation"
            block
            class="py-6"
            color="info"
            rounded="xl"
            variant="flat"
            @click="dialogGrade = !dialogGrade"
            >{{ studentAssessments.length ? "Editar nota" : "Dar nota" }}</v-btn
          >

          <v-dialog v-model="dialogGrade" max-width="600px">
            <v-card>
              <v-card-title class="headline font-weight-bold">
                <span
                  v-if="
                    authStore.user.id === workStore.currentWork?.advisor.id ||
                    authStore.user.id === workStore.currentWork?.co_advisor.id
                  "
                >
                  Notas dos Alunos
                </span>
                <span v-else> Nota Final </span>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col
                      v-if="
                        authStore.user.id ===
                          workStore.currentWork?.advisor.id ||
                        authStore.user.id ===
                          workStore.currentWork?.co_advisor.id
                      "
                      cols="12"
                    >
                      <v-row
                        v-for="(student, index) in users"
                        :key="index"
                        no-gutters
                      >
                        <v-col cols="8">
                          <p>{{ student }}</p>
                        </v-col>
                        <v-col cols="4">
                          <v-text-field
                            label="Nota"
                            max="10"
                            min="0"
                            type="number"
                            variant="outlined"
                            v-model="grades[index]"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col v-else cols="12">
                      <v-text-field
                        v-model="workGrade"
                        label="Nota do Trabalho"
                        max="10"
                        min="0"
                        type="number"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" @click="dialogGrade = false"
                  >Cancelar</v-btn
                >
                <!-- @vue-ignore -->
                <v-btn
                  color="blue darken-1"
                  @click="
                    studentAssessments.length
                      ? patchGradesStudents()
                      : postGradesStudents()
                  "
                  >Enviar</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
  </LayoutSteps>
</template>

<style>
li {
  list-style-type: none;
  margin-bottom: 8px;
}
</style>
