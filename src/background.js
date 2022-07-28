"use strict";
import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  ipcMain,
  globalShortcut,
  screen,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  createMenu();
  // 创建浏览器窗口
  const win = new BrowserWindow({
    opacity: 0.9,
    width: 500, // 设置窗口的宽
    height: 377, // 设置窗口的高
    frame: false,
    maximizable: false,
    resizable: false,
    webPreferences: {
      webSecurity: false, // 是否禁用浏览器的跨域安全特性
      nodeIntegration: true, // 支持Node
      contextIsolation: false, // 禁用下文隔离
      enableRemoteModule: true, // 开启Remote
    },
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  //创建完页面后
  win.hookWindowMessage(278, function () {
    win.setEnabled(false); //窗口禁用
    setTimeout(() => {
      win.setEnabled(true);
    }, 100); //延时太快会立刻启动，太慢会妨碍窗口其他操作，可自行测试最佳时间
    return true;
  });

  ipcMain.on("changWindowSize", () => win.setSize(800, 600));

  var winStartPosition = { x: 0, y: 0 };
  var mouseStartPosition = { x: 0, y: 0 };
  var movingInterval = null;
  ipcMain.on("windowDrag", (events, canMoving) => {
    if (canMoving) {
      // 读取原位置
      var winPosition = win.getPosition();
      winStartPosition = { x: winPosition[0], y: winPosition[1] };
      mouseStartPosition = screen.getCursorScreenPoint();
      // 清除
      if (movingInterval) {
        clearInterval(movingInterval);
      }
      movingInterval = setInterval(() => {
        // 实时更新位置
        var cursorPosition = screen.getCursorScreenPoint();
        var x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
        var y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
        win.setPosition(x, y, true);
      }, 10);
    } else {
      clearInterval(movingInterval);
      movingInterval = null;
    }
  });

  globalShortcut.register("CommandOrControl+Shift+I", function () {
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });
  // 1. 窗口 最小化
  ipcMain.on("window-min", function () {
    // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
    win.minimize();
  });

  // 3. 关闭窗口
  ipcMain.on("window-close", function () {
    app.exit();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    win.loadURL("app://./index.html");
  }
}

// 设置菜单
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === "darwin") {
    const template = [
      {
        label: "App Demo",
        submenu: [
          {
            role: "about",
          },
          {
            role: "quit",
          },
        ],
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  } else {
    // windows及linux系统
    Menu.setApplicationMenu(null);
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS);
  //   } catch (e) {
  //     console.error("Vue Devtools failed to install:", e.toString());
  //   }
  // }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
