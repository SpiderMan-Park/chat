<template>
  <div id="app">
    <TopBar
      :width="path == '/' || path == '/register' ? width1 : width2"
      v-if="path == '/' || path == '/register' || path == '/home'"
    ></TopBar>
    <img
      src="./assets/loginBackImg.gif"
      class="bg"
      v-if="path == '/' || path == '/register'"
    />
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import TopBar from "./components/TopBar.vue";
export default {
  components: {
    TopBar,
  },
  data() {
    return {
      transitionName: "",
      path: "",
      width1: "500px",
      width2: "800px",
    };
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      this.path = to.path;
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (
        (to.meta.index == 1 || to.meta.index == 2) &&
        to.meta.index != 3 &&
        to.meta.index != 4
      ) {
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = "slide-left";
        } else {
          this.transitionName = "slide-right";
        }
      }
    },
  },
  mounted() {
    console.log(this.$systemConfig);
    this.$Socket.initSocket();
    console.log("Socket初始化成功");
    this.$Socket.connect(this.$systemConfig.PORT, this.$systemConfig.HOST);
    this.path = this.$route.path;
  },
};
</script>
<style lang="stylus">
#app {
  font-family: NotoSansSC;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style>
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-right-enter {
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  transform: translate3d(-100%, 0, 0);
}
#app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: absolute;
}
.bg {
  height: 347px;
  width: 500px;
  position: absolute;
  top: 30px;
  left: 0;
  filter: blur(40px);
  z-index: -1;
}
</style>
