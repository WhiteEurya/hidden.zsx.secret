const terminal = document.getElementById("terminal");
const userPrompt = document.getElementById("user-prompt");
const commandInput = document.getElementById("command");

function printToTerminal(text) {
  const line = document.createElement("div");
  line.textContent = text;
  terminal.insertBefore(line, document.getElementById("command-line"));
  terminal.scrollTop = terminal.scrollHeight;
}

function updatePrompt(promptText) {
  userPrompt.textContent = promptText;
}

async function processCommand(command) {
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
      updatePrompt(data.prompt);
    } else {
      printToTerminal("错误：无法处理指令");
    }
  } catch (error) {
    printToTerminal("网络错误，请稍后再试");
  }
}

// 捕获用户输入的命令
commandInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = commandInput.textContent.trim();
    printToTerminal(userPrompt.textContent + command); // 在终端显示用户输入
    processCommand(command); // 将输入发送到 API
    commandInput.textContent = ""; // 清空输入框
    event.preventDefault();
  }
});

// 初始化提示符
updatePrompt("[guest] / > ");