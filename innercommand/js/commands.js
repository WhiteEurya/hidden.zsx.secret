document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  const logContainer = document.getElementById("log-container");
  const userPrompt = document.getElementById("user-prompt");
  const commandInput = document.getElementById("command");
  const commandLine = document.getElementById("command-line");

  let vimViewer = null;

  const bootMessages = [
    "Initializing hardware...",
    "Loading kernel modules...",
    "Checking memory: OK",
    "Checking disk: OK",
    "Starting system services...",
    "System boot successful.",
  ];

  let isBootComplete = false;

  // 打印到终端的函数，增加逐字打印效果
  async function printToTerminal(text, delay = 50) {
    const line = document.createElement("div");
    logContainer.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;

    for (const char of text) {
      line.textContent += char;
      await new Promise((resolve) => setTimeout(resolve, delay)); // 延迟逐字打印
    }
  }

  function bootSequence() {
    let index = 0;

    function nextLine() {
      if (index < bootMessages.length) {
        printToTerminal(bootMessages[index]).then(() => {
          index++;
          setTimeout(nextLine, 300);
        });
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
        const data = await response.json();
        if (data.fileContent) {
          openVimViewer(data.fileContent); // 打开 Vim 查看器
        } else {
          await printToTerminal(data.output); // 打印 API 返回的内容
          updatePrompt(data.prompt || "[guest] / > ");
        }
      } else {
        printToTerminal("错误：无法处理指令");
      }
    } catch (error) {
      printToTerminal("网络错误，请稍后再试");
    }
  }

  function openVimViewer(content) {
    if (vimViewer) return;

    vimViewer = document.createElement("div");
    vimViewer.style.position = "fixed";
    vimViewer.style.top = "0";
    vimViewer.style.left = "0";
    vimViewer.style.width = "100vw";
    vimViewer.style.height = "100vh";
    vimViewer.style.backgroundColor = "black";
    vimViewer.style.color = "green";
    vimViewer.style.border = "10px solid green";
    vimViewer.style.overflow = "hidden";
    vimViewer.style.display = "flex";
    vimViewer.style.flexDirection = "column";

    const contentArea = document.createElement("div");
    contentArea.style.flex = "1";
    contentArea.style.overflowY = "scroll";
    contentArea.style.padding = "10px";
    contentArea.textContent = content;

    const commandBar = document.createElement("div");
    commandBar.style.height = "30px";
    commandBar.style.backgroundColor = "green";
    commandBar.style.color = "black";
    commandBar.textContent = "按 :q 退出";

    vimViewer.appendChild(contentArea);
    vimViewer.appendChild(commandBar);
    document.body.appendChild(vimViewer);

    document.addEventListener("keydown", handleVimKeyPress);
  }

  function closeVimViewer() {
    if (!vimViewer) return;
    document.body.removeChild(vimViewer);
    vimViewer = null;
    document.removeEventListener("keydown", handleVimKeyPress);
  }

  function handleVimKeyPress(event) {
    if (event.key === ":") {
      closeVimViewer();
    }
  }

  commandInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const command = commandInput.textContent.trim();
      if (isBootComplete) {
        printToTerminal(userPrompt.textContent + command).then(() => {
          processCommand(command);
          commandInput.textContent = ""; // 清空输入框
        });
        event.preventDefault();
      }
    }
  });

  bootSequence();
});