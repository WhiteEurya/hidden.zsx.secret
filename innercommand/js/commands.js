// 模拟文件系统
const terminal = document.getElementById("terminal");
const userPrompt = document.getElementById("user-prompt");
const commandInput = document.getElementById("command");

const fileSystem = {
  "/": ["home", "downloads", "documents", "file1.txt", "file2.txt"],
  "/home": ["user1", "user2"],
  "/downloads": ["movie.mp4", "music.mp3"],
  "/documents": ["report.docx", "presentation.pptx"],
};

// 当前状态变量
let currentDirectory = "/";
let loggedIn = false;
let currentUser = "guest";

// 用户登录信息
const validCredentials = { username: "admin", password: "1234" };
let loginStep = null; // 当前登录步骤：null、"username"、"password"
let tempUsername = ""; // 临时存储用户名
let passwordInput = ""; // 隐藏输入的密码内容

const bootMessages = [
    "Initializing hardware...",
    "Loading kernel modules...",
    "Checking memory: OK",
    "Checking disk: OK",
    "Starting system services...",
    "System boot successful.",
    "\n",
  ];

let isBootComplete = false; // 开机动画完成标志

function printToTerminal(text, callback = null, time = 0) {
    console.log("callback = ", callback);
    const line = document.createElement("div");
    terminal.insertBefore(line, document.getElementById("command-line"));
    terminal.scrollTop = terminal.scrollHeight;

    let charIndex = 0;

    function typeNextChar() {
      if (charIndex < text.length) {
        line.textContent += text[charIndex++];
        setTimeout(typeNextChar, time); // 每个字符间隔
      } else if (callback) {
        callback();
      }
    }

    typeNextChar();
}

function bootSequence() {
    let index = 0;

    function nextLine() {
      console.log(bootMessages.length);
      if (index < bootMessages.length) {
        // console.log("Calling printToTerminal with callback:", nextLine);
        printToTerminal(bootMessages[index], nextLine, 50);
        index++;
      } else {
        bootComplete(); // 开机完成
      }
    }

    nextLine();
  }

  // 开机完成
  function bootComplete() {
    // 标记开机动画完成
    isBootComplete = true;
  
    // 清空终端内容
    terminal.innerHTML = "";
  
    // 打印默认的欢迎信息或提示符
    printToTerminal("欢迎进入终端。输入help以获取帮助.");
    printToTerminal(""); // 添加一个空行
    updatePrompt(); // 显示提示符
  
    // 将输入框重新附加到终端并聚焦
    terminal.appendChild(commandInput.parentNode);
    commandInput.focus();
  }

// 更新提示符
function updatePrompt() {
  // 如果处于登录过程中，动态调整提示文字
  if (loginStep === "username") {
    userPrompt.textContent = `username: `;
  } else if (loginStep === "password") {
    userPrompt.textContent = `password: `;
  } else {
    userPrompt.textContent = `[${currentUser}] ${currentDirectory} > `;
  }
}

// 获取上一级目录
function getParentDirectory(path) {
  if (path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}

// 处理命令
function processCommand(command) {
  // 登录流程的输入处理
  if (loginStep) {
    handleLogin(command);
    return;
  }

  const [cmd, ...args] = command.split(" ");
  switch (cmd) {
    case "help":
      printToTerminal("Available commands:");
      printToTerminal("  ls                - 列出当前目录");
      printToTerminal("  cd <directory>    - 进入目标目录 (使用 '..' 指代上层目录)");
      printToTerminal("  access <file>     - 访问目标文件");
      printToTerminal("  login             - 登录");
      break;

    case "ls":
      if (fileSystem[currentDirectory]) {
        printToTerminal(fileSystem[currentDirectory].join("\n"));
      } else {
        printToTerminal("错误：当前目录下无文件");
      }
      break;

    case "cd":
      if (args.length === 0) {
        printToTerminal("错误：请输入目录");
      } else if (args[0] === "..") {
        const parentDirectory = getParentDirectory(currentDirectory);
        if (parentDirectory) {
          currentDirectory = parentDirectory;
          updatePrompt();
        } else {
          printToTerminal("错误：已在根目录下");
        }
      } else {
        const targetDir = args[0];
        const newPath = currentDirectory === "/" ? `/${targetDir}` : `${currentDirectory}/${targetDir}`;
        if (fileSystem[newPath]) {
          currentDirectory = newPath;
          updatePrompt();
        } else {
          printToTerminal(`错误：目录 '${targetDir}' 不存在`);
        }
      }
      break;

      let awaitingDownloadConfirmation = false;
      let targetFileForDownload = "";
      
      case "access":
        if (args.length === 0) {
            printToTerminal("错误：请输入文件名");
        } else {
            const targetFile = args[0];
            if (fileSystem[currentDirectory] && fileSystem[currentDirectory].includes(targetFile)) {
            if (loggedIn) {
                printToTerminal("确认您的权限中...", () => {
                setTimeout(() => {
                    printToTerminal(`您可以访问 '${targetFile}'. 您是否需要下载该文件？ (yes/no)`, () => {
                    updatePrompt();
                    });
                }, 1000);
                }, 30);
            } else {
                printToTerminal("错误：权限不足。");
            }
            } else {
            printToTerminal(`错误：文件 '${targetFile}' 不存在`);
            }
        }
        break;

    case "login":
      if (loggedIn) {
        printToTerminal("您已登录");
      } else {
        loginStep = "username"; // 启动登录流程
        updatePrompt();
      }
      break;

    case "clear":
      const inputLine = commandInput.parentNode;
      terminal.innerHTML = "";
      terminal.appendChild(inputLine);
      break;

    default:
        printToTerminal(`错误: 指令 '${cmd}' 不存在. 输入 'help' 查询可行指令`);
  }
}

// 处理登录流程
function handleLogin(input) {
  if (loginStep === "username") {
    tempUsername = input; // 保存用户名
    loginStep = "password"; // 进入密码输入步骤
    updatePrompt(); // 更新提示符为 password:
    commandInput.textContent = ""; // 清空输入框
  } else if (loginStep === "password") {
    passwordInput = input; // 保存密码
    if (tempUsername === validCredentials.username && passwordInput === validCredentials.password) {
      loggedIn = true;
      currentUser = tempUsername; // 更新当前用户
      printToTerminal("登录成功！");
    } else {
      printToTerminal("错误: 用户名或密码不正确");
    }
    // 重置登录状态
    loginStep = null;
    tempUsername = "";
    passwordInput = "";
    updatePrompt(); // 恢复正常提示符
  }
}

// 捕获用户输入的命令
commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = commandInput.textContent.trim();
    if (loginStep === "password") {
      // 隐藏密码输入，用 "*" 替代
      printToTerminal(userPrompt.textContent + "*".repeat(command.length));
    } else {
      printToTerminal(userPrompt.textContent + command);
    }
    processCommand(command);
    commandInput.textContent = "";
    event.preventDefault();
  }
});

// 初始化提示符
bootSequence();
// updatePrompt();
// commandInput.focus();