<template>
  <div>
    <TopBar></TopBar>
    <div class="mask" v-if="isDragging == true && isInnerFile == false">
      松开发送文件
      <img class="maskImg" src="../assets/upload.png" />
    </div>
    <audio :src="NotifyAudio" ref="audio" muted></audio>
    <div @click="newMsg" class="newMsg" v-if="needToShow == true">
      <span>新消息</span>
      <img src="../assets/unread.png" />
    </div>
    <div class="main">
      <div class="board" ref="board">
        <div class="record-wrapper" v-for="item in msgList" :key="item.Key">
          <div class="msg msg-right" v-if="item.role == true">
            <div class="img-wrapper">
              <img class="img" :src="item.avatarUrl" />
            </div>
            <div class="head1">{{ item.name }}</div>
            <div
              class="message-wrapper message-wrapper-right"
              v-if="item.type == 'normalMsg'"
            >
              <div class="message">
                {{ item.content }}
              </div>
            </div>
            <el-progress
              :stroke-width="20"
              type="circle"
              :percentage="1"
              :color="customColor"
              class="progress-right"
            ></el-progress>
            <vue-hover-mask
              @click="handleClick($event)"
              style="pointer-events: none"
            >
              <template v-slot:action>
                <i class="icon el-icon-download" style="font-size: 16px"
                  >下载</i
                >
              </template>
              <div
                :ref="item.Key"
                class="msgFile"
                v-if="
                  item.type == 'audio' ||
                  item.type == 'video' ||
                  item.type == 'package' ||
                  item.type == 'other'
                "
              >
                <i class="icon el-icon-loading"></i>
                <span class="fileSize">{{ item.size }}</span>
                <img
                  :src="require(`../assets/${item.type}.png`)"
                  @dragstart.prevent
                />
                <span class="fileName" :title="item.content">{{
                  item.content | ellipsis
                }}</span>
              </div>
              <div class="imgBox" :ref="item.Key">
                <div></div>
                <div></div>
                <div></div>
                <img
                  :title="item.content"
                  :src="item.imgUrl"
                  v-if="item.type == 'picture'"
                  class="pic"
                />
              </div>
            </vue-hover-mask>
          </div>
          <div class="msg msg-left" v-else>
            <div class="img-wrapper">
              <img class="img" :src="item.avatarUrl" />
            </div>
            <div class="head2">{{ item.name }}</div>
            <div
              class="message-wrapper message-wrapper-left"
              v-if="item.type == 'normalMsg'"
            >
              <div class="message">
                {{ item.content }}
              </div>
            </div>
            <el-progress
              :stroke-width="20"
              type="circle"
              :percentage="1"
              :color="customColor"
              class="progress-left"
            ></el-progress>
            <vue-hover-mask
              @click="handleClick($event)"
              style="pointer-events: none"
            >
              <template v-slot:action>
                <i class="icon el-icon-download" style="font-size: 16px"
                  >下载</i
                >
              </template>
              <div
                :ref="item.Key"
                class="msgFile"
                v-if="
                  item.type == 'audio' ||
                  item.type == 'video' ||
                  item.type == 'package' ||
                  item.type == 'other'
                "
              >
                <i class="icon el-icon-loading"></i>
                <span class="fileSize">{{ item.size }}</span>
                <img
                  :src="require(`../assets/${item.type}.png`)"
                  @dragstart.prevent
                />
                <span class="fileName" :title="item.content">{{
                  item.content | ellipsis
                }}</span>
              </div>
              <div class="imgBox" :ref="item.Key">
                <div></div>
                <div></div>
                <div></div>
                <img
                  :title="item.content"
                  :src="item.imgUrl"
                  v-if="item.type == 'picture'"
                  class="pic"
                />
              </div>
            </vue-hover-mask>
          </div>
        </div>
      </div>
    </div>
    <div class="partition">
      <!-- 在线列表 -->
      <button class="showOnlineList" @click="showOnlineList">
        <img v-if="FLAG == false" src="../assets/openOnlineList.png" />
        <img v-else src="../assets/closeOnlineList.png" />
      </button>
      <!-- 表情 -->
      <el-popover placement="top" width="375" trigger="click">
        <div class="emojiBox">
          <p
            class="emoji"
            v-for="(item, index) in faceList[0].iconArr"
            :key="index"
            @click="clickEmoji(item.icon)"
          >
            {{ item.icon }}
          </p>
        </div>
        <button class="emoticon" slot="reference">
          <img src="../assets/emoticon.png" />
        </button>
      </el-popover>
      <!-- 上传文件 -->
      <div class="uploadProfile" @click="uploadFile">
        <img src="../assets/uploadProfile.png" />
        <input ref="fileRef" type="file" @change="fileChange" />
      </div>
      <!-- 发送消息 -->
      <button class="sendBtn" @click="sendMsg">发送</button>
    </div>
    <div class="sendMsg">
      <el-input
        id="textarea"
        type="textarea"
        v-model="textarea"
        @keydown.native="tcpClick($event)"
      ></el-input>
    </div>
  </div>
</template>

<script>
import VueHoverMask from "../components/VueHoverMask.vue";
var exec = window.require("child_process").exec;
import emojiArr from "../scripts/emojiArr";
import TopBar from "../components/TopBar.vue";
var lastEnterEle = null;
const { remote } = window.require("electron");
export default {
  name: "HomeView",
  components: {
    VueHoverMask,
    TopBar,
  },
  filters: {
    ellipsis(value) {
      let len = value.length;
      if (!value) return "";
      if (value.length > 20) {
        return value.substring(0, 6) + "..." + value.substring(len - 6, len);
      }
      return value;
    },
  },
  watch: {
    configure_win_x: function (newVal, oldVal) {
      console.log(newVal, oldVal);
    },
    configure_win_y: function (newVal, oldVal) {
      console.log(newVal, oldVal);
    },
  },
  data() {
    return {
      customColor: "#bb68fe",
      isDragging: false,
      needToShow: false,
      NotifyAudio: require("../assets/audio/msgNotify.mp3"),
      faceList: emojiArr,
      FLAG: false,
      textarea: "",
      selfAccount: "",
      msgList: [],
      curAcc: "",
      msgType: "",
      isInnerFile: false,
      profileTitle: "",
      fileSize: "",
      SWITCH: false,
    };
  },
  mounted() {
    this.changeWindowSize();
    this.selfAccount = sessionStorage.getItem("userAccount");
    this.needToShow = false;
    this.$bus.$on("normalMsg", (data) => {
      this.msgType = "normalMsg";
      this.curAcc = this.getAccount(data.state);
      var avatarUrl =
        "http://" +
        this.$systemConfig.HOST +
        ":8080/Server/UserProfile/" +
        this.curAcc;
      console.log(avatarUrl);
      var date = new Date();
      this.msgList.push({
        role: this.curAcc == this.selfAccount,
        content: this.getContent(data.state),
        name: this.getName(data.state),
        type: this.msgType,
        avatarUrl: avatarUrl,
        Key: date.getTime().toString() + date.getMilliseconds().toString(),
      });
      this.$refs["audio"].play();
      var isBottom =
        this.$refs.board.scrollHeight -
          this.$refs.board.scrollTop -
          this.$refs.board.clientHeight <=
        0;
      if (isBottom) {
        this.newMsg();
      } else {
        this.needToShow = true;
      }
    });
    this.$bus.$on("userStat", (data) => {
      var acc = this.getAccount(data.state);
      var avatarUrl =
        "http://" + this.$systemConfig.HOST + ":8080/Server/UserProfile/" + acc;
      console.log(avatarUrl, acc);
      var sendD = {
        avatarUrl: avatarUrl,
        name: this.getName(data.state),
        account: acc,
      };
      this.$bc2.postMessage(sendD);
    });
    // 文件传输
    this.$bus.$on("fileUpload", (data) => {
      var surfix = this.getContent(data.state).substring(
        this.getContent(data.state).lastIndexOf(".") + 1,
        this.getContent(data.state).lastIndexOf("$")
      );
      surfix = surfix.toLowerCase();
      this.fileSize = this.getContent(data.state).substring(
        this.getContent(data.state).lastIndexOf("$") + 1
      );
      this.msgType = this.judgeType(surfix);
      this.curAcc = this.getAccount(data.state);
      var contentTmp = this.getContent(data.state).substring(
        0,
        this.getContent(data.state).lastIndexOf("$")
      );
      var imgUrl =
        "http://" +
        this.$systemConfig.HOST +
        ":8080/Server/UserSrc/" +
        contentTmp;
      var avatarUrl =
        "http://" +
        this.$systemConfig.HOST +
        ":8080/Server/UserProfile/" +
        this.curAcc;
      console.log(avatarUrl, imgUrl);
      this.msgList.push({
        role: this.curAcc == this.selfAccount, // 账号
        content: contentTmp, // 文件名
        name: this.getName(data.state), // 用户昵称
        type: this.msgType, // 文件后缀
        size: this.displaySize(Number(this.fileSize)), // 文件大小
        avatarUrl: avatarUrl,
        imgUrl: imgUrl,
        Key: contentTmp,
      });
      this.$refs["audio"].play();
      setTimeout(() => {
        var isBottom =
          this.$refs.board.scrollHeight -
            this.$refs.board.scrollTop -
            this.$refs.board.clientHeight <=
          0;
        if (isBottom) {
          this.newMsg();
        } else {
          this.needToShow = true;
        }
      }, 1000);
    });
    var container = document.querySelector("#app");
    container.addEventListener("dragstart", this.drag);
    container.addEventListener("drop", this.dragUpload);
    container.addEventListener("dragenter", this.isIn);
    container.addEventListener("dragleave", this.isOut);
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    container.addEventListener("dragend", this.end);
    // 用户退出
    this.$bus.$on("exit", (data) => {
      if (data.state == "[][][]") {
        return;
      } else {
        var acc = this.getAccount(data.state);
        this.$bc3.postMessage(acc);
      }
    });
    this.$bus.$on("tfComplete", (data) => {
      var c = this.getContent(data.state).substring(
        0,
        this.getContent(data.state).lastIndexOf("$")
      );
      console.log(c);
      this.$nextTick(() => {
        this.$refs[c][0].children[0].style.display = "none";
        this.$refs[c][0].style.filter = "brightness(100%)";
        this.$refs[c][0].parentElement.style.pointerEvents = "auto";
      });
    });
  },

  methods: {
    displaySize(num) {
      if (num == 0) {
        return num.toString() + "";
      } else if (num > 0 && num < 1024) {
        num = parseFloat(num);
        return num.toFixed(2).toString() + "B";
      } else if (num >= 1024 && num < 1024 * 1024) {
        return (num / 1024).toFixed(2).toString() + "K";
      } else if (num >= 1024 * 1024 && num < 1024 * 1024 * 1024) {
        return (num / 1024 / 1024).toFixed(2).toString() + "M";
      } else if (num >= 1024 * 1024 * 1024 && num < 1024 * 1024 * 1024 * 1024) {
        return (num / 1024 / 1024 / 1024).toFixed(2).toString() + "G";
      }
    },
    SaveDialog(path) {
      this.$electron.remote.dialog
        .showSaveDialog({
          title: "请选择要保存的位置",
          defaultPath: path,
          buttonLabel: "保存",
          filters: [
            { name: "All Files", extensions: ["*"] },
            { name: "Images", extensions: ["jpg", "png", "gif"] },
            { name: "Movies", extensions: ["mkv", "avi", "mp4"] },
            { name: "Custom File Type", extensions: ["as"] },
          ],
        })
        .then((result) => {
          if (result.canceled == true) {
            return;
          } else {
            var data = {
              ip: this.$systemConfig.HOST,
              port: 12344,
              path: result.filePath,
              userId: this.selfAccount,
              cmdType: this.profileTitle,
            };
            console.log(data);
            this.download(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleClick(e) {
      if (e.path.length == 12) {
        this.profileTitle = e.path[1].children[0].children[3].title;
        console.log(this.profileTitle);
      } else if (e.path.length == 13) {
        this.profileTitle = e.path[2].children[0].children[3].title;
        console.log(this.profileTitle);
      }
      this.SaveDialog(this.profileTitle);
    },
    end(e) {
      this.isInnerFile = false;
      console.log(e);
    },
    drag() {
      this.isInnerFile = true;
    },
    judgeType(surfix) {
      switch (surfix) {
        case "png":
        case "jpeg":
        case "jpg":
        case "gif":
        case "bmp":
        case "webp":
        case "psd":
        case "svg":
          return "picture";
        case "mp3":
        case "ogg":
        case "wav":
        case "acc":
        case "silk":
          return "audio";
        case "mp4":
        case "webm":
        case "avi":
        case "rmvb":
        case "3gp":
        case "flv":
        case "mkv":
          return "video";
        case "rar":
        case "zip":
        case "arj":
        case "z":
        case "lzh":
        case "jar":
          return "package";
        default:
          return "other";
      }
    },
    newMsg() {
      this.$nextTick(() => {
        this.needToShow = false;
        this.$refs.board.scrollTop = this.$refs.board.scrollHeight;
      });
    },
    getAccount(data) {
      var flag = false;
      var startIndex;
      var acc = "";
      for (let i = 0; i < data.length; i++) {
        if (data[i] == "[") {
          if (flag == false) {
            flag = true;
            continue;
          } else {
            startIndex = i;
            break;
          }
        }
      }
      for (let i = startIndex + 1; data[i] != "]"; i++) {
        acc += data[i];
      }
      return acc;
    },
    getName(data) {
      var cnt = 0;
      var startIndex;
      var acc = "";
      for (let i = 0; i < data.length; i++) {
        if (data[i] == "[") {
          if (cnt != 2) {
            cnt++;
            continue;
          } else {
            startIndex = i;
            break;
          }
        }
      }
      for (let i = startIndex + 1; data[i] != "]"; i++) {
        acc += data[i];
      }
      return acc;
    },
    getContent(data) {
      return data.substring(data.indexOf("$") + 1);
    },
    sendMsg() {
      if (this.textarea == "" || this.textarea.trim().length == 0) {
        this.$message({
          message: "不能发送空白消息",
          type: "error",
          duration: 1500,
          center: true,
          offset: 40,
        });
        return false;
      }
      this.$Socket.sendData("0" + this.textarea);
      this.textarea = "";
    },
    // 点击表情包
    clickEmoji(val) {
      // 获取文本输入框元素节点
      let ele = document.querySelector("#textarea");
      // 获取光标
      let cursor = ele.selectionStart;
      // 设置文本内容
      ele.setRangeText(val);
      // 移动光标并聚焦
      ele.selectionStart = cursor + 2;
      ele.focus();
      // 使文本输入框的内容等于当前的值
      this.textarea = ele.value;
    },
    showOnlineList() {
      if (!this.FLAG) {
        this.configure_win_x = remote.getCurrentWindow().getPosition()[0];
        this.configure_win_y = remote.getCurrentWindow().getPosition()[1];
        this.$bc.postMessage(
          "open" +
            "#" +
            String(this.configure_win_x) +
            "#" +
            String(this.configure_win_y)
        );
        this.FLAG = true;
      } else {
        this.$bc.postMessage("close");
        this.FLAG = false;
      }
    },
    changeWindowSize() {
      this.$electron.ipcRenderer.send("changWindowSize");
    },
    tcpClick(event) {
      if (event.keyCode == 13 && event.ctrlKey) {
        this.textarea += "\n"; //换行
      } else if (event.keyCode == 13) {
        this.sendMsg(); //提交的执行函数
        event.preventDefault(); //禁止回车的默认换行
      }
    },
    // 进入拖拽
    isIn(e) {
      lastEnterEle = e.target;
      this.isDragging = true;
      console.log("dragenter");
    },
    // 离开拖拽
    isOut(e) {
      if (lastEnterEle === e.target) {
        this.isDragging = false;
        console.log("dragleave");
      }
    },
    uploadFile() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
    },
    // 拖拽实现上传
    dragUpload(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = false;
      var data = {
        ip: this.$systemConfig.HOST,
        port: 12345,
        path: e.dataTransfer.files[0].path,
        userId: this.selfAccount,
        cmdType: "file",
      };
      console.log(data);
      this.upload(data);
      this.isInnerFile = false;
    },
    // 点击上传按钮实现上传
    fileChange(e) {
      let file = e.target.files[0];
      console.log(file);
      var data = {
        ip: this.$systemConfig.HOST,
        port: 12345,
        path: file.path,
        userId: this.selfAccount,
        cmdType: "file",
      };
      console.log(data);
      this.upload(data);
    },
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
    download(data) {
      var spawn = window.require("child_process").spawn;
      var proc = spawn("download.exe", [
        data.ip,
        data.port,
        data.path,
        data.userId,
        data.cmdType,
      ]);
      proc.stdout.on("data", (data) => {
        data = data.toString().split("  ");
        if (data[1] == undefined) {
          data[1] = "0";
          return;
        }
        if (data[2] == undefined) {
          data[2] = "0";
          return;
        }
        var fName = data[0];
        var recvBytes = Number(data[1]);
        var totalBytes = Number(data[2].replace("\n", ""));
        console.log(
          "===文件名===:",
          fName,
          "===已传输字节===:",
          recvBytes,
          "===总字节===:",
          totalBytes
        );
        var progress = Math.floor((recvBytes / totalBytes) * 100);
        //这里拿到对应的div
        var baseElement = this.$refs[fName][0];
        var progressBar = baseElement.parentElement.previousSibling;
        var progressBarText = progressBar.children[1];
        var mask = baseElement.parentElement;
        console.log(progressBar);
        progressBar.children[0].childNodes[0].children[1].style.strokeDasharray = `${
          295.31 * progress * 0.01
        }px, 295.31px`;
        //console.log(progressBar.children[0].childNodes[0].children[1].style.strokeDasharray); //.style.strokeDasharray=`${295.31*50*0.01}px, 295.31px`
        progressBar.style.display = "block";
        progressBarText.innerText = progress + "%";
        baseElement.style.filter = "brightness(80%)";
        mask.style.pointerEvents = "none";
        if (progress == "100") {
          progressBar.style.display = "none";
          baseElement.style.filter = "brightness(100%)";
          mask.style.pointerEvents = "none";
        }
      });
      proc.on("close", function () {
        console.log("download.exe closed");
      });
    },
  },
  created() {
    // 防止页面跳转回登录页
    history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function () {
      history.pushState(null, null, document.URL);
    });
  },
};
</script>
<style>
.mask {
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 95%;
  z-index: 9999;
  line-height: 620px;
  color: #fff;
  font-size: 30px;
  box-sizing: border-box;
  border: 4px dashed rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}
.mask .maskImg {
  position: absolute;
  top: 201px;
  left: 356px;
  width: 86px;
  height: 86px;
}
.sendMsg {
  width: 800px;
  height: 150px;
  background: #000a12;
  flex: 1;
}
.el-textarea__inner {
  resize: none !important;
  padding-left: 20px !important;
  padding-right: 10px !important;
  font-size: 16px !important;
  font-family: NotoSansSC;
  width: 790px !important;
  min-height: 150px !important;
  background-color: rgba(0, 0, 0, 0) !important;
  border: 0 !important;
  color: #fff !important;
}
.el-textarea__inner:focus {
  outline: none !important;
}
.partition {
  height: 40px;
  width: 800px;
  background: #000a12;
  border-top: 2px solid #3a3e4b;
}
.main {
  min-height: 326px;
  width: 800px;
  background: #000a12;
  padding-top: 40px;
  padding-bottom: 10px;
}
.board {
  max-height: 326px;
  height: 326px;
  width: 749px;
  padding: 10px 10px;
  margin: 0 20px;
  /* border: 1px solid red; */
  overflow-y: auto;
  overflow-x: hidden;
}
.message-wrapper {
  max-width: 280px;
  margin: 19px 10px 10px 10px;
}
.message {
  margin: 10px;
  word-wrap: break-word;
  white-space: pre-line;
  text-align: left;
  font-size: 15px;
}
.msg {
  display: flex;
  flex-direction: row;
  position: relative;
  margin-top: 10px;
}
.message-wrapper-left {
  background-color: #30363d;
  color: #fff;
  border-radius: 0px 12px 12px 12px;
}
.message-wrapper-right {
  color: #fff;
  background-color: #30363d;
  border-radius: 12px 0px 12px 12px;
}
.img {
  flex: auto;
  height: 36px;
  width: 36px;
  border-radius: 8px;
}
.head1 {
  height: 20px;
  color: #fff;
  font-size: 13px;
  position: absolute;
  top: -2px;
  right: 50px;
}
.head2 {
  height: 20px;
  color: #fff;
  font-size: 13px;
  position: absolute;
  top: -2px;
  left: 50px;
}
.msg-right {
  flex-direction: row-reverse;
  margin-right: 10px;
}
.msg-left {
  flex-direction: row;
}
.partition {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 0 10px;
}
.showOnlineList {
  display: inline-block !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 0 !important;
  background: transparent !important;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 18px;
}

.showOnlineList img {
  width: 28px;
  height: 28px;
}
.showOnlineList img:hover {
  filter: brightness(70%);
}
.emoticon {
  display: inline-block !important;
  width: 24px !important;
  height: 24px !important;
  padding: 0 0 !important;
  background: transparent !important;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 18px;
  margin-top: 3px;
}
.emoticon img {
  width: 24px;
  height: 24px;
}
.emoticon img:hover {
  filter: brightness(70%);
}
.uploadProfile {
  display: inline-block !important;
  width: 28px !important;
  height: 28px !important;
  padding: 0 0 !important;
  background: transparent !important;
  border: 0;
  border-radius: 6px;
  margin-right: 18px;
  margin-top: -1px;
  position: relative;
  cursor: pointer;
}
.uploadProfile input {
  width: 28px;
  height: 28px;
  /* position: absolute;
  top: 0;
  left: 0; */
  opacity: 0;
}
.uploadProfile img {
  width: 28px;
  height: 28px;
}
.uploadProfile:hover img {
  filter: brightness(70%);
}
.emojiBox {
  height: 200px;
  overflow: auto;
  min-width: 375px;
}
.emoji {
  display: inline-block;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 24px;
  cursor: pointer;
  background: rgba(33, 34, 37, 0.7) !important;
  box-sizing: border-box;
}
.emoji:hover {
  background: rgba(72, 75, 82, 0.8) !important;
  transform: scale(1.3);
  transition: 100ms;
}
.el-popper[x-placement^="top"] .popper__arrow::after {
  bottom: -1px !important;
}
.el-popover {
  background: rgba(33, 34, 37, 0.7) !important;
  border: 0 !important;
}
.sendBtn {
  width: 70px;
  height: 28px;
  position: absolute;
  right: 26px;
  bottom: 168px;
  cursor: pointer;
  border-radius: 3px;
  border: 0;
  line-height: 27px;
}
.sendBtn:hover {
  filter: brightness(70%);
}
.newMsg:hover {
  filter: brightness(70%);
}
.newMsg {
  color: #fff;
  width: 102px;
  height: 34px;
  background: #212225;
  position: absolute;
  top: 353px;
  right: 25px;
  cursor: pointer;
  z-index: 90;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
  -webkit-animation: blurFadeInOut 1s linear;
  animation: blurFadeInOut 1s linear;
}
@keyframes blurFadeInOut {
  0% {
    opacity: 0;
    text-shadow: 0px 0px 40px #fff;
    transform: scale(0.9);
  }
  20%,
  100% {
    opacity: 1;
    text-shadow: 0px 0px 1px #fff;
    transform: scale(1);
  }
}
.newMsg img {
  width: 28px;
  height: 28px;
  position: absolute;
  bottom: 2px;
  right: 11px;
}
.newMsg span {
  position: absolute;
  bottom: 9px;
  right: 48px;
}
.msgFile {
  filter: brightness(80%);
  width: 220px;
  height: 80px;
  /* background: linear-gradient(to bottom, rgb(66, 133, 244), rgb(52, 168, 83)); */
  background: linear-gradient(to bottom, rgb(178, 87, 253), rgb(114, 112, 248));
  /* margin: 19px 10px 10px 10px; */
  position: relative;
  border-radius: 5px;
  cursor: pointer;
}
.msgFile img {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 10px;
  right: 20px;
}
.msgFile .icon {
  font-size: 30px;
  position: absolute;
  top: 35%;
  right: 42%;
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #00a67c,
    0 0 35px #00a67c, 0 0 40px #00a67c, 0 0 50px #00a67c, 0 0 75px #00a67c;
}
.msgFile .fileName {
  color: #fff;
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 14px;
  font-weight: 700;
}
.msgFile .fileSize {
  color: #fff;
  position: absolute;
  top: 37px;
  left: 22px;
  font-size: 13px;
  font-weight: 700;
}
.img-wrapper img {
  object-fit: cover;
}
.pic {
  display: inline;
  width: 160px;
  /* margin-top: 30px; */
  object-fit: contain;
}
.progress-right .el-progress-circle {
  width: 30px !important;
  height: 30px !important;
}
.progress-right {
  position: absolute;
  top: 42px !important;
  right: 277px !important;
  display: none;
}
.progress-right .el-progress__text {
  font-size: 8px !important;
  color: #fff !important;
}
.progress-left .el-progress-circle {
  width: 30px !important;
  height: 30px !important;
}
.progress-left {
  position: absolute;
  top: 42px !important;
  left: 277px !important;
  display: none;
}
.progress-left .el-progress__text {
  font-size: 8px !important;
  color: #fff !important;
}
</style>
