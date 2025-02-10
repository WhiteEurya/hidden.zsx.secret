// 模拟文件系统和用户登录信息
const fileSystem = {
    "/": ["home", "downloads", "documents", "file1.txt", "file2.txt"],
    "/home": ["user1", "user2"],
    "/downloads": ["movie.mp4", "music.mp3"],
    "/documents": ["report.docx", "presentation.pptx"],
  };
  
  // 用户登录信息
  const validCredentials = { username: "admin", password: "1234" };
  
  // 初始状态
  let state = {
    currentDirectory: "/",
    loggedIn: false,
    currentUser: "guest",
    loginStep: null, // 当前登录步骤：null、"username"、"password"
    tempUsername: "", // 临时存储用户名
    passwordInput: "", // 临时存储密码
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
    access <file>     - 访问目标文件
    login             - 登录
    clear             - 清空终端`;
        break;
  
      case "ls":
        if (fileSystem[state.currentDirectory]) {
          response.output = fileSystem[state.currentDirectory].join("\n");
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
          if (
            fileSystem[state.currentDirectory] &&
            fileSystem[state.currentDirectory].includes(targetFile)
          ) {
            if (state.loggedIn) {
              response.output = `您可以访问 '${targetFile}'.`;
            } else {
              response.output = "错误：权限不足。";
            }
          } else {
            response.output = `错误：文件 '${targetFile}' 不存在`;
          }
        }
        break;
  
      case "login":
        if (state.loggedIn) {
          response.output = "您已登录";
        } else {
          state.loginStep = "username"; // 启动登录流程
          response.output = "请输入用户名:";
        }
        break;
  
      case "clear":
        response.output = "";
        break;
  
      default:
        response.output = `错误: 指令 '${cmd}' 不存在. 输入 'help' 查询可行指令`;
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