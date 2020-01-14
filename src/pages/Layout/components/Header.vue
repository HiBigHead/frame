<!-- Header -->
<template>
  <div class="app-header">
    <div class="left">
      left
    </div>
    <div class="right">
      <router-link to="/index">index</router-link>
      <router-link to="/system">system</router-link>
      <router-link to="/router">router</router-link>
      <router-link to="/page">page</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {};
  }
};
</script>
<style lang="stylus" scoped></style>
