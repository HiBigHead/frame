<!-- Layout -->
<template>
  <div class="app-page">
    <Header></Header>
    <Sider></Sider>
    <Content></Content>
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Header from "./components/Header";
// import Footer from "./components/Footer";
import Sider from "./components/Sider";
import Content from "./components/Content";
export default {
  name: "Layout",
  components: {
    Header,
    // Footer,
    Sider,
    Content
  },
  data() {
    return {};
  }
};
</script>
<style lang='stylus' scoped></style>