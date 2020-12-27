<template>
  <div class="monthly-total">
    <h2 class="monthly-total__title">月工数合計</h2>
    <ul class="monthly-mon-hour__sum-list">
      <li
        v-for="project in monthCostsSum"
        :key="project.code"
        class="monthly-mon-hour__sum-item"
      >
        {{ `${project.code}：${project.sum}（${project.name}）` }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, inject, computed } from "vue";
import { key } from "../stores/Store";

export default defineComponent({
  setup() {
    const store = inject(key);
    const monthCostsSum = computed(() => {
      const existingProjects = store.state.projects.filter(project =>
        store.state.dayCosts.some(dayCost =>
          dayCost.costs.some(cost => cost.code === project.code)
        )
      );
      return existingProjects.map(project => {
        return {
          code: project.code,
          name: project.name,
          sum: store.state.dayCosts.reduce((sum, dayCost) => {
            const add =
              dayCost.costs.find(cost => cost.code === project.code)?.hour || 0;
            return sum + add;
          }, 0)
        };
      });
    });

    return {
      monthCostsSum
    };
  }
});
</script>
