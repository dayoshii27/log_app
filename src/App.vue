<template>
  <section class="task-logs">
    <div class="task-logs__control-btns">
      <button @click="saveData" class="task-logs__control-btn">Save</button>
      <button @click="fetchDataDispatch" class="task-logs__control-btn">
        Read
      </button>
      <button @click="deleteData" class="task-logs__control-btn">Delete</button>
    </div>
    <div class="task-logs__main-container">
      <h2 class="task-logs__date">{{ date }}</h2>
      <form @submit.prevent="addLog" class="add-logs">
        <input
          type="time"
          v-model="inputStartTime"
          class="add-logs__start-time"
        />
        ~
        <input type="time" v-model="inputEndTime" class="add-logs__end-time" />
        <select
          name="project-code"
          v-model="inputProjectCode"
          class="add-logs__project-code"
        >
          <option
            v-for="project in projects"
            :key="project.code"
            :value="project.code"
            >{{ project.name }}</option
          >
        </select>
        <input
          type="text"
          v-model="inputDescription"
          class="add-logs__task-description"
        />
      </form>
      <!-- <ul class="task-logs__list">
        <li v-for="(log, index) in logs" :key="index" class="task-logs__item">
          <span class="task-logs__start-time">{{ log.inputStartTime }}</span>〜
          <span class="task-logs__end-time">{{ log.inputEndTime }}</span>
          <span class="task-logs__elapsed-time">（{{ log.duration }}）</span>
          <span class="task-logs__project-code">{{ log.inputProjectCode }}</span>
          <span class="task-logs__task-description">{{ log.inputDescription }}</span>
        </li>
      </ul> -->
      <table class="task-logs__table">
        <tr v-for="(log, index) in logs" :key="index">
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

      <div v-if="costs.length > 0" class="costs">
        <p class="costs__title">Cost per projects</p>
        <ul class="costs__list">
          <li v-for="item in costs" :key="item.code" class="costs__item">
            <span class="costs__project-code">{{ item.code }}</span>
            :
            <span class="costs__costs">{{ item.hour }}</span>
          </li>
        </ul>
      </div>
      <button @click="recordDayCost" class="task-logs__btn--record">
        Record
      </button>
      <div v-if="dayCosts.length > 0" class="day-cost">
        <ul class="day-cost__list">
          <li
            v-for="dayCost in dayCosts"
            :key="dayCost.date"
            class="day-cost__item"
          >
            <h3 class="day-cost__date">{{ dayCost.date }}</h3>
            <ul>
              <li v-for="cost in dayCost.costs" :key="cost.code">
                {{ cost.code }}：{{ cost.hour }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <ul class="log-record">
      <li v-for="(dayCost, index) in dayCosts" :key="index">
        <h2>{{ dayCost.date }}</h2>
        <table class="task-logs__table">
          <tr v-for="(log, index) in dayCost.logs" :key="index">
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
      </li>
    </ul>
  </section>
</template>
<script>
import moment from "moment";
import projects from "./projects";
export default {
  name: "App",
  data: () => {
    return {
      date: moment().format("【MM/DD】"),
      dayCosts: [],
      logs: [],
      inputStartTime: "",
      inputEndTime: "",
      inputProjectCode: "",
      inputDescription: "",
      projects: projects
    };
  },
  computed: {
    duration() {
      const start = moment(this.inputStartTime, "h:mm");
      const end = moment(this.inputEndTime, "h:mm");
      return end.diff(start, "hours", true).toString();
    },
    projectName() {
      let projectName = null;
      this.projects.forEach(project => {
        if (project.code === this.inputProjectCode) {
          projectName = project.name;
        }
      });
      return projectName;
    },
    costs() {
      const costs = [];
      this.projects.forEach(project => {
        costs.push({
          code: project.code,
          hour: 0
        });
      });
      costs.forEach(item => {
        this.logs.forEach(log => {
          if (log.inputProjectCode === item.code) {
            item.hour += parseFloat(log.duration);
          }
        });
      });
      return costs.filter(item => item.hour !== 0);
    }
  },
  created() {
    this.fetchDataInitial();
  },
  methods: {
    addLog() {
      this.logs.push({
        inputStartTime: this.inputStartTime,
        inputStartTimeHour: moment(this.inputStartTime, "HH:mm").format("HH"),
        inputStartTimeMinutes: moment(this.inputStartTime, "HH:mm").format(
          "mm"
        ),
        inputEndTime: this.inputEndTime,
        inputEndTimeHour: moment(this.inputEndTime, "HH:mm").format("HH"),
        inputEndTimeMinutes: moment(this.inputEndTime, "HH:mm").format("mm"),
        duration: this.duration,
        inputProjectCode: this.inputProjectCode,
        projectName: this.projectName ? this.projectName : null,
        inputDescription: this.inputDescription
      });
      this.inputStartTime = this.inputEndTime;
      this.inputEndTime = "";
      this.inputProjectCode = "";
      this.inputDescription = "";
      document.querySelector(".add-logs__end-time").focus();
    },
    recordDayCost() {
      this.dayCosts.push({
        date: moment().format("M/D"),
        costs: this.costs,
        logs: this.logs
      });
      this.costs = [];
      this.logs = [];
      this.inputStartTime = "";
    },
    saveData() {
      if (window.confirm("データを保存しますか？")) {
        localStorage.setItem("data", JSON.stringify(this.$data));
      }
    },
    featchData() {
      const fetchedData = JSON.parse(localStorage.getItem("data"));
      this.dayCosts = fetchedData.dayCosts;
      this.logs = fetchedData.logs;
      this.inputStartTime = fetchedData.inputStartTime;
      this.inputEndTime = fetchedData.inputEndTime;
      this.inputProjectCode = fetchedData.inputProjectCode;
      this.inputDescription = fetchedData.inputDescription;
      this.projects = fetchedData.projects;
    },
    fetchDataInitial() {
      if (localStorage.getItem("data")) {
        this.featchData();
      }
    },
    fetchDataDispatch() {
      if (localStorage.getItem("data")) {
        if (window.confirm("保存されたデータを読み込みますか？")) {
          this.featchData();
        }
      } else {
        window.alert("データが存在しません。");
      }
    },
    deleteData() {
      if (window.confirm("本当にデータを削除しますか？")) {
        localStorage.removeItem("data");
      }
    }
  }
};
</script>
