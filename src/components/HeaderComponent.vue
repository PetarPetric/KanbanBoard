<template>
  <header class="header">
    <img class="header__logo" src="@/assets/random-logo.png" alt="application logo">
    <h1>Kanban Board</h1>
  </header>
</template>

<style lang="scss" scoped>
.header {
  height: 5.6rem;
  border-bottom: 1px solid #e8ebed;
  padding: 1rem;
  display: flex;
  align-items: center;

  &>* {
    padding: 0 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  &__logo {
    height: 100%;
  }
}
</style>
