export default function handler(req, res) {
    if (req.method === "POST") {
      const { input } = req.body;
  
      if (!input || typeof input !== "string") {
        return res.status(400).json({ message: "无效的输入，请重新输入。" });
      }
  
      // 特殊指令处理
      if (input === "96202-2686LaFin") {
        return res.status(200).json({
          redirect: true,
          url: "/i3n1n4e1r5c9o2m6m2a7n1d/command.html", // 指向特殊指令的页面
        });
      }
  
      // 检查记录编号是否存在
      const baseUrl = "https://www.invisib1emem0ry.icu/wzesbxszistxez/logs/"; // 替换为实际的基础 URL
      const targetUrl = `${baseUrl}${input}.html`;
  
      // 模拟记录检查逻辑（您可以替换为真实的数据库或文件检查逻辑）
      const existingRecords = ["DG-161211", "DG-180904", "DG-190824", "DG-200716", "DG-220924", "DG-240413", "历史真实性研究报告"]; // 示例存在的记录
  
      if (existingRecords.includes(input)) {
        // 如果记录存在，返回跳转 URL
        return res.status(200).json({
          redirect: true,
          url: targetUrl,
        });
      } else {
        // 如果记录不存在，返回提示信息
        return res.status(404).json({
          redirect: false,
          message: "未找到记录，请检查输入编号！",
        });
      }
    } else {
      // 如果不是 POST 请求，返回 405 Method Not Allowed
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end("Method Not Allowed");
    }
  }