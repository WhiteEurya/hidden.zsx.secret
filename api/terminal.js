import path from "path";
import fs from "fs";

const fileSystem = {
  "/": ["usr", "data", "logs", ".sys_config", "README.md"],
  "/usr": ["N17", "accompany", "65", "blackbird"],
  "/usr/N17": ["众生相的真相.docx"],
  "/usr/accompany": ["认知留存分析实验细则.docx"],
  "/usr/65":["日记.docx"],
  "/usr/blackbird":["辞职信.docx"],
  "/data": [],
  "/logs": [],
};

// 用于模拟文件的内容
const fileContents = {
  "认知留存分析实验细则.docx": 
  `实验名称：记忆恢复方法探究 \n
  对外实验名称：认知留存分析 \n

  实验专员：奥康普尼、N17、黑鸟、柳屋 \n

  实验目的: \n

  探究复原记忆体1号被篡改的记忆（有关记忆体1号被篡改的记忆详见附录1）的方法 \n

  参与者信息 \n
  筛选目标：年龄18至60岁之间、无严重认知障碍或精神健康问题 \n

  实验流程 \n
  1.召集参与者，在召集的同时进行催眠，是参与者遗忘该实验（已完成，2023-11-03）（有关遗忘的方法详见附录2） \n
  2.观察参与者的日常，确认与记忆体1号的状况相符（已完成，2023-11-03——2024-08-17） \n
  3.重新召集参与者，对其进行多种实验以探究不同方法是否可行（进行中）\n

  附录1：记忆体1号是最早制作的记忆体，有众生相第2代领导人的脑部制作。但由于不明原因，能够确定记忆体1号的记忆被非自然因素篡改，导致对秦朝几乎所有历史记载完全混乱。\n
  附录2：遗忘的方法由尼采首先提出，通过奥康普尼研发的XX号药剂，是实验体产生幻觉，在利用魔法物品彻底将这段幻觉替代原有记忆，完成遗忘。\n

  本文件为组织最高机密，切勿外传。\n


  接下来的话，是写给本不该看到这个记录的人。\n

  众生相的本质是记录者，记录着人类真正的历史，无论统治者因何目的试图扭曲历史，众生相的记录永远是真实的。\n
  然而在秦朝灭亡之时，一股神秘的力量篡改了众生相内部对历史的记录。直到数十年前对记忆体1号进行检测维护时才发现记忆体1号的记忆混乱现象。\n
  基于记忆混乱现象，我们制定了多个计划试图解决，最后发现只有一个计划似乎可行——记忆唤醒计划。为了保证计划的成功，毕竟我们的机会只有一次，我们展开了针对存活人类记忆唤醒的研究。\n
  通过心理实验的名义召集了一批受试者，通过催眠的手段将他们参加这次实验的记忆消除，随后重新以心理实验的名义再次召集这些受试者，使用不同的方式唤醒他们上次实验的记忆，通过观察得到唤醒人类记忆的有效方法。

  我没有强迫你们的能力。但我希望你们考虑一下你们接下来的行动。\n
  你们能看到这里，想必是十分优秀的人才，你们是我们最需要的力量。\n
  如果你们愿意继续帮助实验，那么就向我们的邮箱 InvisibleMemory@163.com 发送下面的《认知留存分析知情同意书》：\n


	我已充分理解相关信息，我自愿参与本次研究。我明白参与过程中可能存在的风险和副作用，愿意承担由此可能带来的风险。我自愿遵守参与者责任和义务。\n
	签署受试者学号 \n
	【学号】____________

  `,
  "众生相的真相.docx": `

    ⠀⠀⠀⠀⠀⠀⠀⠀ ⢀⠤⠒⠒⠒⠒⠠⢄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠞⠀⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⢻⠄⢠⠔⠒⠒⠒⠒⠒⢢⡀⢸⡄⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⡼⠀⠇⠀⠀⠀⠀⠀⠀⠀⢳⢸⠂⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⣀⣹⠞⠀⠀⠀⠀⠀⠀⠀⠀⣸⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠹⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡅⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠙⢲⠀⠀⠀⠀⠀⠀⠀⢠⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⢠⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠀⠀⠀⠀⠀⠀⢸⡧⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⢀⡠⠔⢚⡟⡏⠉⠙⡇⠀⠀⣠⠟⡇⠀⠉⠁⠀⠒⠠⠄⣀⠀⠀⠀
  ⠀⣠⠔⠊⠁⠀⠀⢸⠀⡇⠀⢰⠃⣀⠜⠁⢰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠈⠳⡀
  ⡞⠀⠀⠀⠀⠀⠀⢸⣀⣇⣀⣸⣯⡁⠀⡠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹
  ⡇⠀⠀⠀⠀⠀⠀⠈⢹⣰⠛⡆⠀⠈⠉⢰⠃⠀⠀⠀⠀⣴⠶⡀⠀⠀⠀⠀⢸
  ⡇⠀⠀⠀⠀⠀⠀⠀⢸⣟⠀⡇⠀⠀⠀⢸⠀⠀⠀⠀⠀⢹⠀⢇⠀⢴⣦⠀⣏
  ⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣴⠃⠀⠀⠀⢸⡄⠀⠀⠀⠀⢈⠀⠈⣓⢻⡟⢱⡛
  
  `,
  "日记.docx":`
  4月1日
  玩For the King.

  4月2日
  玩For the King.

  4月3日
  玩For the King.

  4月4日
  玩For the King.

  4月5日
  柳屋啊柳屋，组织的任务还没完成，你要赶紧为N17和黑鸟的实验提供解释！不能再这么懒散下去了！不能再玩For the King了！.

  4月6日
  玩比撤的给台。豪玩。
  
  `,
  "辞职信.docx":`
  主题：关于实验
  时间：2016/6/1\n
  我已经受够了！
  我已经受够了奥康普尼那个混蛋总是变更需求了！
  实验明明已经完成了80%了，突然就改需求说这个实验要作废？
  那为什么要我做这些破实验？\n
  已经无数次了，每次都在变更需求，说的很好听，说这样做肯定更有效果……
  可事实呢？我们可能连个成果都做不出来！\n
  工资只有那么可怜的一丁点，整天在给我们画饼，宣讲什么独立精神。
  可事实是他自己根本连自己想要什么实验都不清楚。\n
  我已经受够了，我要离开这，下周我就走。
  `
  
};

const filePasswords = {
  "认知留存分析实验细则.docx": "1874",
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
          response.output = "密码错误，请重新输入（或输入 'exit' 退出）。提示：“以防又嗑药磕多了，留下一个提示：我经历了多少次才成功？”";
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