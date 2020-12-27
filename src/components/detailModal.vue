<template>
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

    return {
      data,
      detailLog
    };
  }
});
</script>
