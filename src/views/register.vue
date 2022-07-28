<template>
  <div class="register">
    <!-- <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :on-change="handleChange"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="icon-ai-up-img iconfont"></i>
    </el-upload> -->
    <div class="uploadImg">
      <div class="fileBox">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="icon-ai-up-img iconfont"></i>
        <input type="file" @change="changeFile" />
      </div>
    </div>
    <el-input
      class="userName"
      placeholder="请输入昵称"
      v-model="name"
      clearable
      prefix-icon="el-icon-user"
    ></el-input>
    <div class="registerForm">
      <div class="item">
        <el-input
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
      <div class="item backLogin">
        <el-button type="primary" round @click="backLogin">去登录</el-button>
      </div>
      <div class="item zc">
        <el-button type="primary" round @click="register" v-preventReClick
          >确定</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
var exec = window.require("child_process").exec;
export default {
  name: "RegisterChat",
  data() {
    return {
      flag: true,
      name: "",
      account: "",
      password: "",
      imageUrl: "",
      reciveMsg: "",
      imgPath: "",
    };
  },
  methods: {
    upload(data) {
      console.log(data);
      var cmdStr =
        "upload.exe" +
        " " +
        data.ip +
        " " +
        data.port +
        " " +
        data.path +
        " " +
        data.userId +
        " " +
        data.cmdType;
      console.log(cmdStr);
      exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
          console.log("script exec error" + stderr);
        } else {
          var data = stdout;
          console.log(data);
        }
      });
    },
    register() {
      if (this.account == "" || this.password == "") {
        this.$message({
          message: "用户名或密码不能为空",
          type: "error",
          duration: 1500,
          center: true,
          offset: 40,
        });
        return false;
      } else if (this.name == "") {
        this.$message({
          message: "昵称不能为空",
          type: "error",
          duration: 1500,
          center: true,
          offset: 40,
        });
        return false;
      } else if (this.imageUrl == "") {
        this.$message({
          message: "请上传头像",
          type: "error",
          duration: 1500,
          center: true,
          offset: 40,
        });
        return false;
      }
      if (this.flag) {
        this.flag = false;
        console.log("flag =" + this.flag);
        setTimeout(() => {
          this.flag = true;
        }, 1000);
      }
      var data = JSON.stringify({
        id: this.account,
        pwd: this.password,
        name: this.name,
      });
      this.$Socket.sendData("2" + data);
      this.$Socket.reciveData();
      this.$bus.$on("signup", (msg) => {
        this.reciveMsg = msg;
        if (this.reciveMsg.state == "success") {
          this.$message({
            message: "注册成功",
            type: "success",
            duration: 1500,
            center: true,
            offset: 40,
          });
          setTimeout(() => {
            var data = {
              ip: this.$systemConfig.HOST,
              port: 12345,
              path: this.imgPath,
              userId: this.account,
              cmdType: "profile",
            };
            console.log(data);
            this.upload(data);
          }, 500);
          this.$Socket.wrEnd();
          this.$Socket.initSocket();
          console.log("Socket初始化成功");
          this.$Socket.connect(
            this.$systemConfig.PORT,
            this.$systemConfig.HOST
          );
        } else {
          this.$message({
            message: "用户名已存在",
            type: "error",
            duration: 1500,
            center: true,
            offset: 40,
          });
        }
      });
    },
    backLogin() {
      this.account = "";
      this.password = "";
      this.$router.push("/");
    },
    changeFile(e) {
      let file = e.target.files[0];
      // 限制大小file.size      限制大小为2M   1024B-->1Kb    1024Kb-->1M
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error("图片大小超出限制");
        return;
      }
      // URL.createObjectURL()    可以将图片信息转换成具体的图片
      this.imageUrl = URL.createObjectURL(file);
      this.imgPath = file.path;
    },
  },
};
</script>
<style>
body {
  background: #000a12;
}
* {
  margin: 0;
  padding: 0;
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
.backLogin {
  position: absolute;
  top: 280px;
  left: 15px;
}
.zc {
  position: absolute;
  top: 280px;
  right: 15px;
}

.userName {
  display: inline-block !important;
  width: 210px !important;
  position: absolute !important;
  top: 114px !important;
  right: 81px !important;
}

.fileBox {
  width: 96px;
  height: 96px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  position: relative;
}

.fileBox input {
  width: 96px;
  height: 96px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.uploadImg {
  width: 96px;
  height: 96px;
  margin-top: 58px;
  margin-left: 81px;
}
.uploadImg:hover .iconfont {
  transform: scale(0.9);
  transition: 0.4s;
}
.iconfont {
  display: inline-block;
  color: #fff;
  width: 96px;
  height: 96px;
  line-height: 96px !important;
  text-align: center;
}
.avatar {
  width: 96px;
  height: 96px;
  display: block;
  border-radius: 8px;
  border: 4px solid #fff;
  box-sizing: border-box;
  opacity: 0.9;
  object-fit: cover; /* 图片不拉伸平铺 */
}
</style>
