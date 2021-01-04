<template>
  <div class="controller">
    <button @click="saveData" class="controller__btn">Save</button>
    <button @click="fetchDataDispatch" class="controller__btn">Read</button>
    <button @click="deleteData" class="controller__btn">Delete</button>
    <button @click="exportData" class="controller__btn">Export</button>
    <button @click="importData" class="controller__btn">Import</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { key } from "../stores/Store";
import moment from "moment";
import { Store, Log, DayCost } from "../types/index";

export default defineComponent({
  setup() {
    const store: Store | undefined = inject(key);
    const saveData = () => {
      if (window.confirm("データを保存しますか？")) {
        localStorage.setItem(
          "data",
          JSON.stringify({
            logs: store?.state.logs,
            dayCosts: store?.state.dayCosts
          })
        );
      }
    };
    const featchData = () => {
      const fetchedData = localStorage.getItem("data");
      const parsedData: { logs: Log[]; dayCosts: DayCost[] } =
        fetchedData !== null ? JSON.parse(fetchedData) : [];
      store?.overwriteLogs(parsedData.logs);
      store?.overwriteDayCosts(parsedData.dayCosts);
    };
    const fetchDataInitial = () => {
      if (localStorage.getItem("data")) {
        featchData();
      }
    };
    const fetchDataDispatch = () => {
      if (localStorage.getItem("data")) {
        if (window.confirm("保存されたデータを読み込みますか？")) {
          featchData();
        }
      } else {
        window.alert("データが存在しません。");
      }
    };
    const deleteData = () => {
      if (window.confirm("本当にデータを削除しますか？")) {
        localStorage.removeItem("data");
      }
    };
    const exportData = () => {
      const blob = new Blob([JSON.stringify(store?.state.dayCosts)]);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${moment().format("YYYYMMDDhhmmss")}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    };
    const importData = async () => {
      if (
        window.confirm("ローカルのjsonからログデータをインポートしますか？")
      ) {
        const data = await fetch("./json/dayCosts.json");
        const json: DayCost[] = await data.json();
        store?.overwriteDayCosts(json);
      }
    };

    fetchDataInitial();

    return {
      saveData,
      featchData,
      fetchDataInitial,
      fetchDataDispatch,
      deleteData,
      exportData,
      importData
    };
  }
});
</script>
