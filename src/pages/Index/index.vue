<!-- Index  -->
<template>
  <div>
    <p>Index</p>
    <ul>
      <li v-for="item in data.list" :key="item.id">
        {{ item.name }}-{{ item.creatTime }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from "apiF/Index";
export default {
  name: "Index",
  data() {
    return {
      data: {
        list: []
      }
    };
  },
  mounted() {
    this.bb();
  },
  methods: {
    bb() {
      let _this = this;
      api.getBB({ id: "cc" }).then(function(res) {
        _this.data.list = res.data.data.list;
      });
    }
  }
};
</script>
<style lang="stylus" scoped></style>
