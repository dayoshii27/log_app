<template>
  <div v-if="store.state.dayCosts.length > 0" class="monthly-mon-hour">
    <ul class="monthly-mon-hour__list">
      <li
        v-for="dayCost in store.state.dayCosts"
        :key="dayCost.date"
        class="monthly-mon-hour__item"
        @click="showDetail(dayCost.date)"
      >
        <h3 class="monthly-mon-hour__date">{{ dayCost.date }}</h3>
        <ul>
          <li v-for="cost in dayCost.costs" :key="cost.code">
            {{ cost.code }}：{{ cost.hour }}
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <teleport to="#modal">
    <div class="modal__inner" @click="hideDetail">
      <div v-if="data.detailLogKey" class="log-record" @click.stop>
        <h2 class="log-record__date">{{ detailLog.date }}</h2>
        <table class="log-record__table">
          <tr v-for="(log, index) in detailLog.logs" :key="index">
            <td>{{ log.inputStartTimeHour }}</td>
            <td>時</td>
            <td>{{ log.inputStartTimeMinutes }}</td>
            <td>分</td>
            <td></td>
            <td>〜</td>
            <td>{{ log.inputEndTimeHour }}</td>
            <td>時</td>
            <td>{{ log.inputEndTimeMinutes }}</td>
            <td>分</td>
            <td></td>
            <td>
              <span v-if="log.projectName">【{{ log.projectName }}】</span
              >{{ log.inputDescription }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </teleport>
</template>

<script>
import { defineComponent, inject, reactive, computed } from "vue";
import { key } from "../stores/Store";

export default defineComponent({
  setup() {
    const store = inject(key);
    const data = reactive({
      detailLogKey: ""
    });
    const detailLog = computed(() => {
      return store.state.dayCosts.find(
        dayCost => dayCost.date === data.detailLogKey
      );
    });
    const body = document.querySelector("body");
    const showDetail = date => {
      data.detailLogKey = date;
      body.classList.add("modal_opened");
    };
    const hideDetail = () => {
      body.classList.remove("modal_opened");
    };

    return {
      data,
      store,
      detailLog,
      showDetail,
      hideDetail
    };
  }
});
</script>
