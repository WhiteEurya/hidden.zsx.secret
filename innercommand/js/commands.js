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

  function printToTerminal(text) {
    const line = document.createElement("div");
    line.textContent = text;
    logContainer.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function bootSequence() {
    let index = 0;

    function nextLine() {
      if (index < bootMessages.length) {
        printToTerminal(bootMessages[index]);
        index++;
        setTimeout(nextLine, 300);
      } else {
        bootComplete();
      }
    }

    nextLine();
  }

  function bootComplete() {
    isBootComplete = true;
    logContainer.innerHTML = ""; // 清除启动日志
    printToTerminal("欢迎进入终端。输入 help 以获取帮助。");
    updatePrompt();
    commandLine.style.display = "flex";
    commandInput.focus();
  }

  function updatePrompt(prompt = "[guest] / > ") {
    userPrompt.textContent = prompt;
  }

  async function processCommand(command) {
    if (!isBootComplete) {
      printToTerminal("系统正在启动，请稍后...");
      return;
    }

    if (!command) {
      printToTerminal(""); // 空命令换行
      return;
    }

    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });

      if (response.ok) {
        // 检查是否是文件流
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
          const fileName = contentDisposition.split("filename=")[1].replace(/"/g, ""); // 提取文件名
          const blob = await response.blob();
          triggerFileDownload(fileName, blob); // 自动下载文件
          printToTerminal(`文件 "${fileName}" 已成功下载。`);
        } else {
          // 处理普通文本响应
          const data = await response.json();
          printToTerminal(data.output);
          updatePrompt(data.prompt || "[guest] / > ");
        }
      } else {
        printToTerminal("错误：无法处理指令");
      }
    } catch (error) {
      printToTerminal("网络错误，请稍后再试");
    }
  }

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

  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = commandInput.textContent.trim();
      if (isBootComplete) {
        printToTerminal(userPrompt.textContent + command);
        processCommand(command);
        commandInput.textContent = ""; // 清空输入框
        event.preventDefault();
      }
    }
  });

  bootSequence();
});
