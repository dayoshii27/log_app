import { reactive, computed, readonly } from "vue";
import projects from "../projects";
const state = reactive({
  projects,
  logs: [],
  dayCosts: []
});

const costs = computed(() => {
  const costs = [];
  state.projects.forEach(project => {
    costs.push({
      code: project.code,
      hour: 0
    });
  });
  costs.forEach(item => {
    state.logs.forEach(log => {
      if (log.inputProjectCode === item.code) {
        item.hour += parseFloat(log.duration);
      }
    });
  });
  return costs.filter(item => item.hour !== 0);
});

const pushLog = data => {
  state.logs.push(data);
};
const resetLogs = () => {
  state.logs = [];
};
const overwriteLogs = data => {
  state.logs = data;
};

const recordDayCost = dayCost => {
  state.dayCosts.push(dayCost);
};
const overwriteDayCosts = data => {
  state.dayCosts = data;
};

export default {
  state: readonly(state),
  pushLog,
  overwriteLogs,
  resetLogs,
  costs,
  recordDayCost,
  overwriteDayCosts
};

export const key = Symbol("store-key");
