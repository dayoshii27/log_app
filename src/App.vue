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
<style lang="scss">
@use './assets/scss/reset.scss';

// variables
$color-main: #2e5ae6;

body {
  font-family: "Noto Sans JP", sans-serif;
  color: #666;
  background: #fff;
}
input,
select,
option {
  color: #666;
}
input[type="text"],
input[type="time"],
select {
  padding: 0 10px;
  border: none;
  background: #efefef;
  height: 40px;
  border-radius: 3px;
}
button {
  outline: none;
  border: 2px solid $color-main;
  background: $color-main;
  color: #fff;
  border-radius: 3px;
  padding: 10px 40px;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    background: #fff;
    color: $color-main;
  }
}

h1 {
  text-align: center;
  padding: 40px 0;
  color: #2e5ae6;
  font-size: 2rem;
}

.app-container {
  background: #fff;
  padding: 0 10px;
  max-width: 900px;
  margin: 0 auto;
}
.controller {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;

  &__btn {
    margin-left: 10px;
  }
}
.main-container {
  padding: 30px;
  box-shadow: 0 0 10px rgba(#000, 0.1);
}
.daily-record {
  &__date {
    margin-bottom: 15px;
  }
  &__table {
    margin-bottom: 15px;
  }
  &__btn {
    margin-top: 15px;
  }
  &__man-hour {
    margin-top: 30px;
  }
  &__man-hour-title {
    color: $color-main;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
.daily-record__form {
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  input,
  select {
    margin: 0 5px;
    &:first-child {
      margin-left: 0;
    }
  }
}
.monthly-mon-hour {
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 20px;

  &__date {
    color: $color-main;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  &__list {
    display: flex;
    padding: 0 5px;
    margin-top: 30px;
  }
  &__item {
    transition-duration: 0.2s;
    min-width: 140px;
    margin-right: 20px;
    box-shadow: 5px 5px 10px rgba(#000, 0.1);
    border-radius: 3px;
    padding: 10px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
      transform: scale(1.03);
      box-shadow: 8px 8px 13px rgba(#000, 0.08);
    }
  }
}

// Scroll Bar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 3px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-thumb {
  background-color: rgba($color-main, 0.3);
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.monthly-total {
  margin-top: 30px;

  &__title {
    color: $color-main;
    font-size: 20px;
    margin-bottom: 5px;
  }
}

// modal
main {
  .modal_opened & {
    position: fixed;
    width: 100%;
    z-index: -1;
  }
}

.modal {
  width: 100vw;
  height: 100vh;
  display: none;
  .modal_opened & {
    display: block;
  }

  &__inner {
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(#000, 0.5);
    justify-content: center;
    align-items: center;
  }
}

.log-record {
  background: #fff;
  padding: 40px 60px;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(#000, 0.1);

  &__date {
    color: $color-main;
  }
}

// destyle
input[type="date"] {
  border: none;
}
</style>
