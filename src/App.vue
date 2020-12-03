<template>
  <section class="app-container">
    <h1>log app</h1>
    <div class="controller">
      <button @click="saveData" class="controller__btn">Save</button>
      <button @click="fetchDataDispatch" class="controller__btn">
        Read
      </button>
      <button @click="deleteData" class="controller__btn">Delete</button>
      <button @click="exportData" class="controller__btn">Export</button>
      <button @click="importData" class="controller__btn">Import</button>
    </div>
    <div class="main-container">
      <div class="daily-record">
        <h2 class="daily-record__date">
          <input type="date" name="" id="" v-model="date" />
        </h2>
        <form @submit.prevent="addLog" class="daily-record__form">
          <input
            type="time"
            data-input-name="start-time"
            v-model="inputStartTime"
          />
          ~
          <input
            type="time"
            data-input-name="end-time"
            v-model="inputEndTime"
          />
          <select name="project-code" v-model="inputProjectCode">
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
        <table class="daily-record__table">
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

        <div v-if="costs.length > 0" class="daily-record__man-hour">
          <p class="daily-record__man-hour-title">Cost per projects</p>
          <ul class="daily-record__man-hour-list">
            <li
              v-for="item in costs"
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
      <div v-if="dayCosts.length > 0" class="monthly-mon-hour">
        <ul class="monthly-mon-hour__list">
          <li
            v-for="dayCost in dayCosts"
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
    </div>
    <teleport to="#modal">
      <div class="modal__inner" @click="hideDetail">
        <div v-if="detailLogKey" class="log-record" @click.stop>
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
  </section>
</template>
<script>
import moment from "moment";
import projects from "./projects";

export default {
  name: "App",
  data: () => {
    return {
      date: moment().format("YYYY-MM-DD"),
      dayCosts: [],
      logs: [],
      inputStartTime: "",
      inputEndTime: "",
      inputProjectCode: "",
      inputDescription: "",
      projects: projects,
      detailLogKey: ""
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
    },
    detailLog() {
      return this.dayCosts.find(dayCost => dayCost.date === this.detailLogKey);
    },
    monthCostsSum() {
      const existingProjects = this.projects.filter(project =>
        this.dayCosts.some(dayCost =>
          dayCost.costs.some(cost => cost.code === project.code)
        )
      );
      return existingProjects.map(project => {
        return {
          code: project.code,
          name: project.name,
          sum: this.dayCosts.reduce((sum, dayCost) => {
            const add =
              dayCost.costs.find(cost => cost.code === project.code)?.hour || 0;
            return sum + add;
          }, 0)
        };
      });
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
      document.querySelector('[data-input-name="end-time"]').focus();
    },
    recordDayCost() {
      this.dayCosts.push({
        date: moment(this.date).format("YYYY/MM/DD"),
        costs: this.costs,
        logs: this.logs
      });
      this.costs = [];
      this.logs = [];
      this.inputStartTime = "";
    },
    showDetail(date) {
      this.detailLogKey = date;
      const body = document.querySelector("body");
      body.classList.add("modal_opened");
    },
    hideDetail() {
      const body = document.querySelector("body");
      body.classList.remove("modal_opened");
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
    },
    exportData() {
      const blob = new Blob([JSON.stringify(this.dayCosts)]);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${moment().format("YYYYMMDDhhmmss")}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    },
    async importData() {
      if (
        window.confirm("ローカルのjsonからログデータをインポートしますか？")
      ) {
        const data = await fetch("./json/dayCosts.json");
        const json = await data.json();
        this.dayCosts = json;
      }
    }
  }
};
</script>
