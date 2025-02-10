import path from "path";
import fs from "fs";

const fileSystem = {
  "/": ["usr", "data", "logs", ".sys_config", "README.md"],
  "/usr": ["N17", "accompany"],
  "/usr/N17": ["众生相的真相.docx"],
  "/usr/accompany": ["认知留存分析实验细则.docx"],
  "/data": [],
  "/logs": [],
};

// 用于模拟文件的内容
const fileContents = {
  "认知留存分析实验细则.docx": `认知留存分析实验细则：
1. 实验背景
2. 实验目的
3. 实验步骤
4. 数据分析
...（内容省略）...`,
  "众生相的真相.docx": `众生相的真相：
这是一个描述众生相的文档。
内容包括：
- 第一部分
- 第二部分
- 第三部分
...（内容省略）...`,
};

const filePasswords = {
  "认知留存分析实验细则.docx": "1873",
};

let state = {
  currentDirectory: "/",
  loggedIn: false,
  currentUser: "guest",
  loginStep: null,
  tempUsername: "",
  fileAccessStep: null,
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "No command provided" });
  }

  const [cmd, ...args] = command.split(" ");
  let response = { output: "", prompt: `[${state.currentUser}] ${state.currentDirectory} > ` };

  switch (cmd) {
    case "help":
      response.output = `Available commands:
  ls                - 列出当前目录
  cd <directory>    - 进入目标目录 (使用 '..' 指代上层目录)
  access <file>     - 访问目标文件 (需输入密码查看)
  clear             - 清空终端`;
      break;

    case "ls":
      if (fileSystem[state.currentDirectory]) {
        const files = fileSystem[state.currentDirectory];
        response.output = files.length > 0 ? files.join("\n") : "当前目录为空";
      } else {
        response.output = "错误：当前目录不存在";
      }
      break;

    case "cd":
      if (args.length === 0) {
        response.output = "错误：请指定目录";
      } else if (args[0] === "..") {
        state.currentDirectory = getParentDirectory(state.currentDirectory) || "/";
      } else {
        const targetDir = args[0];
        const newPath =
          state.currentDirectory === "/" ? `/${targetDir}` : `${state.currentDirectory}/${targetDir}`;
        if (fileSystem[newPath]) {
          state.currentDirectory = newPath;
        } else {
          response.output = `错误：目录 '${targetDir}' 不存在`;
        }
      }
      break;

    case "access":
      if (args.length === 0) {
        response.output = "错误：请输入文件名";
      } else {
        const targetFile = args[0];
        const currentFiles = fileSystem[state.currentDirectory] || [];
        if (currentFiles.includes(targetFile)) {
          if (filePasswords[targetFile]) {
            response.output = `您正在尝试访问 '${targetFile}'，请输入密码：`;
            state.fileAccessStep = targetFile; // 设置当前正在访问的文件
          } else {
            response.output = `正在打开文件 '${targetFile}'...`;
            response.fileContent = fileContents[targetFile] || "文件内容为空";
          }
        } else {
          response.output = `错误：文件 '${targetFile}' 不存在`;
        }
      }
      break;

    default:
      if (state.fileAccessStep) {
        const targetFile = state.fileAccessStep;

        if (cmd === "exit" || cmd === "quit") {
          state.fileAccessStep = null;
          response.output = "已退出文件访问流程";
        } else if (filePasswords[targetFile] === cmd) {
          state.fileAccessStep = null; // 验证通过，返回文件内容
          response.output = `正在打开文件 '${targetFile}'...`;
          response.fileContent = fileContents[targetFile] || "文件内容为空";
        } else {
          response.output = "密码错误，请重新输入（或输入 'exit' 退出）：";
        }
      } else {
        response.output = `错误：未知命令 '${cmd}'。输入 'help' 获取帮助`;
      }
      break;
  }

  response.prompt = `[${state.currentUser}] ${state.currentDirectory} > `;
  return res.status(200).json(response);
}

function getParentDirectory(path) {
  if (path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}