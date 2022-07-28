const net = window.require("net");

import bus from "@/utils/bus";
export default {
  initSocket: function () {
    this.socket = new net.Socket();
  },
  connect: function (PORT, HOST) {
    this.socket.connect(PORT, HOST, () => {
      console.log("连接成功: " + HOST + ":" + PORT);
    });
  },

  getSeq: function (data) {
    var i = data.indexOf("#");
    var str = data.substring(0, i);
    console.log(Number(str), "xxxxxxx");
    return Number(str);
  },
  getType: function (data) {
    var i = data.indexOf("#");
    var str = data.substring(i + 1);
    return str;
  },

  reciveData: function () {
    var seq = -1;
    this.socket.on("data", (data) => {
      console.log("DATA: " + data);
      data = new Buffer(JSON.parse(JSON.stringify(data)));
      var bytesData = JSON.parse(data.toString());
      if (this.getSeq(bytesData.type) == seq) return;
      else {
        seq = this.getSeq(bytesData.type);
      }

      switch (this.getType(bytesData.type)) {
        case "login":
          bus.$emit("login", bytesData);
          break;
        case "signup":
          bus.$emit("signup", bytesData);
          break;
        case "userStat":
          bus.$emit("userStat", bytesData);
          break;
        case "normalMsg":
          bus.$emit("normalMsg", bytesData);
          break;
        case "fileUpload":
          bus.$emit("fileUpload", bytesData);
          break;
        case "tfComplete":
          bus.$emit("tfComplete", bytesData);
          break;
        case "exit":
          bus.$emit("exit", bytesData);
          break;
      }
    });
  },
  // socket 完全关闭就发出该事件, 监听连接关闭事件
  close: function () {
    this.socket.on("close", function () {
      console.log("关闭连接");
    });
  },
  sendData: function (msg) {
    this.socket.write(msg);
  },
  // 手动关闭连接
  destroyTcp: function () {
    this.socket.destroy();
  },
  wrEnd: function () {
    this.socket.end();
  },
};
