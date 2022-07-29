<template>
  <!-- 防止鼠标与窗口失联,右键取消拖拽 -->
  <div @contextmenu="move(false)">
    <div
      class="header"
      :style="{ width: width }"
      @mousedown="move(true)"
      @mouseup="move(false)"
    >
      <span class="el-icon-minus" @click="minimizeWin"></span>
      <span class="el-icon-close" @click="closeWin"></span>
    </div>
  </div>
</template>

<script>
const win = require("electron").remote.getCurrentWindow();

export default {
  props: ["width"],
  name: "TopBar",
  data() {
    return {
      size: "",
    };
  },
  methods: {
    minimizeWin() {
      this.$electron.ipcRenderer.send("window-min");
    },
    closeWin() {
      this.$Socket.sendData("9");
      this.$Socket.close();
      this.$electron.ipcRenderer.send("window-close");
    },
    move(canMove) {
      var size = win.getContentSize();
      this.$electron.ipcRenderer.send("windowDrag", canMove, size);
      if (win.getContentSize()[0] == 500) {
        return false;
      }

      if (canMove == true) {
        this.$bc1.postMessage("hide");
      } else {
        const pos = win.getPosition();
        this.$bc1.postMessage(pos);
      }
    },
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

.header {
  height: 30px;
  background: #000;
  /* -webkit-app-region: drag; */
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
}
.header .el-icon-minus {
  position: absolute;
  top: 0;
  right: 30px;
  cursor: pointer;
  display: inline-block;
  width: 30px;
  height: 30px;
  /* -webkit-app-region: no-drag; */
}
.header .el-icon-minus:hover {
  background: #808080;
}
.header .el-icon-minus::before {
  margin-top: 6px;
  display: inline-block;
  color: #eee;
}
.header .el-icon-close {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  display: inline-block;
  width: 30px;
  height: 30px;
  /* -webkit-app-region: no-drag; */
}
.header .el-icon-close:hover {
  background: #e4287c;
}
.header .el-icon-close::before {
  margin-top: 6px;
  display: inline-block;
  color: #eee;
}
</style>
