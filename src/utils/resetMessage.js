import { Message } from "element-ui";
let messageInstance = null;
const resetMessage = (options) => {
  // 判断当前是否有信息，如果有就关闭，然后弹出新框
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};
["error", "success", "info", "warning"].forEach((type) => {
  // this.$message.error----this.$message[type]// this.$message(options)
  resetMessage[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetMessage(options);
  };
});
export const message = resetMessage;
