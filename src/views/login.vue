<template>
  <div class="login">
    <audio :src="NotifyAudio" ref="audio" muted></audio>
    <img src="../assets/cat.gif" class="logo" />
    <div class="form">
      <div class="item">
        <el-input
          autofocus="true"
          placeholder="请输入账号 (数字组合)"
          v-model="account"
          clearable
          prefix-icon="el-icon-user"
          oninput="value=value.replace(/[^\d]/g,'')"
        ></el-input>
      </div>
      <div class="item">
        <el-input
          placeholder="请输入密码"
          v-model="password"
          show-password
          prefix-icon="el-icon-lock"
        ></el-input>
      </div>
      <div class="item dl">
        <el-button type="primary" round @click="login" v-preventReClick
          >登录</el-button
        >
      </div>
      <div class="item zc">
        <el-button type="primary" round @click="register">注册</el-button>
      </div>
    </div>
  </div>
</template>
<script>
const { remote } = window.require("electron");
export default {
  name: "LoginChat",
  data() {
    return {
      account: "",
      password: "",
      reciveMsg: "",
      NotifyAudio: require("../assets/audio/login.mp3"),
    };
  },
  methods: {
    login() {
      if (this.account == "" || this.password == "") {
        this.$message({
          message: "用户名或密码不能为空",
          type: "error",
          duration: 1500,
          center: true,
          offset: 40,
        });
        return false;
      }
      var data = JSON.stringify({
        id: this.account,
        pwd: this.password,
      });
      this.$Socket.sendData("1" + data);
      this.$Socket.reciveData();
      this.$bus.$on("login", (msg) => {
        this.reciveMsg = msg;
        if (this.reciveMsg.state == "success") {
          sessionStorage.setItem("userAccount", this.account);
          this.$refs["audio"].play();
          this.$router.push("/home");
        } else {
          this.$message({
            message: "用户名或密码错误",
            type: "error",
            duration: 1500,
            center: true,
            offset: 40,
          });
          this.$Socket.wrEnd();
          this.$Socket.initSocket();
          console.log("Socket初始化成功");
          this.$Socket.connect(
            this.$systemConfig.PORT,
            this.$systemConfig.HOST
          );
        }
      });
    },
    register() {
      this.$router.push("/register");
    },
    // 登录按钮绑定回车事件
    keyDown(e) {
      //如果是回车则执行登录方法
      if (e.keyCode == 13) {
        this.login();
      }
    },
  },
  mounted() {
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  created() {
    this.configure_win_x = remote.getCurrentWindow().getPosition()[0];
    this.configure_win_y = remote.getCurrentWindow().getPosition()[1];
    const { href } = this.$router.resolve({
      path: `/showOnlineList`,
    });
    var w = "width=" + 0;
    var h = ",height=" + 0;
    var l = ",left=" + String(this.configure_win_x + 230);
    var t = ",top=" + String(this.configure_win_y + 90);
    window.open(href, "_blank", w + h + l + t);
  },
  destroyed() {
    // 销毁监听事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
}

.logo {
  position: absolute;
  top: 60px;
  left: 200px;
  display: inline-block;
  width: 100px;
  height: 100px;
}
.el-button--primary {
  background: #000a12 !important;
  border: 0 !important;
  width: 120px;
  color: #fff !important;
  font-family: NotoSansSC !important;
}
button {
  width: 100%;
}

.item {
  margin-top: 20px;
  margin-left: 80px;
  margin-right: 80px;
  font-family: NotoSansSC;
}
.el-input__inner {
  background: rgba(0, 0, 0, 0.3) !important;
  border: 0 !important;
  color: #eee !important;
  font-family: NotoSansSC !important;
}
.el-icon-user:before {
  color: #eee !important;
  font-weight: 500;
}
.el-icon-lock:before {
  color: #eee !important;
  font-weight: 500;
}
.el-input__inner::-webkit-input-placeholder {
  -webkit-text-fill-color: #eee;
}
.el-input__inner::-moz-input-placeholder {
  -webkit-text-fill-color: #eee;
}
.el-input__inner::-ms-input-placeholder {
  -webkit-text-fill-color: #eee;
}

.dl {
  position: absolute;
  top: 280px;
  left: 15px;
}
.zc {
  position: absolute;
  top: 280px;
  right: 15px;
}
.form {
  margin-top: 176px;
}
</style>
