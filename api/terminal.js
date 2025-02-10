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
  cancel            - 退出当前操作
  login             - 登录
  clear             - 清空终端`;
      break;

    case "ls":
      if (fileSystem[state.currentDirectory]) {
        const files = fileSystem[state.currentDirectory];
        if (files.length === 0) {
          response.output = "权限不足，该目录文件已被隐藏";
        } else {
          response.output = files.join("\n");
        }
      } else {
        response.output = "错误：当前目录下无文件";
      }
      break;

    case "cd":
      if (args.length === 0) {
        response.output = "错误：请输入目录";
      } else if (args[0] === "..") {
        const parentDirectory = getParentDirectory(state.currentDirectory);
        if (parentDirectory) {
          state.currentDirectory = parentDirectory;
        } else {
          response.output = "错误：已在根目录下";
        }
      } else {
        const targetDir = args[0];
        const newPath =
          state.currentDirectory === "/" ? `/${targetDir}` : `${state.currentDirectory}/${targetDir}`;
        if (fileSystem[newPath]) {
          if (fileSystem[newPath].length === 0) {
            response.output = "权限不足，该目录文件已被隐藏";
          } else {
            state.currentDirectory = newPath;
          }
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
        if (
          fileSystem[state.currentDirectory] &&
          fileSystem[state.currentDirectory].includes(targetFile)
        ) {
          if (filePasswords[targetFile]) {
            response.output = `您正在尝试访问 '${targetFile}'，请输入密码：`;
            state.fileAccessStep = targetFile; // 设置当前正在访问的文件
          } else if (state.loggedIn) {
            response.output = `您可以访问 '${targetFile}'.`;
          } else {
            response.output = "错误：权限不足。";
          }
        } else {
          response.output = `错误：文件 '${targetFile}' 不存在`;
        }
      }
      break;

    case "cancel":
      if (state.fileAccessStep) {
        response.output = `已退出对文件 '${state.fileAccessStep}' 的访问。`;
        state.fileAccessStep = null; // 重置文件访问状态
      } else {
        response.output = "错误：当前没有正在进行的操作可以取消。";
      }
      break;

    default:
      if (state.fileAccessStep) {
        // 如果用户输入的是密码，验证它是否正确
        const fileName = state.fileAccessStep;
        if (filePasswords[fileName] === cmd) {
          state.fileAccessStep = null; // 重置文件访问状态

          // 模拟文件内容
          const fileData = {
            "众生相的真相.txt": "这是众生相的真相文件内容。",
            "认知留存分析实验细则.txt": "这是认知留存分析实验细则文件内容。",
          };

          response.output = `密码正确！开始下载文件：${fileName}`;
          response.fileName = fileName; // 返回的文件名
          response.fileContent = fileData[fileName]; // 模拟的文件内容
        } else {
          response.output = "密码错误，请重新输入。输入 'cancel' 退出。";
        }
      } else {
        response.output = `错误: 指令 '${cmd}' 不存在. 输入 'help' 查询可行指令`;
      }
      break;
  }

  response.prompt = `[${state.currentUser}] ${state.currentDirectory} > `;
  return res.status(200).json(response);
}

// 获取上一级目录
function getParentDirectory(path) {
  if (path === "/") return null;
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}
