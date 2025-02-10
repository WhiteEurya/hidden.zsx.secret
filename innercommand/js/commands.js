const terminal = document.getElementById("terminal");
const userPrompt = document.getElementById("user-prompt");
const commandInput = document.getElementById("command");
const commandLine = document.getElementById("command-line");

// 启动动画的日志信息
const bootMessages = [
  "Initializing hardware...",
  "Loading kernel modules...",
  "Checking memory: OK",
  "Checking disk: OK",
  "Starting system services...",
  "System boot successful.",
];

let isBootComplete = false; // 标记是否完成开机动画

/**
 * 在终端中逐字打印一行文本
 * @param {string} text - 要打印的文本
 * @param {function} callback - 打印完成后的回调函数
 * @param {number} time - 每个字符之间的延迟（毫秒）
 */
function printToTerminal(text, callback = null, time = 0) {
  const line = document.createElement("div");
  terminal.appendChild(line);
  terminal.scrollTop = terminal.scrollHeight;

  let charIndex = 0;

  function typeNextChar() {
    if (charIndex < text.length) {
      line.textContent += text[charIndex++];
      setTimeout(typeNextChar, time);
    } else if (callback) {
      callback();
    }
  }

  typeNextChar();
}

/**
 * 执行启动动画
 */
function bootSequence() {
  let index = 0;

  function nextLine() {
    if (index < bootMessages.length) {
      printToTerminal(bootMessages[index], nextLine, 50); // 每行50ms间隔逐字输出
      index++;
    } else {
      bootComplete(); // 启动完成
    }
  }

  nextLine();
}

/**
 * 启动完成后的处理
 */
function bootComplete() {
  isBootComplete = true;

  // 清空终端内容
  terminal.innerHTML = ""; // 清除启动动画的日志信息

  // 打印欢迎信息
  printToTerminal("欢迎进入终端。输入 help 以获取帮助。");

  // 更新提示符并显示输入行
  updatePrompt(); // 显示默认提示符 "[guest] / > "
  commandLine.style.visibility = "visible"; // 显示输入行

  // 聚焦到输入框
  commandInput.focus();
}

/**
 * 更新提示符
 * @param {string} promptText - 提示符文本
 */
function updatePrompt(promptText = "[guest] / > ") {
  userPrompt.textContent = promptText; // 更新提示符的内容
}

/**
 * 下载文件
 * @param {string} fileName - 文件名称
 * @param {string} fileContent - 文件内容
 */
function downloadFile(fileName, fileContent) {
  const blob = new Blob([fileContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * 处理用户输入的命令
 * @param {string} command - 用户输入的命令
 */
async function processCommand(command) {
  if (!isBootComplete) {
    printToTerminal("系统正在启动，请稍后...");
    return;
  }

  try {
    const response = await fetch("/api/terminal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ command }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.output) {
        printToTerminal(data.output);
      }

      if (data.fileName && data.fileContent) {
        downloadFile(data.fileName, data.fileContent);
      }

      updatePrompt(data.prompt);
    } else {
      printToTerminal("错误：无法处理指令");
    }
  } catch (error) {
    printToTerminal("网络错误，请稍后再试");
  }
}

// 监听用户输入
commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = commandInput.textContent.trim();
    if (isBootComplete) {
      printToTerminal(userPrompt.textContent + command); // 显示用户输入
    }
    processCommand(command);
    commandInput.textContent = ""; // 清空输入框
    event.preventDefault();
  }
});

// 启动加载动画
bootSequence();