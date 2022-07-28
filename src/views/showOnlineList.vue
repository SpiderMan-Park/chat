<template>
  <div class="wrap">
    <div class="head">Online Users</div>
    <div class="userList" v-for="item in onlineList" :key="item.account">
      <img :src="item.avatar" class="userImg" />
      <span class="userId">{{ item.name }}</span>
      <!-- <el-divider></el-divider> -->
    </div>
  </div>
</template>

<script>
const { remote } = window.require("electron");
var win = remote.getCurrentWindow();
var curStat = false;
export default {
  name: "ShowOnlineList",
  data() {
    return {
      onlineList: [],
    };
  },
  mounted() {
    const s = new Set();
    // 设置窗口位置
    this.$bc.onmessage = function (res) {
      var list = String(res.data).split("#");
      if (list[0] == "open") {
        var x = list[1];
        var y = list[2];
        win.setSize(200, 600);
        win.setOpacity(0.9);
        win.setPosition(Number(x) - 204, Number(y));
        win.show();
        curStat = true;
      } else {
        win.hide();
        curStat = false;
      }
    };
    this.$bc1.onmessage = function (res) {
      if (res.data == "hide") {
        win.hide();
      } else {
        win.setPosition(res.data[0] - 204, res.data[1]);
        if (!curStat) return;
        win.show();
      }
    };
    this.$bc2.onmessage = (res) => {
      if (s.has(res.data.account)) {
        return;
      } else {
        s.add(res.data.account);
        this.onlineList.push({
          avatar: res.data.avatarUrl,
          name: res.data.name,
          account: res.data.account,
        });
      }
    };
    this.$bc3.onmessage = (res) => {
      console.log(res.data);
      this.onlineList.splice(this.onlineList.indexOf(res.data), 1);
      s.delete(res.data);
    };
  },
  created() {
    win.setSize(0, 0);
    win.hide();
  },
};
</script>

<style>
.head {
  font-size: 14px;
  height: 28px;
  width: 100%;
  line-height: 29px;
  background: #000;
  color: #fff;
  text-align: left;
  padding-left: 21px;
  font-weight: 700;
  margin-bottom: 8px;
}
.wrap {
  width: 100%;
  height: 600px;
  /* background: linear-gradient(#ccffff, #ffcccc 60%); */
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  /* border: 3px solid #212121; */
}
.userList {
  width: 100%;
  height: 40px;
  /* background: linear-gradient(to right, #29323c, #485563, #2b5876, #4e4376); */
  /* box-shadow: 0 4px 15px 0 rgb(45 54 65 / 75%); */
  color: #fff;
  line-height: 40px;
  position: relative;
  font-size: 14px;
}
.userImg {
  position: absolute;
  top: 5px;
  left: 25px;
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 20px;
}
.userId {
  position: absolute;
  top: 0;
  right: 70px;
}
.el-divider--horizontal {
  margin: 0 !important;
}
</style>
