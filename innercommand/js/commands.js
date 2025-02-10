document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  const logContainer = document.getElementById("log-container");
  const userPrompt = document.getElementById("user-prompt");
  const commandInput = document.getElementById("command");
  const commandLine = document.getElementById("command-line");

  const bootMessages = [
    "Initializing hardware...",
    "Loading kernel modules...",
    "Checking memory: OK",
    "Checking disk: OK",
    "Starting system services...",
    "System boot successful.",
  ];

  let isBootComplete = false;

  /**
   * 在终端中逐字打印一行文本
   * @param {string} text - 要打印的文本
   * @param {function} callback - 打印完成后的回调函数
   * @param {number} time - 每个字符之间的延迟（毫秒）
   */
  function printToTerminal(text, callback = null, time = 0) {
    const line = document.createElement("div");
    logContainer.appendChild(line); // 将日志放入 log-container
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

    // 清空日志内容，而不是整个 terminal
    logContainer.innerHTML = ""; // 只清空启动日志

    // 打印欢迎信息
    printToTerminal("欢迎进入终端。输入 help 以获取帮助。");

    // 更新提示符
    updatePrompt();

    // 显示输入行
    commandLine.style.display = "flex";
    commandInput.focus();
  }

  /**
   * 更新提示符
   * @param {string} promptText - 提示符文本
   */
  function updatePrompt(promptText = "[guest] / > ") {
    userPrompt.textContent = promptText; // 更新提示符内容
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

    if (!command) {
      printToTerminal(""); // 如果输入为空，则直接换行
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
        // 检查是否是文件流
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
          const fileName = contentDisposition
            .split("filename=")[1]
            .replace(/"/g, ""); // 提取文件名
          const blob = await response.blob();
          triggerFileDownload(fileName, blob);
          printToTerminal(`文件 "${fileName}" 已下载。`);
        } else {
          // 处理普通文本响应
          const data = await response.json();
          if (data.output) {
            printToTerminal(data.output); // 输出后端返回信息
          }
          updatePrompt(data.prompt || "[guest] / > "); // 如果后端返回新提示符，则更新
        }
      } else {
        printToTerminal("错误：无法处理指令");
      }
    } catch (error) {
      printToTerminal("网络错误，请稍后再试");
    }
  }

  /**
   * 触发文件下载
   * @param {string} fileName - 文件名称
   * @param {Blob} blob - 文件数据
   */
  function triggerFileDownload(fileName, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // 监听用户输入
  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = commandInput.textContent.trim();
      if (isBootComplete) {
        printToTerminal(userPrompt.textContent + command); // 显示用户输入
      }
      processCommand(command); // 处理命令
      commandInput.textContent = ""; // 清空输入框
      event.preventDefault();
    }
  });

  // 启动加载动画
  bootSequence();
});
