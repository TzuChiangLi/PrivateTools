<template>
  <div class="main-container flex">
    <div w="full">
      <RouterView/>
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  text-align: center;
  width: 100%;
  height: 100%;
}

.main-container {
  height: calc(100vh);
}
</style>

<script>
export default {};
</script>

