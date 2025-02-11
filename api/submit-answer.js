export default function handler(req, res) {
    if (req.method === "POST") {
      const { answer } = req.body;
  
      // 预定义正确答案
      const correctAnswer = "96202-2686LaFin"; // 替换为你的正确答案
  
      // 判断用户答案是否正确
      if (answer === correctAnswer) {
        return res.status(200).json({
          correct: true,
          redirectUrl: "https://www.invisib1emem0ry.icu/i3n1n4e1r5c9o2m6m2a7n1d/command.html", // 正确答案跳转地址
        });
      } else {
        return res.status(200).json({
          correct: false,
          redirectUrl: "https://www.invisib1emem0ry.icu/pages/j5o1i4nwuesno.html", // 错误答案跳转地址
        });
      }
    } else {
      // 非 POST 请求，返回错误
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  }