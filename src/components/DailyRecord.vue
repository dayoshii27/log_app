<template>
  <div class="daily-record">
    <h2 class="daily-record__date">
      <input type="date" name="" id="" v-model="data.date" />
    </h2>
    <form @submit.prevent="addLog" class="daily-record__form">
      <input
        type="time"
        data-input-name="start-time"
        v-model="data.inputStartTime"
      />
      ~
      <input
        type="time"
        data-input-name="end-time"
        v-model="data.inputEndTime"
      />
      <select name="project-code" v-model="data.inputProjectCode">
        <option
          v-for="project in store.state.projects"
          :key="project.code"
          :value="project.code"
          >{{ project.name }}</option
        >
      </select>
      <input
        type="text"
        v-model="data.inputDescription"
        class="add-logs__task-description"
      />
    </form>
    <table class="daily-record__table">
      <tr v-for="(log, index) in store.state.logs" :key="index">
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

    <div v-if="store.costs.length > 0" class="daily-record__man-hour">
      <p class="daily-record__man-hour-title">Cost per projects</p>
      <ul class="daily-record__man-hour-list">
        <li
          v-for="item in store.costs"
          :key="item.code"
          class="daily-record__man-hour-item"
        >
          <span class="daily-record__man-hour-project-code">{{
            item.code
          }}</span>
          :
          <span class="daily-record__man-hour-costs">{{ item.hour }}</span>
        </li>
      </ul>
    </div>
    <button @click="recordDayCost" class="daily-record__btn">
      Record
    </button>
  </div>
</template>

<script>
import moment from "moment";
import { reactive, defineComponent, computed, inject } from "vue";
import { key } from "../stores/Store";
export default defineComponent({
  setup() {
    const store = inject(key);
    const data = reactive({
      date: moment().format("YYYY-MM-DD"),
      inputStartTime: "",
      inputEndTime: "",
      inputProjectCode: "",
      inputDescription: ""
    });
    const inputDuration = computed(() => {
      const start = moment(data.inputStartTime, "h:mm");
      const end = moment(data.inputEndTime, "h:mm");
      return end.diff(start, "hours", true).toString();
    });
    const projectName = computed(() => {
      let projectName = null;
      store.state.projects.forEach(project => {
        if (project.code === data.inputProjectCode) {
          projectName = project.name;
        }
      });
      return projectName;
    });
    const addLog = () => {
      store.pushLog({
        inputStartTime: data.inputStartTime,
        inputStartTimeHour: moment(data.inputStartTime, "HH:mm").format("HH"),
        inputStartTimeMinutes: moment(data.inputStartTime, "HH:mm").format(
          "mm"
        ),
        inputEndTime: data.inputEndTime,
        inputEndTimeHour: moment(data.inputEndTime, "HH:mm").format("HH"),
        inputEndTimeMinutes: moment(data.inputEndTime, "HH:mm").format("mm"),
        duration: inputDuration.value,
        inputProjectCode: data.inputProjectCode,
        projectName: projectName.value ? projectName.value : null,
        inputDescription: data.inputDescription
      });
      data.inputStartTime = data.inputEndTime;
      data.inputEndTime = "";
      data.inputProjectCode = "";
      data.inputDescription = "";
      document.querySelector('[data-input-name="end-time"]').focus();
    };
    const recordDayCost = () => {
      store.recordDayCost({
        date: moment(data.date).format("YYYY/MM/DD"),
        costs: store.costs.value,
        logs: store.state.logs
      });
      store.resetLogs();
      data.inputStartTime = "";
    };

    return {
      store,
      data,
      addLog,
      recordDayCost
    };
  }
});
</script>

<style></style>
