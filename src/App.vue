<template>
  <section class="app-container">
    <h1>log app</h1>
    <ContollerButtons />
    <div class="main-container">
      <dailyRecord />
      <MonthlyManHour />
      <MonthlyTotal />
    </div>
  </section>
</template>

<script>
import { provide, defineComponent } from "vue";
import Store, { key } from "./stores/Store";
import ContollerButtons from "./components/ContollerButtons.vue";
import dailyRecord from "./components/DailyRecord.vue";
import MonthlyManHour from "./components/MonthlyManHour.vue";
import MonthlyTotal from "./components/MonthlyTotal.vue";

export default defineComponent({
  name: "App",
  components: {
    ContollerButtons,
    dailyRecord,
    MonthlyManHour,
    MonthlyTotal
  },
  setup() {
    provide(key, Store);
  }
});
</script>
