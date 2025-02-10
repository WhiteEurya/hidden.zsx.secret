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
  access <file>     - 访问目标文件 (需输入密码下载)
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
            return downloadFile(targetFile, res); // 无需密码直接下载
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
          state.fileAccessStep = null; // 验证通过，重置状态
          return downloadFile(targetFile, res); // 返回文件
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

function downloadFile(fileName, res) {
  const filePath = path.join(process.cwd(), "files", fileName); // 指向 files 文件夹
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", (err) => {
      console.error("文件读取错误:", err.message);
      res.status(500).json({ error: "文件读取失败" });
    });

    return fileStream.pipe(res); // 返回文件流
  } else {
    return res.status(404).json({ error: "文件不存在" });
  }
}

function getParentDirectory(path) {
  if (path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}
