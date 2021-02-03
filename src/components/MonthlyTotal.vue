<template>
  <div class="monthly-total">
    <h2 class="monthly-total__title">月工数合計</h2>
    <ul class="monthly-mon-hour__sum-list">
      <li
        v-for="project in monthCostsSum"
        :key="project.code"
        class="monthly-mon-hour__sum-item"
        @click="showProjectDetail(project.code)"
      >
        {{ `${project.code}：${project.sum}（${project.name}）` }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, computed } from "vue";
import { key } from "../stores/Store";
import { Store } from "../types/index";

export default defineComponent({
  setup() {
    const store: Store | undefined = inject(key);
    const monthCostsSum = computed(() => {
      const existingProjects = store?.state.projects.filter(project =>
        store.state.dayCosts.some(dayCost =>
          dayCost.costs.some(cost => cost.code === project.code)
        )
      );
      return existingProjects?.map(project => {
        return {
          code: project.code,
          name: project.name,
          sum: store?.state.dayCosts.reduce((sum, dayCost) => {
            const add =
              dayCost.costs.find(cost => cost.code === project.code)?.hour || 0;
            return sum + add;
          }, 0)
        };
      });
    });

    const showProjectDetail = (projectCode: string) => {
      const projects = store?.state.dayCosts.map(dayCost => {
        const projectDayCost = dayCost.logs.find(log => log.inputProjectCode === projectCode);
        return {
          duration: projectDayCost?.duration,
          desc: projectDayCost?.inputDescription,
          date: dayCost.date
        }
      });
      const filteredProject = projects?.filter(project => !!project.duration);
      const filteredProjectDetail = filteredProject?.map(project => ({
        desc: project?.desc,
        cost: project?.duration,
        date: project?.date
      }));
      console.log('filteredProjectDetail', filteredProjectDetail);
    }

    return {
      monthCostsSum,
      showProjectDetail
    };
  }
});
</script>
