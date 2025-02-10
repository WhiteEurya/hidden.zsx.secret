document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  const logContainer = document.getElementById("log-container");
  const userPrompt = document.getElementById("user-prompt");
  const commandInput = document.getElementById("command");
  const commandLine = document.getElementById("command-line");
  const vimViewer = document.createElement("div");
  vimViewer.id = "vim-viewer";

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
        const data = await response.json();
        if (data.fileContent) {
          openVimViewer(data.fileContent); // 打开 Vim 查看器
        } else {
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

  function openVimViewer(content) {
    vimViewer.innerHTML = `
      <div class="vim-border">
        <div class="vim-content">${content.replace(/\n/g, "<br>")}</div>
        <div class="vim-status-bar">按 ":q" 退出文件查看器</div>
      </div>
    `;
    document.body.appendChild(vimViewer);
    vimViewer.style.display = "flex";

    document.addEventListener("keydown", (e) => {
      if (e.key === ":") {
        closeVimViewer();
      }
    });
  }

  function closeVimViewer() {
    vimViewer.style.display = "none";
    vimViewer.innerHTML = "";
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
