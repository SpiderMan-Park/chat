const fs = window.require("fs");
var net = window.require("net");
export default {
  uploadFile: function (port, host, filePath, id, cmdType) {
    var client = new net.Socket();
    client.connect(port, host, function () {
      console.log("CONNECTED TO: " + port + ":" + host);
      var data = fs.readFileSync(filePath);
      var c = Math.ceil(data.length / 1024);
      var l = data.length % 1024;
      var per = 0;
      var surfix = filePath.substring(filePath.lastIndexOf("."));
      console.log(surfix);
      client.write(cmdType + "#" + id + surfix);
      for (let i = 0; i < c; i++) {
        var arr = data.slice(per, per + 1024);
        client.write(arr);
        per += 1024;
      }
      client.write(data.slice(per, per + l - 1));
      client.end();
    });
  },
};
