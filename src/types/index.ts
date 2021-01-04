import { ComputedRef } from "vue";
export type Costs = { code: string; hour: number }[];
export type Projects = {
  code: string;
  name: string;
}[];
export type Log = {
  inputStartTime: string;
  inputStartTimeHour: string;
  inputStartTimeMinutes: string;
  inputEndTime: string;
  inputEndTimeHour: string;
  inputEndTimeMinutes: string;
  duration: string;
  inputProjectCode: string;
  projectName: string | null;
  inputDescription: string;
};
export interface DayCost {
  date: string;
  costs: Costs;
  logs: Log[];
}
export interface State {
  projects: Projects;
  logs: Log[];
  dayCosts: DayCost[];
}
export interface Store {
  state: State;
  pushLog: (data: Log) => void;
  overwriteLogs: (data: Log[]) => void;
  resetLogs: () => void;
  costs: ComputedRef<Costs>;
  recordDayCost: (dayCost: DayCost) => void;
  overwriteDayCosts: (data: DayCost[]) => void;
}
